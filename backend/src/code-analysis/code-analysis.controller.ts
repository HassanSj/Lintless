import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CodeAnalysisService } from './services/code-analysis.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('code-analysis')
@UseGuards(JwtAuthGuard)
export class CodeAnalysisController {
  constructor(private readonly codeAnalysisService: CodeAnalysisService) {}

  @Post('sessions')
  @HttpCode(HttpStatus.CREATED)
  async createSession(
    @CurrentUser() user: any,
    @Body() createSessionDto: CreateSessionDto,
  ) {
    return this.codeAnalysisService.createSession(user.userId, createSessionDto);
  }

  @Get('sessions')
  async getSessions(@CurrentUser() user: any) {
    return this.codeAnalysisService.getSessionsByUser(user.userId);
  }

  @Get('sessions/:id')
  async getSession(@CurrentUser() user: any, @Param('id') id: string) {
    return this.codeAnalysisService.getSession(id, user.userId);
  }

  @Get('sessions/:id/feedback')
  async getFeedback(@Param('id') id: string) {
    return this.codeAnalysisService.getFeedbackBySession(id);
  }

  @Post('sessions/:id/refactor')
  @HttpCode(HttpStatus.OK)
  async refactorCode(
    @Param('id') sessionId: string,
    @Body() body: { feedbackId: string },
  ) {
    return this.codeAnalysisService.refactorCode(sessionId, body.feedbackId);
  }
}

