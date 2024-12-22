import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class ChatService {
  private openai: OpenAI;
  private configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async *generateStreamResponse(message: string) {
    try {
      const stream = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: message }],
        model: 'gpt-3.5-turbo',
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      yield 'Sorry, I encountered an error processing your request.';
    }
  }
}
