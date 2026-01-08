import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const keyword = searchParams.get('keyword')
    const period = searchParams.get('period') || '30d'
    const limit = parseInt(searchParams.get('limit') || '10')

    // Calculate date range
    const daysAgo = parseInt(period) || 30
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysAgo)

    if (keyword) {
      // Get trends for specific keyword
      const keywordRecord = await prisma.keyword.findUnique({
        where: { word: keyword.toLowerCase() },
        include: {
          trends: {
            where: {
              date: {
                gte: startDate,
              },
            },
            orderBy: {
              date: 'asc',
            },
          },
        },
      })

      if (!keywordRecord) {
        return NextResponse.json(
          { success: false, error: 'Keyword not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: {
          keyword: keywordRecord.word,
          trends: keywordRecord.trends.map(t => ({
            date: t.date.toISOString().split('T')[0],
            domainCount: t.domainCount,
            newDomains: t.newDomains,
          })),
        },
      })
    } else {
      // Get trending keywords
      const trendingKeywords = await prisma.keyword.findMany({
        include: {
          trends: {
            where: {
              date: {
                gte: startDate,
              },
            },
            orderBy: {
              date: 'desc',
            },
            take: 1,
          },
          domains: {
            take: 5,
            include: {
              domain: true,
            },
          },
        },
        orderBy: {
          searchVolume: 'desc',
        },
        take: limit,
      })

      return NextResponse.json({
        success: true,
        data: trendingKeywords.map(kw => ({
          word: kw.word,
          searchVolume: kw.searchVolume,
          cpc: kw.cpc,
          competition: kw.competition,
          recentTrend: kw.trends[0]
            ? {
                date: kw.trends[0].date.toISOString().split('T')[0],
                domainCount: kw.trends[0].domainCount,
                newDomains: kw.trends[0].newDomains,
              }
            : null,
          sampleDomains: kw.domains.map(d => d.domain.name),
        })),
      })
    }
  } catch (error) {
    console.error('Trends error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get trends' },
      { status: 500 }
    )
  }
}
