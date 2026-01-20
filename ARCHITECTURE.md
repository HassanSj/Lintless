# Architecture Documentation

## System Overview

The AI-Accelerated Coding Mentor Platform is a full-stack SaaS application built with a microservices-oriented architecture, separating concerns between frontend, backend, and AI services.

## High-Level Architecture

```
┌─────────────────┐
│   Next.js App   │  (Frontend - Vercel)
│   (React 18)    │
└────────┬────────┘
         │ HTTP/WebSocket
         │
┌────────▼────────┐
│   NestJS API    │  (Backend - Render/AWS)
│   (Node.js)     │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬──────────┐
    │         │          │          │
┌───▼───┐ ┌──▼──┐  ┌────▼────┐ ┌───▼────┐
│MongoDB│ │Redis│  │ OpenAI  │ │ GitHub │
│       │ │     │  │   API   │ │  API   │
└───────┘ └─────┘  └─────────┘ └────────┘
```

## Backend Architecture

### Module Structure

1. **Auth Module**
   - JWT authentication with refresh tokens
   - Password hashing with bcrypt
   - Role-based access control (RBAC)
   - Guards and decorators for route protection

2. **Users Module**
   - User CRUD operations
   - Profile management
   - Preference storage

3. **Code Analysis Module**
   - Core analysis service
   - OpenAI integration
   - Feedback generation and storage
   - Background job processing (BullMQ)

4. **GitHub Module**
   - Repository fetching
   - File content retrieval
   - OAuth integration

5. **Progress Module**
   - Progress tracking
   - Statistics aggregation
   - Personality profiling

6. **WebSocket Module**
   - Real-time feedback streaming
   - Session-based subscriptions
   - Connection management

### Data Flow

#### Code Analysis Flow

```
User submits code
    ↓
Create CodeSession (status: pending)
    ↓
Queue BullMQ job
    ↓
Worker picks up job
    ↓
Update session (status: analyzing)
    ↓
Emit WebSocket status update
    ↓
For each code snippet:
    ├─ Send to OpenAI API
    ├─ Parse structured response
    ├─ Save feedback to DB
    └─ Emit WebSocket feedback update
    ↓
Update progress stats
    ↓
Log AI usage
    ↓
Update session (status: completed)
    ↓
Emit WebSocket completion
```

### Database Design

#### User Collection
- Stores user authentication and profile data
- Indexed on email for fast lookups
- Contains GitHub integration credentials

#### CodeSession Collection
- Tracks analysis sessions
- References user via userId
- Status transitions: pending → analyzing → completed/failed

#### CodeSnippet Collection
- Stores actual code content
- References session via sessionId
- Supports both manual snippets and GitHub files

#### Feedback Collection
- AI-generated feedback items
- Categorized and severity-ranked
- References both session and snippet

#### ProgressStats Collection
- Aggregated user progress
- Tracks common mistakes
- Stores personality profile
- Language proficiency map

#### AIUsageLog Collection
- Token usage tracking
- Cost estimation
- Audit trail for AI API calls

### Security Architecture

1. **Authentication**
   - JWT access tokens (short-lived: 15min)
   - Refresh tokens (long-lived: 7 days)
   - HTTP-only cookies for refresh tokens (optional)
   - Token rotation on refresh

2. **Authorization**
   - Role-based access control
   - Route guards
   - Resource ownership validation

3. **Input Validation**
   - DTO validation with class-validator
   - Code sanitization
   - File size limits
   - Language detection

4. **Rate Limiting**
   - Redis-based rate limiting
   - Per-user limits
   - Configurable thresholds

5. **API Security**
   - CORS configuration
   - Request sanitization
   - SQL injection prevention (MongoDB)
   - XSS protection

## Frontend Architecture

### App Router Structure

```
app/
├── layout.tsx          # Root layout with providers
├── page.tsx            # Landing page
├── auth/
│   ├── login/          # Login page
│   └── register/       # Registration page
├── dashboard/          # User dashboard
├── analyze/            # Code analysis interface
├── sessions/[id]/     # Session detail view
└── settings/           # User settings
```

### State Management

1. **Zustand Stores**
   - `auth-store`: Authentication state
   - Lightweight, no middleware needed

2. **React Query**
   - Server state management
   - Caching and refetching
   - Optimistic updates

### Real-Time Communication

- Socket.io client for WebSocket connections
- Automatic reconnection
- Session-based subscriptions
- Token-based authentication

### Code Editor

- Monaco Editor (VS Code editor)
- Language detection
- Syntax highlighting
- Real-time editing

## AI Integration

### Prompt Engineering

Structured prompts include:
- Language context
- User skill level
- Code content
- Desired feedback categories
- Output format (JSON)

### Response Parsing

- JSON schema validation
- Error handling
- Fallback mechanisms
- Token estimation

### Cost Management

- Token counting
- Cost estimation
- Usage logging
- Per-user limits

## Background Jobs

### BullMQ Integration

- Redis-backed job queue
- Retry mechanisms
- Job prioritization
- Progress tracking

### Job Types

1. **Code Analysis**
   - Long-running OpenAI API calls
   - Feedback generation
   - Progress updates

2. **GitHub Repository Analysis**
   - File fetching
   - Batch processing
   - Incremental analysis

## Deployment Architecture

### Frontend (Vercel)
- Edge network
- Automatic deployments
- Environment variables
- Preview deployments

### Backend (Docker)
- Containerized application
- Environment-based config
- Health checks
- Auto-scaling

### Database (MongoDB Atlas)
- Managed MongoDB
- Automated backups
- Replica sets
- Connection pooling

### Cache/Queue (Redis Cloud)
- Managed Redis
- Persistence
- High availability

## Monitoring & Observability

1. **Logging**
   - Winston structured logging
   - Log levels
   - File and console output

2. **Error Tracking**
   - Centralized error handling
   - Stack traces
   - User context

3. **Metrics**
   - API response times
   - AI usage statistics
   - User activity

## Scalability Considerations

1. **Horizontal Scaling**
   - Stateless backend
   - Shared Redis/MongoDB
   - Load balancing

2. **Caching**
   - Redis for session data
   - API response caching
   - Static asset caching

3. **Database Optimization**
   - Indexed queries
   - Aggregation pipelines
   - Connection pooling

4. **Background Jobs**
   - Queue-based processing
   - Worker scaling
   - Job prioritization

## Security Best Practices

1. **Secrets Management**
   - Environment variables
   - No hardcoded secrets
   - Secret rotation

2. **Input Validation**
   - All inputs validated
   - Sanitization
   - Type checking

3. **Authentication**
   - Secure token storage
   - Token expiration
   - Refresh token rotation

4. **API Security**
   - Rate limiting
   - CORS configuration
   - Request validation

## Future Enhancements

1. **Multi-tenancy**
   - Organization support
   - Team collaboration

2. **Advanced Analytics**
   - Machine learning insights
   - Predictive analysis

3. **Integration Expansion**
   - GitLab support
   - Bitbucket integration
   - IDE plugins

4. **Performance**
   - CDN for static assets
   - GraphQL API
   - Real-time collaboration

