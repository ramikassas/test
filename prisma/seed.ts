import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Sample domains with keywords
  const sampleDomains = [
    { name: 'techstartup.com', tld: '.com', keywords: ['tech', 'startup'], searchVolumes: [15000, 8000] },
    { name: 'cloudhosting.net', tld: '.net', keywords: ['cloud', 'hosting'], searchVolumes: [12000, 20000] },
    { name: 'aitools.io', tld: '.io', keywords: ['ai', 'tools'], searchVolumes: [25000, 10000] },
    { name: 'webdesign.com', tld: '.com', keywords: ['web', 'design'], searchVolumes: [18000, 22000] },
    { name: 'ecommerce.store', tld: '.store', keywords: ['ecommerce'], searchVolumes: [30000] },
    { name: 'digitalmarketing.agency', tld: '.agency', keywords: ['digital', 'marketing'], searchVolumes: [14000, 35000] },
    { name: 'blockchain.tech', tld: '.tech', keywords: ['blockchain'], searchVolumes: [40000] },
    { name: 'machinelearning.ai', tld: '.ai', keywords: ['machine', 'learning'], searchVolumes: [28000, 32000] },
    { name: 'cybersecurity.com', tld: '.com', keywords: ['cybersecurity'], searchVolumes: [24000] },
    { name: 'dataanalytics.io', tld: '.io', keywords: ['data', 'analytics'], searchVolumes: [16000, 19000] },
    { name: 'mobilegaming.app', tld: '.app', keywords: ['mobile', 'gaming'], searchVolumes: [11000, 26000] },
    { name: 'socialmedia.network', tld: '.network', keywords: ['social', 'media'], searchVolumes: [21000, 29000] },
    { name: 'fintech.solutions', tld: '.solutions', keywords: ['fintech'], searchVolumes: [17000] },
    { name: 'healthtech.care', tld: '.care', keywords: ['health', 'tech'], searchVolumes: [13000, 15000] },
    { name: 'edtech.education', tld: '.education', keywords: ['edtech'], searchVolumes: [9000] },
  ]

  for (const domainData of sampleDomains) {
    const parts = domainData.name.split('.')
    const sld = parts[0]

    // Create domain
    const domain = await prisma.domain.upsert({
      where: { name: domainData.name },
      update: {},
      create: {
        name: domainData.name,
        sld,
        tld: domainData.tld,
        status: 'active',
        registeredAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      },
    })

    console.log(`✓ Created domain: ${domain.name}`)

    // Create keywords and associations
    for (let i = 0; i < domainData.keywords.length; i++) {
      const keywordText = domainData.keywords[i]
      const searchVolume = domainData.searchVolumes[i] || 0

      const keyword = await prisma.keyword.upsert({
        where: { word: keywordText },
        update: {
          searchVolume: Math.max(searchVolume, (await prisma.keyword.findUnique({ where: { word: keywordText } }))?.searchVolume || 0),
        },
        create: {
          word: keywordText,
          searchVolume,
          cpc: Math.random() * 5 + 0.5,
          competition: Math.random(),
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

      // Create keyword trends for the last 30 days
      for (let day = 0; day < 30; day++) {
        const date = new Date()
        date.setDate(date.getDate() - day)
        date.setHours(0, 0, 0, 0)

        await prisma.keywordTrend.upsert({
          where: {
            keywordId_date: {
              keywordId: keyword.id,
              date,
            },
          },
          update: {},
          create: {
            keywordId: keyword.id,
            date,
            domainCount: Math.floor(Math.random() * 100) + 50,
            newDomains: Math.floor(Math.random() * 20),
          },
        })
      }
    }
  }

  // Create TLD statistics
  const tlds = ['.com', '.net', '.org', '.io', '.ai', '.tech', '.app', '.store', '.agency', '.network']

  for (const tld of tlds) {
    await prisma.tldStatistic.upsert({
      where: { tld },
      update: {},
      create: {
        tld,
        totalDomains: Math.floor(Math.random() * 10000) + 1000,
        newDomains: Math.floor(Math.random() * 500) + 50,
      },
    })
  }

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
