import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { UsersService } from '../../users/users.service';

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string;
  language: string;
  defaultBranch: string;
  private: boolean;
}

export interface GitHubFile {
  path: string;
  content: string;
  language: string;
  size: number;
}

@Injectable()
export class GitHubService {
  private readonly logger = new Logger(GitHubService.name);
  private githubApi: AxiosInstance;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    this.githubApi = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });
  }

  async getRepositories(userId: string): Promise<GitHubRepo[]> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.githubAccessToken) {
      throw new BadRequestException('GitHub account not connected');
    }

    try {
      const response = await this.githubApi.get('/user/repos', {
        headers: {
          Authorization: `token ${user.githubAccessToken}`,
        },
        params: {
          per_page: 100,
          sort: 'updated',
        },
      });

      return response.data.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        language: repo.language,
        defaultBranch: repo.default_branch,
        private: repo.private,
      }));
    } catch (error) {
      this.logger.error('Failed to fetch GitHub repositories:', error);
      throw new BadRequestException('Failed to fetch repositories');
    }
  }

  async getRepositoryFiles(
    userId: string,
    repoFullName: string,
    branch: string = 'main',
    language?: string,
  ): Promise<GitHubFile[]> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.githubAccessToken) {
      throw new BadRequestException('GitHub account not connected');
    }

    try {
      // Get repository tree
      const treeResponse = await this.githubApi.get(
        `/repos/${repoFullName}/git/trees/${branch}?recursive=1`,
        {
          headers: {
            Authorization: `token ${user.githubAccessToken}`,
          },
        },
      );

      const files: GitHubFile[] = [];
      const tree = treeResponse.data.tree;

      // Filter by language extensions
      const languageExtensions: Record<string, string[]> = {
        javascript: ['.js', '.jsx', '.ts', '.tsx'],
        python: ['.py'],
        java: ['.java'],
        go: ['.go'],
        rust: ['.rs'],
        cpp: ['.cpp', '.cc', '.cxx', '.hpp'],
        c: ['.c', '.h'],
      };

      const extensions = language ? languageExtensions[language.toLowerCase()] : null;

      for (const item of tree) {
        if (item.type === 'blob' && item.size < 100000) {
          // Skip files larger than 100KB
          const filePath = item.path;
          const fileExtension = filePath.substring(filePath.lastIndexOf('.'));

          if (!extensions || extensions.includes(fileExtension)) {
            try {
              // Fetch file content
              const contentResponse = await this.githubApi.get(
                `/repos/${repoFullName}/contents/${filePath}`,
                {
                  headers: {
                    Authorization: `token ${user.githubAccessToken}`,
                    Accept: 'application/vnd.github.v3.raw',
                  },
                  params: {
                    ref: branch,
                  },
                },
              );

              files.push({
                path: filePath,
                content: typeof contentResponse.data === 'string' ? contentResponse.data : '',
                language: this.detectLanguage(filePath),
                size: item.size,
              });
            } catch (error) {
              this.logger.warn(`Failed to fetch file ${filePath}:`, error);
            }
          }
        }
      }

      return files;
    } catch (error) {
      this.logger.error('Failed to fetch repository files:', error);
      throw new BadRequestException('Failed to fetch repository files');
    }
  }

  async connectGitHub(userId: string, accessToken: string): Promise<void> {
    try {
      // Verify token by fetching user info
      const response = await this.githubApi.get('/user', {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });

      await this.usersService.connectGitHub(
        userId,
        response.data.login,
        accessToken,
      );
    } catch (error) {
      this.logger.error('Failed to connect GitHub account:', error);
      throw new BadRequestException('Invalid GitHub access token');
    }
  }

  private detectLanguage(filePath: string): string {
    const extension = filePath.substring(filePath.lastIndexOf('.'));
    const languageMap: Record<string, string> = {
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.py': 'python',
      '.java': 'java',
      '.go': 'go',
      '.rs': 'rust',
      '.cpp': 'cpp',
      '.cc': 'cpp',
      '.cxx': 'cpp',
      '.hpp': 'cpp',
      '.c': 'c',
      '.h': 'c',
    };
    return languageMap[extension] || 'unknown';
  }
}

