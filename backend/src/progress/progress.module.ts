import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { ProgressStats, ProgressStatsSchema } from './schemas/progress-stats.schema';
import { Feedback, FeedbackSchema } from '../code-analysis/schemas/feedback.schema';
import { CodeSession, CodeSessionSchema } from '../code-analysis/schemas/code-session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProgressStats.name, schema: ProgressStatsSchema },
      { name: Feedback.name, schema: FeedbackSchema },
      { name: CodeSession.name, schema: CodeSessionSchema },
    ]),
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}

