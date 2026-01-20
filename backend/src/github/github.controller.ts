import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { GitHubService } from './services/github.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('github')
@UseGuards(JwtAuthGuard)
export class GitHubController {
  constructor(private readonly githubService: GitHubService) {}

  @Post('connect')
  async connectGitHub(
    @CurrentUser() user: any,
    @Body() body: { accessToken: string },
  ) {
    await this.githubService.connectGitHub(user.userId, body.accessToken);
    return { message: 'GitHub account connected successfully' };
  }

  @Get('repositories')
  async getRepositories(@CurrentUser() user: any) {
    return this.githubService.getRepositories(user.userId);
  }

  @Get('repositories/:owner/:repo/files')
  async getRepositoryFiles(
    @CurrentUser() user: any,
    @Query('branch') branch: string,
    @Query('language') language?: string,
  ) {
    // Note: This would need route params in real implementation
    // Simplified for now
    return { message: 'Use POST /code-analysis/sessions with githubRepoUrl' };
  }
}

