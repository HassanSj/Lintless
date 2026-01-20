'use client'

import { ProtectedRoute } from '@/components/protected-route'
import { useAuthStore } from '@/store/auth-store'
import { useState } from 'react'
import api from '@/lib/api'

function SettingsContent() {
  const user = useAuthStore((state) => state.user)
  const [githubToken, setGithubToken] = useState('')
  const [message, setMessage] = useState('')

  const handleConnectGitHub = async () => {
    try {
      await api.post('/github/connect', { accessToken: githubToken })
      setMessage('GitHub account connected successfully!')
      setGithubToken('')
    } catch (error: any) {
      setMessage(`Error: ${error.response?.data?.message || 'Failed to connect GitHub'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">GitHub Integration</h2>
          <p className="text-gray-600 mb-4">
            Connect your GitHub account to analyze repositories. You'll need a GitHub Personal Access Token.
          </p>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="GitHub Personal Access Token"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleConnectGitHub}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Connect GitHub
            </button>
            {message && (
              <p className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {user?.name}</p>
            <p><span className="font-medium">Email:</span> {user?.email}</p>
            <p><span className="font-medium">Role:</span> {user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  )
}

