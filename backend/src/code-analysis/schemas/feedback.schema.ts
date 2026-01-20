import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

export enum FeedbackCategory {
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  READABILITY = 'readability',
  ARCHITECTURE = 'architecture',
  BEST_PRACTICES = 'best_practices',
}

export enum FeedbackSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Schema({ timestamps: true })
export class Feedback {
  @Prop({ type: Types.ObjectId, ref: 'CodeSession', required: true })
  sessionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'CodeSnippet', required: false })
  snippetId?: Types.ObjectId;

  @Prop({ enum: FeedbackCategory, required: true })
  category: FeedbackCategory;

  @Prop({ enum: FeedbackSeverity, required: true })
  severity: FeedbackSeverity;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  suggestion: string;

  @Prop({ required: false })
  codeExample?: string;

  @Prop({ required: false })
  lineNumber?: number;

  @Prop({ required: false })
  columnNumber?: number;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);

