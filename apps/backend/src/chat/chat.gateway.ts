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

    for await (const token of this.chatService.generateStreamResponse(
      message,
    )) {
      this.server.emit('token', { token, isComplete: false });
    }
    this.server.emit('token', { token: '', isComplete: true });
  }
}
