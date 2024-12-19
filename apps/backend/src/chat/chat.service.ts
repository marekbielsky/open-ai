import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateResponse(message: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: message }],
        model: 'gpt-3.5-turbo',
      });

      return completion.choices[0].message.content || 'No response generated';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return 'Sorry, I encountered an error processing your request.';
    }
  }
}
