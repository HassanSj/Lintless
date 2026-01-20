# Project Structure

This document provides an overview of the project structure and organization.

## Root Directory

```
ai-coding-mentor/
├── .github/                 # GitHub configuration files
│   ├── workflows/          # CI/CD pipelines
│   ├── ISSUE_TEMPLATE/     # Issue templates
│   ├── CODE_OF_CONDUCT.md  # Code of conduct
│   ├── FUNDING.yml         # Funding configuration
│   └── dependabot.yml      # Dependabot configuration
├── backend/                # NestJS backend application
├── frontend/               # Next.js frontend application
├── .gitignore             # Git ignore rules
├── .gitattributes         # Git attributes
├── LICENSE                # MIT License
├── README.md              # Main project documentation
├── ARCHITECTURE.md        # Architecture documentation
├── QUICKSTART.md          # Quick start guide
├── CONTRIBUTING.md        # Contribution guidelines
├── CHANGELOG.md           # Version history
├── SECURITY.md            # Security policy
├── GITHUB_SETUP.md        # GitHub setup instructions
└── PROJECT_STRUCTURE.md   # This file
```

## Backend Structure

```
backend/
├── src/
│   ├── auth/              # Authentication module
│   │   ├── dto/          # Data transfer objects
│   │   ├── guards/       # Auth guards
│   │   ├── strategies/   # Passport strategies
│   │   ├── decorators/   # Custom decorators
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/            # User management
│   │   ├── schemas/      # MongoDB schemas
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── code-analysis/    # Code analysis core
│   │   ├── schemas/      # Database schemas
│   │   ├── dto/          # DTOs
│   │   ├── services/     # Business logic
│   │   ├── processors/   # BullMQ processors
│   │   ├── code-analysis.controller.ts
│   │   └── code-analysis.module.ts
│   ├── github/           # GitHub integration
│   │   ├── services/
│   │   ├── github.controller.ts
│   │   └── github.module.ts
│   ├── progress/         # Progress tracking
│   │   ├── schemas/
│   │   ├── progress.service.ts
│   │   ├── progress.controller.ts
│   │   └── progress.module.ts
│   ├── websocket/        # WebSocket gateway
│   │   ├── websocket.gateway.ts
│   │   └── websocket.module.ts
│   ├── app.module.ts     # Root module
│   └── main.ts           # Application entry point
├── test/                 # Test files
├── logs/                 # Application logs
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose setup
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── nest-cli.json         # NestJS CLI config
└── .env.example          # Environment variables template
```

## Frontend Structure

```
frontend/
├── app/                  # Next.js App Router
│   ├── auth/            # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/       # User dashboard
│   ├── analyze/         # Code analysis page
│   ├── sessions/        # Session detail pages
│   │   └── [id]/
│   ├── settings/        # User settings
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Landing page
│   ├── providers.tsx    # React Query provider
│   └── globals.css      # Global styles
├── components/          # React components
│   └── protected-route.tsx
├── lib/                 # Utilities and helpers
│   ├── api.ts          # API client
│   ├── auth.ts         # Auth utilities
│   └── websocket.ts    # WebSocket client
├── store/               # State management
│   └── auth-store.ts   # Auth state (Zustand)
├── public/              # Static assets
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── next.config.js       # Next.js config
├── tailwind.config.ts   # Tailwind CSS config
└── .env.example         # Environment variables template
```

## Key Files Explained

### Configuration Files

- **package.json**: Project dependencies and scripts
- **tsconfig.json**: TypeScript compiler configuration
- **.env.example**: Template for environment variables
- **docker-compose.yml**: Local development setup
- **Dockerfile**: Production container configuration

### Documentation Files

- **README.md**: Main project documentation and getting started guide
- **ARCHITECTURE.md**: Detailed system architecture documentation
- **QUICKSTART.md**: Quick setup instructions
- **CONTRIBUTING.md**: Guidelines for contributors
- **SECURITY.md**: Security policy and reporting
- **CHANGELOG.md**: Version history and changes

### GitHub Files

- **.github/workflows/ci.yml**: CI/CD pipeline configuration
- **.github/ISSUE_TEMPLATE/**: Issue templates for bug reports and features
- **.github/pull_request_template.md**: PR template
- **.github/CODE_OF_CONDUCT.md**: Community guidelines
- **.github/dependabot.yml**: Automated dependency updates

## Module Organization

### Backend Modules

Each module follows NestJS conventions:
- **Controller**: Handles HTTP requests
- **Service**: Contains business logic
- **Module**: Configures the module
- **DTOs**: Data validation and transfer
- **Schemas**: Database models (MongoDB)

### Frontend Pages

Each page follows Next.js App Router conventions:
- **page.tsx**: Main page component
- Uses React Server Components by default
- Client components marked with 'use client'
- Protected routes use HOC pattern

## Database Collections

- **users**: User accounts and profiles
- **codesessions**: Analysis sessions
- **codesnippets**: Code content
- **feedbacks**: AI-generated feedback
- **progressstats**: User progress data
- **aiusagelogs**: AI API usage tracking

## Environment Variables

### Backend (.env)
- Database connection strings
- JWT secrets
- OpenAI API key
- Redis configuration
- Server port and URLs

### Frontend (.env.local)
- API endpoint URL
- WebSocket server URL
- Public configuration

## Build Outputs

- **backend/dist/**: Compiled TypeScript
- **frontend/.next/**: Next.js build output
- **frontend/out/**: Static export (if used)
- **logs/**: Application logs

## Testing Structure

- **backend/test/**: E2E tests
- **backend/src/**/*.spec.ts**: Unit tests
- **frontend/**/*.test.tsx**: Component tests

## Deployment Artifacts

- **Docker images**: Built from Dockerfile
- **Environment configs**: Production .env files
- **Build outputs**: Compiled applications

