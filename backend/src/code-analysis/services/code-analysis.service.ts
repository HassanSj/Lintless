import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CodeSession, CodeSessionDocument, SessionStatus } from '../schemas/code-session.schema';
import { CodeSnippet, CodeSnippetDocument } from '../schemas/code-snippet.schema';
import { Feedback, FeedbackDocument } from '../schemas/feedback.schema';
import { AIUsageLog, AIUsageLogDocument } from '../schemas/ai-usage-log.schema';
import { OpenAIService } from './openai.service';
import { UsersService } from '../../users/users.service';
import { ProgressService } from '../../progress/progress.service';
import { WebSocketGateway } from '../../websocket/websocket.gateway';
import { CreateSessionDto } from '../dto/create-session.dto';

@Injectable()
export class CodeAnalysisService {
  private readonly logger = new Logger(CodeAnalysisService.name);

  constructor(
    @InjectModel(CodeSession.name) private sessionModel: Model<CodeSessionDocument>,
    @InjectModel(CodeSnippet.name) private snippetModel: Model<CodeSnippetDocument>,
    @InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>,
    @InjectModel(AIUsageLog.name) private usageLogModel: Model<AIUsageLogDocument>,
    @InjectQueue('code-analysis') private analysisQueue: Queue,
    private openaiService: OpenAIService,
    private usersService: UsersService,
    private progressService: ProgressService,
    private websocketGateway: WebSocketGateway,
  ) {}

  async createSession(userId: string, createSessionDto: CreateSessionDto): Promise<CodeSessionDocument> {
    const session = new this.sessionModel({
      userId: new Types.ObjectId(userId),
      title: createSessionDto.title,
      language: createSessionDto.language,
      source: createSessionDto.source,
      status: SessionStatus.PENDING,
      githubRepoUrl: createSessionDto.githubRepoUrl,
      githubBranch: createSessionDto.githubBranch,
    });

    await session.save();

    // Create code snippet if provided
    if (createSessionDto.codeSnippet) {
      const snippet = new this.snippetModel({
        sessionId: session._id,
        content: createSessionDto.codeSnippet,
        fileName: createSessionDto.fileName || 'code.txt',
        lineCount: createSessionDto.codeSnippet.split('\n').length,
      });
      await snippet.save();
    }

    // Queue analysis job
    await this.analysisQueue.add('analyze-code', {
      sessionId: session._id.toString(),
      userId,
    });

    return session;
  }

  async getSession(sessionId: string, userId: string): Promise<CodeSessionDocument> {
    const session = await this.sessionModel.findOne({
      _id: sessionId,
      userId: new Types.ObjectId(userId),
    }).exec();

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async getSessionsByUser(userId: string): Promise<CodeSessionDocument[]> {
    return this.sessionModel.find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getFeedbackBySession(sessionId: string): Promise<FeedbackDocument[]> {
    return this.feedbackModel.find({ sessionId: new Types.ObjectId(sessionId) }).exec();
  }

  async analyzeCode(sessionId: string, userId: string): Promise<void> {
    const session = await this.sessionModel.findById(sessionId).exec();
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    session.status = SessionStatus.ANALYZING;
    await session.save();

    // Emit status update
    this.websocketGateway.emitAnalysisStatus(sessionId, 'analyzing', 'Starting code analysis...');

    try {
      const snippets = await this.snippetModel.find({ sessionId: session._id }).exec();
      if (snippets.length === 0) {
        throw new Error('No code snippets found for session');
      }

      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      let totalTokens = 0;
      let totalCost = 0;
      const allPersonalityTraits: string[] = [];

      for (const snippet of snippets) {
        const analysis = await this.openaiService.analyzeCode(
          snippet.content,
          session.language,
          user.preferences?.skillLevel,
          true,
        );

        // Save feedback
        for (const feedbackItem of analysis.feedback) {
          const feedback = new this.feedbackModel({
            sessionId: session._id,
            snippetId: snippet._id,
            category: feedbackItem.category,
            severity: feedbackItem.severity,
            message: feedbackItem.message,
            suggestion: feedbackItem.suggestion,
            codeExample: feedbackItem.codeExample,
            lineNumber: feedbackItem.lineNumber,
          });
          await feedback.save();

          // Emit real-time feedback update
          this.websocketGateway.emitFeedbackUpdate(sessionId, {
            category: feedbackItem.category,
            severity: feedbackItem.severity,
            message: feedbackItem.message,
            suggestion: feedbackItem.suggestion,
          });
        }

        // Collect personality traits
        if (analysis.personalityTraits) {
          allPersonalityTraits.push(...analysis.personalityTraits);
        }

        // Estimate tokens and cost
        const tokens = await this.openaiService.estimateTokens(snippet.content);
        const cost = await this.openaiService.estimateCost(tokens);
        totalTokens += tokens;
        totalCost += cost;
      }

      // Log AI usage
      const usageLog = new this.usageLogModel({
        userId: new Types.ObjectId(userId),
        sessionId: session._id,
        tokensUsed: totalTokens,
        costEstimate: totalCost,
        model: 'gpt-4-turbo-preview',
      });
      await usageLog.save();

      // Update progress stats
      await this.progressService.updateProgress(userId, session._id.toString(), allPersonalityTraits);

      session.status = SessionStatus.COMPLETED;
      await session.save();

      // Emit completion status
      this.websocketGateway.emitAnalysisStatus(sessionId, 'completed', 'Analysis completed successfully!');
      this.logger.log(`Analysis completed for session ${sessionId}`);
    } catch (error) {
      this.logger.error(`Analysis failed for session ${sessionId}:`, error);
      session.status = SessionStatus.FAILED;
      await session.save();
      
      // Emit error status
      this.websocketGateway.emitAnalysisStatus(sessionId, 'failed', `Analysis failed: ${error.message}`);
      throw error;
    }
  }

  async refactorCode(sessionId: string, feedbackId: string): Promise<{ refactoredCode: string; explanation: string }> {
    const feedback = await this.feedbackModel.findById(feedbackId).exec();
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    const snippet = await this.snippetModel.findById(feedback.snippetId).exec();
    if (!snippet) {
      throw new NotFoundException('Code snippet not found');
    }

    const session = await this.sessionModel.findById(sessionId).exec();
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return this.openaiService.refactorCode(
      snippet.content,
      session.language,
      feedback.suggestion,
    );
  }
}

