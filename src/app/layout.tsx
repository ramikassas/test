import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OpenDotDB - Free Domain Research Platform',
  description: 'Open-source alternative to dotDB - Search, analyze and monitor domains for free',
  keywords: ['domain', 'research', 'analytics', 'whois', 'domain search', 'seo'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {children}
        </div>
      </body>
    </html>
  )
}
