'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import { Search, Filter, ExternalLink, TrendingUp, Calendar } from 'lucide-react'
import { Domain } from '@/types'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [tld, setTld] = useState('')
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  const performSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: '50',
      })

      if (tld) params.append('tld', tld)

      const response = await fetch(`/api/domains/search?${params}`)
      const data = await response.json()

      if (data.success) {
        setDomains(data.data.domains)
        setTotal(data.data.total)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialQuery) {
      performSearch()
    }
  }, [page])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    performSearch()
  }

  return (
    <div>
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search domains or keywords..."
                  className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                />
                <Search className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
              </div>

              <select
                value={tld}
                onChange={(e) => setTld(e.target.value)}
                className="px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
              >
                <option value="">All TLDs</option>
                <option value=".com">.com</option>
                <option value=".net">.net</option>
                <option value=".org">.org</option>
                <option value=".io">.io</option>
                <option value=".ai">.ai</option>
              </select>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {total > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">
              Found {total.toLocaleString()} domains
            </h2>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Searching...</p>
          </div>
        ) : domains.length > 0 ? (
          <div className="space-y-4">
            {domains.map((domain) => (
              <div
                key={domain.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-blue-600">
                        {domain.name}
                      </h3>
                      <a
                        href={`https://${domain.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      {domain.registeredAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(domain.registeredAt).toLocaleDateString()}
                        </div>
                      )}
                      {domain.registrar && (
                        <div>Registrar: {domain.registrar}</div>
                      )}
                      {domain.status && (
                        <div className="px-2 py-1 bg-green-100 text-green-700 rounded">
                          {domain.status}
                        </div>
                      )}
                    </div>

                    {domain.keywords && domain.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {domain.keywords.map((dk: any) => (
                          <span
                            key={dk.id}
                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                          >
                            {dk.keyword.word}
                            {dk.keyword.searchVolume > 0 && (
                              <span className="ml-1 text-xs text-blue-400">
                                ({dk.keyword.searchVolume.toLocaleString()})
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No domains found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria
            </p>
          </div>
        ) : null}

        {/* Pagination */}
        {total > 50 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-white rounded-lg shadow">
              Page {page} of {Math.ceil(total / 50)}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / 50)}
              className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
