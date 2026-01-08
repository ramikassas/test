import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const tld = searchParams.get('tld')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    // Build where clause
    const where: any = {}

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { sld: { contains: query, mode: 'insensitive' } },
      ]
    }

    if (tld) {
      where.tld = tld
    }

    // Get total count
    const total = await prisma.domain.count({ where })

    // Get domains with pagination
    const domains = await prisma.domain.findMany({
      where,
      include: {
        keywords: {
          include: {
            keyword: true,
          },
        },
        statistics: {
          orderBy: {
            date: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      success: true,
      data: {
        domains,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to search domains' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { domains } = body

    if (!Array.isArray(domains) || domains.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid domains array' },
        { status: 400 }
      )
    }

    const results = []

    for (const domainName of domains) {
      // Parse domain
      const parts = domainName.toLowerCase().split('.')
      const tld = parts.length > 1 ? '.' + parts[parts.length - 1] : ''
      const sld = parts.length > 1 ? parts[parts.length - 2] : parts[0]

      // Extract keywords
      const keywordTexts = extractKeywords(sld)

      // Create or update domain
      const domain = await prisma.domain.upsert({
        where: { name: domainName.toLowerCase() },
        update: {
          updatedAt: new Date(),
        },
        create: {
          name: domainName.toLowerCase(),
          sld,
          tld,
          status: 'active',
        },
      })

      // Create keywords and associations
      for (let i = 0; i < keywordTexts.length; i++) {
        const keywordText = keywordTexts[i]

        const keyword = await prisma.keyword.upsert({
          where: { word: keywordText },
          update: {},
          create: {
            word: keywordText,
            searchVolume: 0,
          },
        })

        await prisma.domainKeyword.upsert({
          where: {
            domainId_keywordId: {
              domainId: domain.id,
              keywordId: keyword.id,
            },
          },
          update: {},
          create: {
            domainId: domain.id,
            keywordId: keyword.id,
            position: i,
          },
        })
      }

      results.push(domain)
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: `Successfully added ${results.length} domains`,
    })
  } catch (error) {
    console.error('Add domains error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add domains' },
      { status: 500 }
    )
  }
}

function extractKeywords(text: string): string[] {
  const words = text
    .replace(/[-_]/g, ' ')
    .split(/(?=[A-Z])|[\s.]+/)
    .filter(word => word.length > 0)
    .map(word => word.toLowerCase())

  return words.filter(word => word.length > 2 && !/^\d+$/.test(word))
}
