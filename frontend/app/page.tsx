import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">AI Coding Mentor</h1>
          <div className="space-x-4">
            <Link
              href="/auth/login"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Improve Your Code Skills with
            <span className="text-primary-600"> AI-Powered Feedback</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get personalized, actionable feedback on your code. Learn best practices,
            identify security issues, and track your progress over time.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition shadow-lg"
            >
              Start Analyzing Code
            </Link>
            <Link
              href="/demo"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition border-2 border-primary-600"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-600">
              Get intelligent feedback powered by GPT-4. Understand not just what's wrong,
              but why and how to fix it.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Real-Time Feedback</h3>
            <p className="text-gray-600">
              Watch your code being analyzed in real-time. Get instant insights as our AI
              reviews your code.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your improvement over time. See your coding personality evolve and
              identify areas for growth.
            </p>
          </div>
        </div>

        {/* GitHub Integration */}
        <div className="mt-32 bg-white rounded-xl shadow-lg p-12">
          <h3 className="text-3xl font-bold text-center mb-6">
            Connect Your GitHub Repositories
          </h3>
          <p className="text-center text-gray-600 mb-8">
            Analyze entire repositories, track improvements across projects, and get
            repository-wide insights.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-200 mt-20">
        <p className="text-center text-gray-600">
          © 2024 AI Coding Mentor. Built with Next.js, NestJS, and OpenAI.
        </p>
      </footer>
    </div>
  )
}

