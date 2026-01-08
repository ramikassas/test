import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { word: string } }
) {
  try {
    const word = decodeURIComponent(params.word)

    // Get keyword with related data
    const keyword = await prisma.keyword.findUnique({
      where: { word: word.toLowerCase() },
      include: {
        domains: {
          include: {
            domain: {
              include: {
                keywords: {
                  include: {
                    keyword: true,
                  },
                },
              },
            },
          },
          take: 100,
        },
        trends: {
          orderBy: {
            date: 'desc',
          },
          take: 30,
        },
      },
    })

    if (!keyword) {
      return NextResponse.json(
        { success: false, error: 'Keyword not found' },
        { status: 404 }
      )
    }

    // Calculate statistics
    const totalDomains = await prisma.domainKeyword.count({
      where: { keywordId: keyword.id },
    })

    const topDomains = keyword.domains
      .map(dk => dk.domain)
      .slice(0, 20)

    return NextResponse.json({
      success: true,
      data: {
        keyword: keyword.word,
        searchVolume: keyword.searchVolume,
        cpc: keyword.cpc,
        competition: keyword.competition,
        totalDomains,
        trends: keyword.trends.map(t => ({
          date: t.date.toISOString().split('T')[0],
          count: t.domainCount,
          newDomains: t.newDomains,
        })),
        topDomains,
      },
    })
  } catch (error) {
    console.error('Keyword analysis error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to analyze keyword' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { word: string } }
) {
  try {
    const word = decodeURIComponent(params.word)
    const body = await request.json()
    const { searchVolume, cpc, competition } = body

    const keyword = await prisma.keyword.update({
      where: { word: word.toLowerCase() },
      data: {
        searchVolume: searchVolume ?? undefined,
        cpc: cpc ?? undefined,
        competition: competition ?? undefined,
      },
    })

    return NextResponse.json({
      success: true,
      data: keyword,
    })
  } catch (error) {
    console.error('Update keyword error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update keyword' },
      { status: 500 }
    )
  }
}
