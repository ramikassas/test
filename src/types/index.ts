export interface Domain {
  id: string
  name: string
  tld: string
  sld: string
  registrar?: string | null
  registeredAt?: Date | null
  expiresAt?: Date | null
  status?: string | null
  createdAt: Date
  updatedAt: Date
  keywords?: DomainKeyword[]
  statistics?: DomainStatistic[]
}

export interface Keyword {
  id: string
  word: string
  searchVolume: number
  cpc?: number | null
  competition?: number | null
  createdAt: Date
  updatedAt: Date
  domains?: DomainKeyword[]
  trends?: KeywordTrend[]
}

export interface DomainKeyword {
  id: string
  domainId: string
  keywordId: string
  position: number
  domain?: Domain
  keyword?: Keyword
}

export interface KeywordTrend {
  id: string
  keywordId: string
  date: Date
  domainCount: number
  newDomains: number
  keyword?: Keyword
}

export interface DomainMonitor {
  id: string
  domainId: string
  userId?: string | null
  alertEmail?: string | null
  isActive: boolean
  lastChecked: Date
  createdAt: Date
  updatedAt: Date
  domain?: Domain
  changes?: DomainChange[]
}

export interface DomainChange {
  id: string
  monitorId: string
  changeType: string
  oldValue?: string | null
  newValue?: string | null
  detectedAt: Date
}

export interface DomainStatistic {
  id: string
  domainId: string
  date: Date
  views: number
  searches: number
}

export interface TldStatistic {
  id: string
  tld: string
  totalDomains: number
  newDomains: number
  date: Date
  updatedAt: Date
}

export interface SearchFilters {
  query?: string
  tld?: string
  minLength?: number
  maxLength?: number
  keywords?: string[]
  registeredAfter?: Date
  registeredBefore?: Date
  sortBy?: 'name' | 'registeredAt' | 'searchVolume' | 'score'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface SearchResult {
  domains: Domain[]
  total: number
  page: number
  totalPages: number
}

export interface KeywordAnalysis {
  keyword: string
  totalDomains: number
  searchVolume: number
  cpc?: number
  competition?: number
  trends: {
    date: string
    count: number
  }[]
  topDomains: Domain[]
}

export interface DashboardStats {
  totalDomains: number
  totalKeywords: number
  totalMonitors: number
  recentDomains: Domain[]
  trendingKeywords: Keyword[]
  tldDistribution: {
    tld: string
    count: number
  }[]
}
