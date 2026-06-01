import { PrismaClient, VoiceGender, VoiceLanguage } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@khmervoiceai.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@khmervoiceai.com',
      passwordHash: adminPassword,
      role: 'admin',
      subscriptionPlan: 'ENTERPRISE',
      charactersLimit: 999999999,
    },
  })

  // Create demo user
  const demoPassword = await bcrypt.hash('demo1234', 12)
  await prisma.user.upsert({
    where: { email: 'demo@khmervoiceai.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@khmervoiceai.com',
      passwordHash: demoPassword,
      subscriptionPlan: 'PRO',
      charactersLimit: 500000,
    },
  })

  // Create voices
  const voices = [
    {
      name: 'sovannara',
      displayName: 'Sovannara',
      description: 'Clear, professional male Khmer voice',
      language: VoiceLanguage.KHMER,
      gender: VoiceGender.MALE,
      accent: 'Phnom Penh',
      provider: 'kiritts',
      isFeatured: true,
      sortOrder: 1,
      tags: ['professional', 'news', 'narration'],
    },
    {
      name: 'channary',
      displayName: 'Channary',
      description: 'Warm, expressive female Khmer voice',
      language: VoiceLanguage.KHMER,
      gender: VoiceGender.FEMALE,
      accent: 'Phnom Penh',
      provider: 'kiritts',
      isFeatured: true,
      sortOrder: 2,
      tags: ['warm', 'storytelling', 'education'],
    },
    {
      name: 'dara',
      displayName: 'Dara',
      description: 'Authoritative male Khmer broadcasting voice',
      language: VoiceLanguage.KHMER,
      gender: VoiceGender.MALE,
      accent: 'Standard Khmer',
      provider: 'kiritts',
      isFeatured: false,
      sortOrder: 3,
      tags: ['news', 'broadcasting', 'formal'],
    },
    {
      name: 'bopha',
      displayName: 'Bopha',
      description: 'Gentle, friendly female Khmer voice',
      language: VoiceLanguage.KHMER,
      gender: VoiceGender.FEMALE,
      accent: 'Standard Khmer',
      provider: 'kiritts',
      isFeatured: false,
      sortOrder: 4,
      tags: ['friendly', 'customer-service', 'casual'],
    },
    {
      name: 'james',
      displayName: 'James',
      description: 'Deep, professional American English voice',
      language: VoiceLanguage.ENGLISH,
      gender: VoiceGender.MALE,
      accent: 'American',
      provider: 'elevenlabs',
      isFeatured: true,
      sortOrder: 5,
      tags: ['professional', 'deep', 'narration'],
    },
    {
      name: 'sophia',
      displayName: 'Sophia',
      description: 'Clear, natural British English female voice',
      language: VoiceLanguage.ENGLISH,
      gender: VoiceGender.FEMALE,
      accent: 'British',
      provider: 'elevenlabs',
      isFeatured: true,
      sortOrder: 6,
      tags: ['clear', 'british', 'education'],
    },
    {
      name: 'alex',
      displayName: 'Alex',
      description: 'Energetic American English male voice',
      language: VoiceLanguage.ENGLISH,
      gender: VoiceGender.MALE,
      accent: 'American',
      provider: 'elevenlabs',
      isFeatured: false,
      sortOrder: 7,
      tags: ['energetic', 'marketing', 'casual'],
    },
    {
      name: 'maya',
      displayName: 'Maya',
      description: 'Warm, conversational American English voice',
      language: VoiceLanguage.ENGLISH,
      gender: VoiceGender.FEMALE,
      accent: 'American',
      provider: 'elevenlabs',
      isFeatured: false,
      sortOrder: 8,
      tags: ['warm', 'conversational', 'podcast'],
    },
    {
      name: 'vicheka',
      displayName: 'Vicheka',
      description: 'Natural bilingual Khmer-English voice',
      language: VoiceLanguage.BILINGUAL,
      gender: VoiceGender.MALE,
      accent: 'Khmer-English',
      provider: 'kiritts',
      isFeatured: true,
      sortOrder: 9,
      tags: ['bilingual', 'versatile'],
    },
    {
      name: 'sreymom',
      displayName: 'Sreymom',
      description: 'Versatile bilingual female voice',
      language: VoiceLanguage.BILINGUAL,
      gender: VoiceGender.FEMALE,
      accent: 'Khmer-English',
      provider: 'kiritts',
      isFeatured: true,
      sortOrder: 10,
      tags: ['bilingual', 'versatile', 'education'],
    },
  ]

  for (const voice of voices) {
    await prisma.voice.upsert({
      where: { id: voice.name },
      update: {},
      create: { id: voice.name, ...voice },
    })
  }

  console.log(`✅ Seeded ${voices.length} voices`)
  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
