import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  async getProgress(@CurrentUser() user: any) {
    return this.progressService.getProgress(user.userId);
  }

  @Get('mistakes')
  async getCommonMistakes(
    @CurrentUser() user: any,
    @Query('limit') limit?: string,
  ) {
    return this.progressService.getCommonMistakes(user.userId, limit ? parseInt(limit) : 10);
  }

  @Get('languages')
  async getLanguageProficiency(@CurrentUser() user: any) {
    return this.progressService.getLanguageProficiency(user.userId);
  }
}

