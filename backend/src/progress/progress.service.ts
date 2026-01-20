import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProgressStats, ProgressStatsDocument } from './schemas/progress-stats.schema';
import { Feedback, FeedbackDocument } from '../code-analysis/schemas/feedback.schema';
import { CodeSession, CodeSessionDocument } from '../code-analysis/schemas/code-session.schema';

@Injectable()
export class ProgressService {
  private readonly logger = new Logger(ProgressService.name);

  constructor(
    @InjectModel(ProgressStats.name) private progressModel: Model<ProgressStatsDocument>,
    @InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>,
    @InjectModel(CodeSession.name) private sessionModel: Model<CodeSessionDocument>,
  ) {}

  async updateProgress(userId: string, sessionId: string, personalityTraits: string[]): Promise<void> {
    let stats = await this.progressModel.findOne({ userId: new Types.ObjectId(userId) }).exec();

    if (!stats) {
      stats = new this.progressModel({
        userId: new Types.ObjectId(userId),
        totalSubmissions: 0,
        commonMistakes: [],
        improvementScore: 0,
        languageProficiency: new Map(),
      });
    }

    // Update total submissions
    stats.totalSubmissions += 1;
    stats.lastAnalyzedAt = new Date();

    // Get feedback for this session
    const feedback = await this.feedbackModel.find({ sessionId: new Types.ObjectId(sessionId) }).exec();

    // Update common mistakes
    for (const item of feedback) {
      const existingMistake = stats.commonMistakes.find((m) => m.mistake === item.message);
      if (existingMistake) {
        existingMistake.count += 1;
        existingMistake.lastOccurred = new Date();
      } else {
        stats.commonMistakes.push({
          mistake: item.message,
          count: 1,
          lastOccurred: new Date(),
        });
      }
    }

    // Update personality profile
    if (personalityTraits.length > 0) {
      const traitCounts = new Map<string, number>();
      personalityTraits.forEach((trait) => {
        traitCounts.set(trait, (traitCounts.get(trait) || 0) + 1);
      });

      const mostCommonTrait = Array.from(traitCounts.entries()).sort((a, b) => b[1] - a[1])[0];
      stats.codePersonality = {
        label: mostCommonTrait[0],
        confidence: mostCommonTrait[1] / personalityTraits.length,
        traits: Array.from(traitCounts.keys()),
      };
    }

    // Calculate improvement score (simplified - can be enhanced)
    const highSeverityCount = feedback.filter((f) => f.severity === 'high').length;
    const totalFeedback = feedback.length;
    const score = totalFeedback > 0 ? Math.max(0, 100 - (highSeverityCount / totalFeedback) * 100) : 0;
    stats.improvementScore = Math.round((stats.improvementScore + score) / 2);

    // Update language proficiency
    const session = await this.sessionModel.findById(sessionId).exec();
    if (session) {
      const currentProficiency = stats.languageProficiency.get(session.language) || 0;
      stats.languageProficiency.set(session.language, currentProficiency + 1);
    }

    await stats.save();
  }

  async getProgress(userId: string): Promise<ProgressStatsDocument | null> {
    return this.progressModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
  }

  async getCommonMistakes(userId: string, limit: number = 10): Promise<Array<{ mistake: string; count: number }>> {
    const stats = await this.progressModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
    if (!stats) {
      return [];
    }

    return stats.commonMistakes
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map((m) => ({ mistake: m.mistake, count: m.count }));
  }

  async getLanguageProficiency(userId: string): Promise<Record<string, number>> {
    const stats = await this.progressModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
    if (!stats) {
      return {};
    }

    const proficiency: Record<string, number> = {};
    stats.languageProficiency.forEach((value, key) => {
      proficiency[key] = value;
    });
    return proficiency;
  }
}

