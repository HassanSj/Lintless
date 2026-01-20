import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CodeSessionDocument = CodeSession & Document;

export enum SessionSource {
  SNIPPET = 'snippet',
  GITHUB = 'github',
}

export enum SessionStatus {
  PENDING = 'pending',
  ANALYZING = 'analyzing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Schema({ timestamps: true })
export class CodeSession {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  language: string;

  @Prop({ enum: SessionSource, required: true })
  source: SessionSource;

  @Prop({ enum: SessionStatus, default: SessionStatus.PENDING })
  status: SessionStatus;

  @Prop({ required: false })
  githubRepoUrl?: string;

  @Prop({ required: false })
  githubBranch?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CodeSessionSchema = SchemaFactory.createForClass(CodeSession);

