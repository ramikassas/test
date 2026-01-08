import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get overall statistics
    const [
      totalDomains,
      totalKeywords,
      totalMonitors,
      recentDomains,
      trendingKeywords,
      tldStats,
    ] = await Promise.all([
      // Total domains
      prisma.domain.count(),

      // Total keywords
      prisma.keyword.count(),

      // Total active monitors
      prisma.domainMonitor.count({
        where: { isActive: true },
      }),

      // Recent domains (last 7 days)
      prisma.domain.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        include: {
          keywords: {
            include: {
              keyword: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      }),

      // Trending keywords (highest search volume)
      prisma.keyword.findMany({
        orderBy: {
          searchVolume: 'desc',
        },
        take: 10,
        include: {
          domains: {
            take: 3,
            include: {
              domain: true,
            },
          },
        },
      }),

      // TLD distribution
      prisma.$queryRaw`
        SELECT tld, COUNT(*) as count
        FROM "Domain"
        GROUP BY tld
        ORDER BY count DESC
        LIMIT 10
      `,
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalDomains,
        totalKeywords,
        totalMonitors,
        recentDomains,
        trendingKeywords: trendingKeywords.map(kw => ({
          word: kw.word,
          searchVolume: kw.searchVolume,
          cpc: kw.cpc,
          competition: kw.competition,
          sampleDomains: kw.domains.map(d => d.domain.name),
        })),
        tldDistribution: tldStats,
      },
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get statistics' },
      { status: 500 }
    )
  }
}
