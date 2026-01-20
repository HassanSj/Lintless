import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CodeAnalysisService } from '../code-analysis/services/code-analysis.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/feedback',
})
export class WebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebSocketGateway.name);
  private connectedClients = new Map<string, Socket>();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private codeAnalysisService: CodeAnalysisService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET') || 'your-secret-key',
      });

      client.data.userId = payload.sub;
      this.connectedClients.set(client.id, client);
      this.logger.log(`Client connected: ${client.id} (User: ${payload.sub})`);
    } catch (error) {
      this.logger.warn(`Client connection failed: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe-session')
  async handleSubscribeSession(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`session:${data.sessionId}`);
    this.logger.log(`Client ${client.id} subscribed to session ${data.sessionId}`);
    return { success: true };
  }

  @SubscribeMessage('unsubscribe-session')
  async handleUnsubscribeSession(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`session:${data.sessionId}`);
    this.logger.log(`Client ${client.id} unsubscribed from session ${data.sessionId}`);
    return { success: true };
  }

  // Method to emit feedback updates to clients
  emitFeedbackUpdate(sessionId: string, data: any) {
    this.server.to(`session:${sessionId}`).emit('feedback-update', data);
  }

  // Method to emit analysis status updates
  emitAnalysisStatus(sessionId: string, status: string, message?: string) {
    this.server.to(`session:${sessionId}`).emit('analysis-status', {
      status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}

