'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { Monitor, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react'

interface DomainMonitor {
  id: string
  domain: {
    name: string
    status?: string
  }
  isActive: boolean
  lastChecked: string
  changes: {
    changeType: string
    oldValue?: string
    newValue?: string
    detectedAt: string
  }[]
}

export default function MonitorPage() {
  const [monitors, setMonitors] = useState<DomainMonitor[]>([])
  const [loading, setLoading] = useState(true)
  const [newDomain, setNewDomain] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetchMonitors()
  }, [])

  const fetchMonitors = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/monitor')
      const data = await response.json()

      if (data.success) {
        setMonitors(data.data)
      }
    } catch (error) {
      console.error('Fetch monitors error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addMonitor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDomain.trim()) return

    setAdding(true)
    try {
      const response = await fetch('/api/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainName: newDomain }),
      })

      const data = await response.json()

      if (data.success) {
        setNewDomain('')
        fetchMonitors()
      }
    } catch (error) {
      console.error('Add monitor error:', error)
    } finally {
      setAdding(false)
    }
  }

  const deleteMonitor = async (monitorId: string) => {
    if (!confirm('Are you sure you want to stop monitoring this domain?')) return

    try {
      const response = await fetch(`/api/monitor?id=${monitorId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        fetchMonitors()
      }
    } catch (error) {
      console.error('Delete monitor error:', error)
    }
  }

  return (
    <div>
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Domain Monitoring</h1>
          <p className="text-gray-600">
            Monitor domains and get alerts on changes
          </p>
        </div>

        {/* Add Monitor Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Monitor</h2>
          <form onSubmit={addMonitor} className="flex gap-4">
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="example.com"
              className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={adding}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {adding ? 'Adding...' : 'Add Monitor'}
            </button>
          </form>
        </div>

        {/* Monitors List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading monitors...</p>
          </div>
        ) : monitors.length > 0 ? (
          <div className="space-y-4">
            {monitors.map((monitor) => (
              <div
                key={monitor.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {monitor.domain.name}
                      </h3>
                      {monitor.isActive ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                      Last checked:{' '}
                      {new Date(monitor.lastChecked).toLocaleString()}
                    </div>

                    {monitor.changes.length > 0 ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-yellow-800 font-semibold mb-2">
                          <AlertCircle className="w-5 h-5" />
                          Recent Changes
                        </div>
                        <div className="space-y-2">
                          {monitor.changes.map((change, index) => (
                            <div
                              key={index}
                              className="text-sm text-gray-700 pl-7"
                            >
                              <span className="font-semibold">
                                {change.changeType}:
                              </span>{' '}
                              {change.oldValue && (
                                <span className="line-through text-red-600">
                                  {change.oldValue}
                                </span>
                              )}
                              {change.oldValue && change.newValue && ' → '}
                              {change.newValue && (
                                <span className="text-green-600">
                                  {change.newValue}
                                </span>
                              )}
                              <span className="text-gray-500 ml-2">
                                ({new Date(change.detectedAt).toLocaleDateString()})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        No changes detected
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => deleteMonitor(monitor.id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete monitor"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Monitor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No monitors yet
            </h3>
            <p className="text-gray-500">
              Add a domain above to start monitoring
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
