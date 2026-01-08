'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { Search, TrendingUp, Monitor, Database, Zap, Code, Heart } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Domain Research Made Free
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Open-source alternative to dotDB. Search millions of domains, analyze keywords, track trends - completely free.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search domains or keywords..."
                className="w-full px-6 py-4 pr-12 text-lg rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Search className="w-6 h-6" />
              </button>
            </div>
          </form>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Advanced Search</h3>
              <p className="text-gray-600">
                Search across millions of registered domains with powerful filters
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Keyword Trends</h3>
              <p className="text-gray-600">
                Track keyword popularity and domain registration trends over time
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Monitor className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Domain Monitoring</h3>
              <p className="text-gray-600">
                Monitor domains and get alerts on changes and updates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why OpenDotDB?</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">100% Free</h3>
              <p className="text-gray-600">
                No paid tiers, no hidden fees. Completely free and open source forever.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">High Performance</h3>
              <p className="text-gray-600">
                Optimized database with full-text search for lightning-fast results.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Code className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Open Source</h3>
              <p className="text-gray-600">
                MIT licensed. Self-host, modify, and contribute as you wish.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Statistics</h2>

          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold mb-2">∞</div>
              <div className="text-blue-100">Domains</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">∞</div>
              <div className="text-blue-100">Keywords</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">0</div>
              <div className="text-blue-100">Cost</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">∞</div>
              <div className="text-blue-100">Possibilities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Database className="w-6 h-6" />
            <span className="text-xl font-bold">OpenDotDB</span>
          </div>
          <p className="text-gray-400 mb-4">
            Open-source domain research platform
          </p>
          <p className="text-gray-500 text-sm">
            MIT License • Made with ❤️ by the open-source community
          </p>
        </div>
      </footer>
    </div>
  )
}
