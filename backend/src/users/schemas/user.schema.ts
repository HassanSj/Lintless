import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ required: false })
  githubUsername?: string;

  @Prop({ required: false })
  githubAccessToken?: string;

  @Prop({
    type: {
      languageFocus: [String],
      skillLevel: { type: String, enum: SkillLevel },
    },
    default: {
      languageFocus: [],
      skillLevel: SkillLevel.BEGINNER,
    },
  })
  preferences: {
    languageFocus: string[];
    skillLevel: SkillLevel;
  };

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

