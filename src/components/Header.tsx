'use client'

import Link from 'next/link'
import { Search, TrendingUp, Monitor, Database } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Database className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                OpenDotDB
              </h1>
              <p className="text-xs text-gray-500">Free Domain Research</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/search"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Search className="w-4 h-4" />
              Search
            </Link>
            <Link
              href="/trends"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              Trends
            </Link>
            <Link
              href="/monitor"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Monitor className="w-4 h-4" />
              Monitor
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/yourusername/opendotdb"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
