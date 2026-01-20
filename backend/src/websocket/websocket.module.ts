import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { WebSocketGateway } from './websocket.gateway';
import { CodeAnalysisModule } from '../code-analysis/code-analysis.module';

@Module({
  imports: [ConfigModule, JwtModule, CodeAnalysisModule],
  providers: [WebSocketGateway],
  exports: [WebSocketGateway],
})
export class WebSocketModule {}

