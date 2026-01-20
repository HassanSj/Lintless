import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProgressStatsDocument = ProgressStats & Document;

@Schema({ timestamps: true })
export class ProgressStats {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ default: 0 })
  totalSubmissions: number;

  @Prop({
    type: [
      {
        mistake: String,
        count: Number,
        lastOccurred: Date,
      },
    ],
    default: [],
  })
  commonMistakes: Array<{
    mistake: string;
    count: number;
    lastOccurred: Date;
  }>;

  @Prop({ default: 0, min: 0, max: 100 })
  improvementScore: number;

  @Prop({ required: false })
  lastAnalyzedAt?: Date;

  @Prop({
    type: Map,
    of: Number,
    default: {},
  })
  languageProficiency: Map<string, number>;

  @Prop({
    type: {
      label: String,
      confidence: Number,
      traits: [String],
    },
    required: false,
  })
  codePersonality?: {
    label: string;
    confidence: number;
    traits: string[];
  };
}

export const ProgressStatsSchema = SchemaFactory.createForClass(ProgressStats);

