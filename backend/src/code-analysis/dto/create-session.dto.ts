import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import { SessionSource } from '../schemas/code-session.schema';

export class CreateSessionDto {
  @IsString()
  title: string;

  @IsString()
  language: string;

  @IsEnum(SessionSource)
  source: SessionSource;

  @IsOptional()
  @IsString()
  codeSnippet?: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  githubRepoUrl?: string;

  @IsOptional()
  @IsString()
  githubBranch?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  filePaths?: string[];
}

