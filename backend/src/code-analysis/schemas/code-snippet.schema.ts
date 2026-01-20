import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CodeSnippetDocument = CodeSnippet & Document;

@Schema({ timestamps: true })
export class CodeSnippet {
  @Prop({ type: Types.ObjectId, ref: 'CodeSession', required: true })
  sessionId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  lineCount: number;

  @Prop({ required: false })
  path?: string; // For GitHub files
}

export const CodeSnippetSchema = SchemaFactory.createForClass(CodeSnippet);

