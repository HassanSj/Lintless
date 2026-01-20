# Quick Start Guide

Get the AI Coding Mentor Platform up and running in 5 minutes!

## Prerequisites

- Node.js 20+ installed
- Docker Desktop (for MongoDB and Redis)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Step 1: Clone and Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-key-here
```

## Step 2: Start Infrastructure

```bash
# Start MongoDB and Redis with Docker
docker-compose up -d mongodb redis
```

## Step 3: Start Backend

```bash
npm run start:dev
```

Backend should be running at `http://localhost:3001`

## Step 4: Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

## Step 5: Start Frontend

```bash
npm run dev
```

Frontend should be running at `http://localhost:3000`

## Step 6: Test It Out!

1. Open `http://localhost:3000`
2. Click "Get Started" and create an account
3. Go to "Analyze Code"
4. Paste some code and click "Start Analysis"
5. Watch real-time feedback appear!

## Troubleshooting

### Backend won't start
- Check MongoDB is running: `docker ps`
- Verify Redis is running: `redis-cli ping`
- Check `.env` file has all required variables

### Frontend can't connect
- Verify backend is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

### OpenAI errors
- Verify your API key is correct
- Check you have credits in your OpenAI account
- Ensure the key has proper permissions

## Next Steps

- Connect your GitHub account in Settings
- Analyze a GitHub repository
- Check your progress dashboard
- Explore the code personality profile

## Production Deployment

See the main README.md for deployment instructions to:
- Vercel (frontend)
- Render/AWS/Railway (backend)
- MongoDB Atlas
- Redis Cloud

Happy coding! 🚀

