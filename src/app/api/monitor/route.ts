import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const isActive = searchParams.get('isActive')

    const where: any = {}

    if (userId) {
      where.userId = userId
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    const monitors = await prisma.domainMonitor.findMany({
      where,
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
        changes: {
          orderBy: {
            detectedAt: 'desc',
          },
          take: 5,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: monitors,
    })
  } catch (error) {
    console.error('Get monitors error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get monitors' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { domainName, userId, alertEmail } = body

    if (!domainName) {
      return NextResponse.json(
        { success: false, error: 'Domain name is required' },
        { status: 400 }
      )
    }

    // Find or create domain
    const parts = domainName.toLowerCase().split('.')
    const tld = parts.length > 1 ? '.' + parts[parts.length - 1] : ''
    const sld = parts.length > 1 ? parts[parts.length - 2] : parts[0]

    const domain = await prisma.domain.upsert({
      where: { name: domainName.toLowerCase() },
      update: {},
      create: {
        name: domainName.toLowerCase(),
        sld,
        tld,
        status: 'active',
      },
    })

    // Create monitor
    const monitor = await prisma.domainMonitor.create({
      data: {
        domainId: domain.id,
        userId: userId || null,
        alertEmail: alertEmail || null,
        isActive: true,
      },
      include: {
        domain: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: monitor,
      message: 'Domain monitoring started successfully',
    })
  } catch (error) {
    console.error('Create monitor error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create monitor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const monitorId = searchParams.get('id')

    if (!monitorId) {
      return NextResponse.json(
        { success: false, error: 'Monitor ID is required' },
        { status: 400 }
      )
    }

    await prisma.domainMonitor.delete({
      where: { id: monitorId },
    })

    return NextResponse.json({
      success: true,
      message: 'Monitor deleted successfully',
    })
  } catch (error) {
    console.error('Delete monitor error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete monitor' },
      { status: 500 }
    )
  }
}
