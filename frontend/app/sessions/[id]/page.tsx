'use client'

import { ProtectedRoute } from '@/components/protected-route'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

function SessionDetailContent() {
  const params = useParams()
  const sessionId = params.id as string

  const { data: session } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      const response = await api.get(`/code-analysis/sessions/${sessionId}`)
      return response.data
    },
  })

  const { data: feedback } = useQuery({
    queryKey: ['feedback', sessionId],
    queryFn: async () => {
      const response = await api.get(`/code-analysis/sessions/${sessionId}/feedback`)
      return response.data
    },
    enabled: !!sessionId,
  })

  if (!session) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{session.title}</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Session Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Language:</span> {session.language}</p>
              <p><span className="font-medium">Source:</span> {session.source}</p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  session.status === 'completed' ? 'bg-green-100 text-green-800' :
                  session.status === 'analyzing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {session.status}
                </span>
              </p>
              <p><span className="font-medium">Created:</span> {new Date(session.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Feedback</h2>
            {feedback && feedback.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {feedback.map((item: any, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded border-l-4 ${
                      item.severity === 'high' ? 'bg-red-50 border-red-500' :
                      item.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {item.category}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-white">
                        {item.severity}
                      </span>
                    </div>
                    <p className="font-medium text-sm mb-1">{item.message}</p>
                    <p className="text-xs text-gray-700">{item.suggestion}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No feedback available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SessionDetailPage() {
  return (
    <ProtectedRoute>
      <SessionDetailContent />
    </ProtectedRoute>
  )
}

