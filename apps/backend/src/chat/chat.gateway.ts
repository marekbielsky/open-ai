import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import {User, UsersService} from '../users/users.service';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {JwtTokenPayload} from '../auth/auth.service';

interface SocketWithUserData extends Socket {
  user: User,
  chatId: string,
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
  },
})
export class ChatGateway implements OnGatewayConnection{
  constructor(
    private readonly chatService: ChatService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  @WebSocketServer()
    server: Server;

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() socket: SocketWithUserData,
    @MessageBody() message: string
  ): Promise<void> {
    this.server.emit('message', message);
    await this.processTokens(this.chatService.generateStreamResponse(
      socket.user.id,
      socket.chatId,
      message
    ));
  }

  @SubscribeMessage('start')
  async handleStart(@ConnectedSocket() socket: SocketWithUserData): Promise<void> {
    await this.processTokens(this.chatService.startConnection(socket.user.id, socket.chatId));
  }

  async handleConnection(@ConnectedSocket() socket: SocketWithUserData) {
    try {
      const token = socket.handshake.headers.authorization?.replace('Bearer ', '');
      const chatId = socket.handshake.query.reportId as string;

      if (!token || !chatId) {
        throw new Error('Authorization token or chatId is missing');
      }

      const payload = await this.jwtService.verifyAsync<JwtTokenPayload>(token);

      const user = await this.usersService.findOneByName(payload.name);

      if (!user) {
        throw new Error('User does not exist');
      }

      // TODO verify that the user is a chat owner

      socket.user = user;
      socket.chatId = chatId;
    } catch (e) {
      console.error(e);
      socket.disconnect();
    }

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
