'use client'

import { ProtectedRoute } from '@/components/protected-route'
import { useAuthStore } from '@/store/auth-store'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

function DashboardContent() {
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const { data: sessions } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const response = await api.get('/code-analysis/sessions')
      return response.data
    },
  })

  const { data: progress } = useQuery({
    queryKey: ['progress'],
    queryFn: async () => {
      const response = await api.get('/progress')
      return response.data
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">AI Coding Mentor</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <Link
                href="/analyze"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
              >
                Analyze Code
              </Link>
              <Link
                href="/settings"
                className="text-gray-600 hover:text-gray-900"
              >
                Settings
              </Link>
              <button
                onClick={clearAuth}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Submissions</h3>
            <p className="text-3xl font-bold text-gray-900">
              {progress?.totalSubmissions || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Improvement Score</h3>
            <p className="text-3xl font-bold text-primary-600">
              {progress?.improvementScore || 0}%
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Code Personality</h3>
            <p className="text-xl font-semibold text-gray-900">
              {progress?.codePersonality?.label || 'Not analyzed yet'}
            </p>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Analysis Sessions</h2>
          {sessions && sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.map((session: any) => (
                <Link
                  key={session._id}
                  href={`/sessions/${session._id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">{session.title}</h3>
                      <p className="text-sm text-gray-600">
                        {session.language} • {session.source}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        session.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : session.status === 'analyzing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No analysis sessions yet. Start analyzing your code!</p>
          )}
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

