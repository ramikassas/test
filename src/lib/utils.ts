import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Parse domain name into components
export function parseDomain(domain: string): {
  name: string
  sld: string
  tld: string
  keywords: string[]
} {
  const normalized = domain.toLowerCase().trim()
  const parts = normalized.split('.')

  const tld = parts.length > 1 ? '.' + parts[parts.length - 1] : ''
  const sld = parts.length > 1 ? parts[parts.length - 2] : parts[0]

  // Extract keywords from SLD
  const keywords = extractKeywords(sld)

  return {
    name: normalized,
    sld,
    tld,
    keywords,
  }
}

// Extract keywords from domain name
export function extractKeywords(text: string): string[] {
  // Remove common separators and split
  const words = text
    .replace(/[-_]/g, ' ')
    .split(/(?=[A-Z])|[\s.]+/) // Split on camelCase and spaces
    .filter(word => word.length > 0)
    .map(word => word.toLowerCase())

  // Remove very short words and numbers-only
  return words.filter(word => word.length > 2 && !/^\d+$/.test(word))
}

// Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

// Format date
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

// Calculate domain score based on various factors
export function calculateDomainScore(domain: {
  keywords: { keyword: { searchVolume: number } }[]
  registeredAt?: Date | null
}): number {
  let score = 0

  // Keyword search volume contribution
  const totalSearchVolume = domain.keywords.reduce(
    (sum, kw) => sum + kw.keyword.searchVolume,
    0
  )
  score += Math.min(totalSearchVolume / 1000, 50) // Max 50 points

  // Age contribution
  if (domain.registeredAt) {
    const ageInYears = (Date.now() - domain.registeredAt.getTime()) / (1000 * 60 * 60 * 24 * 365)
    score += Math.min(ageInYears * 5, 30) // Max 30 points
  }

  // Keyword count contribution
  score += Math.min(domain.keywords.length * 5, 20) // Max 20 points

  return Math.round(score)
}

// Validate domain name format
export function isValidDomain(domain: string): boolean {
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i
  return domainRegex.test(domain)
}

// Generate random color for charts
export function generateColor(index: number): string {
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
  ]
  return colors[index % colors.length]
}
