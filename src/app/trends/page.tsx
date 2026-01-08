'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { TrendingUp, Search, BarChart3 } from 'lucide-react'

interface TrendingKeyword {
  word: string
  searchVolume: number
  cpc?: number
  competition?: number
  recentTrend?: {
    date: string
    domainCount: number
    newDomains: number
  }
  sampleDomains: string[]
}

export default function TrendsPage() {
  const [keywords, setKeywords] = useState<TrendingKeyword[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30d')

  useEffect(() => {
    fetchTrends()
  }, [period])

  const fetchTrends = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/trends?period=${period}&limit=20`)
      const data = await response.json()

      if (data.success) {
        setKeywords(data.data)
      }
    } catch (error) {
      console.error('Trends error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Trending Keywords</h1>
          <p className="text-gray-600">
            Discover the most popular keywords in domain registrations
          </p>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <label className="font-semibold text-gray-700">Time Period:</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="365d">Last year</option>
            </select>
          </div>
        </div>

        {/* Trending Keywords */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading trends...</p>
          </div>
        ) : keywords.length > 0 ? (
          <div className="grid gap-6">
            {keywords.map((keyword, index) => (
              <div
                key={keyword.word}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
                        {index + 1}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {keyword.word}
                      </h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-sm text-blue-600 font-semibold mb-1">
                          Search Volume
                        </div>
                        <div className="text-2xl font-bold text-blue-700">
                          {keyword.searchVolume.toLocaleString()}
                        </div>
                      </div>

                      {keyword.cpc && (
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="text-sm text-green-600 font-semibold mb-1">
                            CPC
                          </div>
                          <div className="text-2xl font-bold text-green-700">
                            ${keyword.cpc.toFixed(2)}
                          </div>
                        </div>
                      )}

                      {keyword.competition && (
                        <div className="bg-purple-50 rounded-lg p-4">
                          <div className="text-sm text-purple-600 font-semibold mb-1">
                            Competition
                          </div>
                          <div className="text-2xl font-bold text-purple-700">
                            {(keyword.competition * 100).toFixed(0)}%
                          </div>
                        </div>
                      )}
                    </div>

                    {keyword.recentTrend && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <TrendingUp className="w-4 h-4" />
                          Recent Activity
                        </div>
                        <div className="text-lg font-semibold text-gray-800">
                          {keyword.recentTrend.domainCount.toLocaleString()} domains
                          <span className="text-sm text-green-600 ml-2">
                            +{keyword.recentTrend.newDomains} new
                          </span>
                        </div>
                      </div>
                    )}

                    {keyword.sampleDomains.length > 0 && (
                      <div>
                        <div className="text-sm text-gray-600 mb-2">
                          Sample Domains:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {keyword.sampleDomains.slice(0, 5).map((domain) => (
                            <a
                              key={domain}
                              href={`https://${domain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-600 transition-colors"
                            >
                              {domain}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No trending data available
            </h3>
            <p className="text-gray-500">
              Add some domains to start seeing trends
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
