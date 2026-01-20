import { Module } from '@nestjs/common';
import { GitHubController } from './github.controller';
import { GitHubService } from './services/github.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [GitHubController],
  providers: [GitHubService],
  exports: [GitHubService],
})
export class GitHubModule {}

