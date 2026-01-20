import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { CodeAnalysisController } from './code-analysis.controller';
import { CodeAnalysisService } from './services/code-analysis.service';
import { OpenAIService } from './services/openai.service';
import { CodeAnalysisProcessor } from './processors/code-analysis.processor';
import { CodeSession, CodeSessionSchema } from './schemas/code-session.schema';
import { CodeSnippet, CodeSnippetSchema } from './schemas/code-snippet.schema';
import { Feedback, FeedbackSchema } from './schemas/feedback.schema';
import { AIUsageLog, AIUsageLogSchema } from './schemas/ai-usage-log.schema';
import { UsersModule } from '../users/users.module';
import { ProgressModule } from '../progress/progress.module';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CodeSession.name, schema: CodeSessionSchema },
      { name: CodeSnippet.name, schema: CodeSnippetSchema },
      { name: Feedback.name, schema: FeedbackSchema },
      { name: AIUsageLog.name, schema: AIUsageLogSchema },
    ]),
    BullModule.registerQueue({
      name: 'code-analysis',
    }),
    UsersModule,
    ProgressModule,
    WebSocketModule,
  ],
  controllers: [CodeAnalysisController],
  providers: [CodeAnalysisService, OpenAIService, CodeAnalysisProcessor],
  exports: [CodeAnalysisService],
})
export class CodeAnalysisModule {}

