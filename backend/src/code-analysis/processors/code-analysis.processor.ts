import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { CodeAnalysisService } from '../services/code-analysis.service';

@Processor('code-analysis')
export class CodeAnalysisProcessor extends WorkerHost {
  private readonly logger = new Logger(CodeAnalysisProcessor.name);

  constructor(private codeAnalysisService: CodeAnalysisService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing analysis job ${job.id} for session ${job.data.sessionId}`);

    try {
      await this.codeAnalysisService.analyzeCode(job.data.sessionId, job.data.userId);
      return { success: true };
    } catch (error) {
      this.logger.error(`Job ${job.id} failed:`, error);
      throw error;
    }
  }
}

