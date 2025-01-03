import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { metrics, sampleReport } from '../data/sample-data';
import { UsersService } from '../users/users.service';

const systemMessage =
  'You are an experienced startup founder with a deep understanding of the Venture Capital game. Your task is to prepare an investor report about the recent progress of your business. Make sure to use a personal and encouraging writing style. Keep in mind that the goal is to maintain strong relationships with the investor community. Each section should add up to a concise, but compelling and exciting story about your startup. Use the information provided in the user prompt and provided tools to search for the information and to generate the report. First, generate the response to the user. It should be concise, 1-2 sentences, and only summarize how are you helping them. Note this is not supposed to be investor-friendly format. Then, separate sections with `~~~~`. Then return the investor-friendly report in a human-readable format, using markdown. Make sure the text is well-structured, easy to read and detailed. Never ask clarifying questions unless specifically told to. User may ask to refine the report. In this case, again return response to the user, then divide with `~~~~` and regenerate entire report with updates requested by the user. Do not add any text after the report and do not add `~~~~` at the end.';

const defaultSystemMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = { role: 'system', content: systemMessage };

@Injectable()
export class ChatService {
  private openai: OpenAI;
  private messages: {
    [userId: string]: {
      [chatId: string]: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
    }
  };
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    this.messages = {};
  }

  async *startConnection(userId: string, chatId: string) {
    if(!this.messages[userId]) {
      this.messages[userId] = {};
    }

    const userMessages = this.messages[userId][chatId];
    const user = await this.usersService.findOneById(userId);

    if(!userMessages) {
      this.messages[userId][chatId] = [defaultSystemMessage];
      const streamResponse = this.generateStreamResponse(
        userId,
        chatId,
        `
        Below is information about the user in JSON format:
        ${JSON.stringify(user)}
        
        Below is company financial data in CSV format:
        ${metrics}
        
        Below is example report. Extract structure from it and replace data and text with user-related data. Do not use any specific data from sample report for final report.
        ${sampleReport}
        
        I want to generate a report for year ${new Date().getFullYear()}.`);

      for await (const response of streamResponse) {
        yield response;
      }
    } else {
      const report = userMessages[userMessages.length - 1].content.toString().split('~~~~')[1];
      const toDisplay = `Restored session.\n~~~~\n${report}`;
      for (const word of toDisplay
        .toString()
        .split('\n')) {
        yield `\n${word}`;
      }
    }
  }

  async *generateStreamResponse(userId: string, chatId: string, message: string) {
    if(!this.messages[userId] || !this.messages[userId][chatId]) {
      throw new Error('Chat not started');
    }

    const userMessages = this.messages[userId][chatId];
    userMessages.push({ role: 'user', content: message });
    this.messages[userId][chatId] = userMessages;

    const assistantMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam =
      { role: 'assistant', content: '' };

    try {
      const stream = await this.openai.chat.completions.create({
        messages: userMessages,
        model: 'gpt-4o-mini',
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          assistantMessage.content += content;
          yield content;
        }
      }
      userMessages.push(assistantMessage);
      this.messages[userId][chatId] = userMessages;
    } catch (error) {
      this.logger.error('OpenAI API error:', error);
      yield 'Sorry, I encountered an error processing your request.';
    } finally {
      this.logger.log('messages', JSON.stringify(this.messages[userId][chatId]));
    }
  }
}
