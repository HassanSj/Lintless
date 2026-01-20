'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { ProtectedRoute } from '@/components/protected-route'
import api from '@/lib/api'
import { getSocket, disconnectSocket } from '@/lib/websocket'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface Feedback {
  category: string
  severity: string
  message: string
  suggestion: string
  codeExample?: string
}

function AnalyzeContent() {
  const router = useRouter()
  const [code, setCode] = useState('// Enter your code here\nfunction example() {\n  return "Hello, World!";\n}')
  const [language, setLanguage] = useState('javascript')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [status, setStatus] = useState<string>('')
  const [refactoredCode, setRefactoredCode] = useState<string | null>(null)

  useEffect(() => {
    const socket = getSocket()

    socket.on('analysis-status', (data: { status: string; message: string }) => {
      setStatus(data.message || data.status)
    })

    socket.on('feedback-update', (data: Feedback) => {
      setFeedback((prev) => [...prev, data])
    })

    return () => {
      socket.off('analysis-status')
      socket.off('feedback-update')
    }
  }, [])

  const handleAnalyze = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your analysis')
      return
    }

    setLoading(true)
    setFeedback([])
    setStatus('Creating analysis session...')

    try {
      const response = await api.post('/code-analysis/sessions', {
        title,
        language,
        source: 'snippet',
        codeSnippet: code,
        fileName: `code.${language === 'javascript' ? 'js' : language}`,
      })

      const newSessionId = response.data._id
      setSessionId(newSessionId)

      // Subscribe to session updates
      const socket = getSocket()
      socket.emit('subscribe-session', { sessionId: newSessionId })

      setStatus('Analysis started. Waiting for feedback...')
    } catch (error: any) {
      setStatus(`Error: ${error.message}`)
      console.error('Analysis error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefactor = async (feedbackItem: Feedback) => {
    if (!sessionId) return

    try {
      // This would need the feedback ID - simplified for now
      const response = await api.post(`/code-analysis/sessions/${sessionId}/refactor`, {
        feedbackId: 'temp-id', // In real implementation, pass actual feedback ID
      })
      setRefactoredCode(response.data.refactoredCode)
    } catch (error) {
      console.error('Refactor error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Analyze Your Code</h1>
          
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <input
              type="text"
              placeholder="Session title (e.g., 'My React Component')"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            />
            
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !title.trim()}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Start Analysis'}
          </button>

          {status && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">{status}</p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Code Editor */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Your Code</h2>
            </div>
            <div className="h-[600px]">
              <MonacoEditor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                }}
              />
            </div>
          </div>

          {/* Feedback Panel */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">AI Feedback</h2>
            </div>
            <div className="p-4 max-h-[600px] overflow-y-auto">
              {feedback.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {loading ? 'Waiting for feedback...' : 'No feedback yet. Start analysis to get insights.'}
                </p>
              ) : (
                <div className="space-y-4">
                  {feedback.map((item, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        item.severity === 'high'
                          ? 'bg-red-50 border-red-500'
                          : item.severity === 'medium'
                          ? 'bg-yellow-50 border-yellow-500'
                          : 'bg-blue-50 border-blue-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold uppercase text-gray-600">
                          {item.category}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            item.severity === 'high'
                              ? 'bg-red-200 text-red-800'
                              : item.severity === 'medium'
                              ? 'bg-yellow-200 text-yellow-800'
                              : 'bg-blue-200 text-blue-800'
                          }`}
                        >
                          {item.severity}
                        </span>
                      </div>
                      <p className="font-medium text-gray-900 mb-2">{item.message}</p>
                      <p className="text-sm text-gray-700 mb-3">{item.suggestion}</p>
                      {item.codeExample && (
                        <div className="bg-gray-900 text-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
                          <pre>{item.codeExample}</pre>
                        </div>
                      )}
                      <button
                        onClick={() => handleRefactor(item)}
                        className="mt-2 text-sm text-primary-600 hover:underline"
                      >
                        Show Refactored Code
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Refactored Code View */}
        {refactoredCode && (
          <div className="mt-6 bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Refactored Code</h2>
            </div>
            <div className="h-[400px]">
              <MonacoEditor
                height="100%"
                language={language}
                value={refactoredCode}
                theme="vs-light"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AnalyzePage() {
  return (
    <ProtectedRoute>
      <AnalyzeContent />
    </ProtectedRoute>
  )
}

