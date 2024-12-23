import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
  },
})
export class ChatGateway {
  constructor(private chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() message: string): Promise<void> {
    this.server.emit('message', message);
    await this.processTokens(this.chatService.generateStreamResponse(message));
  }

  @SubscribeMessage('start')
  async handleStart(): Promise<void> {
    await this.processTokens(this.chatService.startConnection());
  }

  private async processTokens(
    tokenStream: AsyncIterable<string>,
  ): Promise<void> {
    let isGeneratingReport = false;

    for await (const token of tokenStream) {
      if (!isGeneratingReport) {
        if (token.includes('~~~~')) {
          isGeneratingReport = true;
          this.server.emit('conversation', { token: '', isComplete: true });
        } else {
          this.server.emit('conversation', { token, isComplete: false });
        }
      } else {
        this.server.emit('report', { token, isComplete: false });
      }
    }
    
    if (isGeneratingReport) {
      this.server.emit('report', { token: '', isComplete: true });
    }
  }
}
