import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AIUsageLogDocument = AIUsageLog & Document;

@Schema({ timestamps: true })
export class AIUsageLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'CodeSession', required: false })
  sessionId?: Types.ObjectId;

  @Prop({ required: true })
  tokensUsed: number;

  @Prop({ required: true })
  costEstimate: number;

  @Prop({ required: true })
  model: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const AIUsageLogSchema = SchemaFactory.createForClass(AIUsageLog);

