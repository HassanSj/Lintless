import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { FeedbackCategory, FeedbackSeverity } from '../schemas/feedback.schema';
import { SkillLevel } from '../../users/schemas/user.schema';

export interface CodeAnalysisResult {
  feedback: Array<{
    category: FeedbackCategory;
    severity: FeedbackSeverity;
    message: string;
    suggestion: string;
    codeExample?: string;
    lineNumber?: number;
  }>;
  summary: string;
  overallScore: number;
  personalityTraits?: string[];
}

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async analyzeCode(
    code: string,
    language: string,
    skillLevel: SkillLevel = SkillLevel.BEGINNER,
    includePersonality: boolean = false,
  ): Promise<CodeAnalysisResult> {
    const prompt = this.buildAnalysisPrompt(code, language, skillLevel, includePersonality);

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.configService.get<string>('OPENAI_MODEL') || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert code reviewer and mentor. Provide actionable, specific feedback in structured JSON format.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('Empty response from OpenAI');
      }

      const parsed = JSON.parse(responseContent);
      return this.parseAnalysisResponse(parsed);

    } catch (error) {
      this.logger.error('OpenAI analysis error:', error);
      throw new Error(`Failed to analyze code: ${error.message}`);
    }
  }

  async refactorCode(
    code: string,
    language: string,
    feedback: string,
  ): Promise<{ refactoredCode: string; explanation: string }> {
    const prompt = `Refactor the following ${language} code based on this feedback: "${feedback}"

Original code:
\`\`\`${language}
${code}
\`\`\`

Provide:
1. The refactored code
2. A detailed explanation of what changed and why

Respond in JSON format:
{
  "refactoredCode": "...",
  "explanation": "..."
}`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.configService.get<string>('OPENAI_MODEL') || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert code refactoring assistant. Provide clean, improved code with clear explanations.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('Empty response from OpenAI');
      }

      return JSON.parse(responseContent);
    } catch (error) {
      this.logger.error('OpenAI refactor error:', error);
      throw new Error(`Failed to refactor code: ${error.message}`);
    }
  }

  async detectPersonality(code: string, language: string): Promise<string[]> {
    const prompt = `Analyze the coding style and patterns in this ${language} code. Identify personality traits that describe the developer's approach.

Code:
\`\`\`${language}
${code}
\`\`\`

Respond with a JSON array of personality traits (e.g., ["Performance-Driven", "Clean Architect", "Security-Conscious", "Minimalist", "Verbose", "Functional-Thinker"]).`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.configService.get<string>('OPENAI_MODEL') || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at analyzing coding styles and developer personalities.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5,
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        return [];
      }

      const parsed = JSON.parse(responseContent);
      return parsed.traits || [];
    } catch (error) {
      this.logger.error('Personality detection error:', error);
      return [];
    }
  }

  private buildAnalysisPrompt(
    code: string,
    language: string,
    skillLevel: SkillLevel,
    includePersonality: boolean,
  ): string {
    const skillContext = {
      [SkillLevel.BEGINNER]: 'The developer is a beginner. Provide encouraging, educational feedback with clear explanations.',
      [SkillLevel.INTERMEDIATE]: 'The developer is intermediate. Provide advanced tips and best practices.',
      [SkillLevel.ADVANCED]: 'The developer is advanced. Focus on optimization, architecture, and edge cases.',
    };

    return `Analyze the following ${language} code. ${skillContext[skillLevel]}

Code:
\`\`\`${language}
${code}
\`\`\`

Provide comprehensive feedback in the following JSON structure:
{
  "feedback": [
    {
      "category": "performance" | "security" | "readability" | "architecture" | "best_practices",
      "severity": "low" | "medium" | "high",
      "message": "Clear description of the issue",
      "suggestion": "Specific actionable suggestion",
      "codeExample": "Optional improved code example",
      "lineNumber": 0
    }
  ],
  "summary": "Overall assessment of the code",
  "overallScore": 0-100,
  ${includePersonality ? '"personalityTraits": ["trait1", "trait2"]' : ''}
}

Focus on:
- Performance optimizations
- Security vulnerabilities
- Code readability and maintainability
- Architectural improvements
- Best practices for ${language}
- Specific, actionable suggestions (not generic advice)`;
  }

  private parseAnalysisResponse(parsed: any): CodeAnalysisResult {
    return {
      feedback: (parsed.feedback || []).map((f: any) => ({
        category: f.category || FeedbackCategory.BEST_PRACTICES,
        severity: f.severity || FeedbackSeverity.MEDIUM,
        message: f.message || '',
        suggestion: f.suggestion || '',
        codeExample: f.codeExample,
        lineNumber: f.lineNumber,
      })),
      summary: parsed.summary || '',
      overallScore: parsed.overallScore || 0,
      personalityTraits: parsed.personalityTraits,
    };
  }

  async estimateTokens(text: string): Promise<number> {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  async estimateCost(tokens: number, model: string = 'gpt-4-turbo-preview'): Promise<number> {
    // Pricing as of 2024 (adjust as needed)
    const pricing: Record<string, { input: number; output: number }> = {
      'gpt-4-turbo-preview': { input: 0.01 / 1000, output: 0.03 / 1000 },
      'gpt-4': { input: 0.03 / 1000, output: 0.06 / 1000 },
      'gpt-3.5-turbo': { input: 0.0015 / 1000, output: 0.002 / 1000 },
    };

    const modelPricing = pricing[model] || pricing['gpt-4-turbo-preview'];
    // Assume 70% input, 30% output
    return tokens * 0.7 * modelPricing.input + tokens * 0.3 * modelPricing.output;
  }
}

