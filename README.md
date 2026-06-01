# 🎙️ Khmer Voice AI

A production-ready SaaS Text-to-Speech platform with native Khmer and English AI voices.

## ✨ Features

- 🇰🇭 **Native Khmer Language Support** — Purpose-built TTS for Khmer script
- 🌐 **Multi-language** — Khmer, English, and bilingual voices
- 🤖 **Multiple TTS Providers** — ElevenLabs, Azure Speech, Google Cloud TTS, Kiri TTS
- 💳 **Stripe Subscriptions** — Free, Pro, and Enterprise plans
- 🔐 **Auth.js Authentication** — Email/password + Google OAuth
- 📦 **AWS S3 / Cloudflare R2** — Scalable audio file storage
- 🗄️ **PostgreSQL + Prisma** — Type-safe database ORM
- 🎨 **Premium Dark UI** — ElevenLabs/PlayHT quality design
- 📱 **Responsive** — Mobile-first layout

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | Auth.js (NextAuth v5) |
| Database | PostgreSQL + Prisma ORM |
| Payments | Stripe |
| Storage | AWS S3 / Cloudflare R2 |
| TTS | ElevenLabs, Azure, Google, Kiri TTS |
| Deployment | Vercel / Docker |

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/yourorg/khmer-voice-ai.git
cd khmer-voice-ai
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your API keys
```

Required variables:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — Random 32+ char secret
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — For OAuth
- `ELEVENLABS_API_KEY` — For TTS generation
- `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` — For billing
- `AWS_ACCESS_KEY_ID` etc. — For audio storage

### 3. Database Setup

```bash
# Run migrations
npm run db:migrate

# Seed voices and admin user
npm run db:seed
```

### 4. Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo credentials:**
- Admin: `admin@khmervoiceai.com` / `admin123!`
- User: `demo@khmervoiceai.com` / `demo1234`

## 🐳 Docker Deployment

```bash
# Start all services
docker-compose up -d

# Run migrations inside container
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx tsx prisma/seed.ts
```

## ☁️ Vercel Deployment

1. Push to GitHub
2. Import in Vercel
3. Add all environment variables
4. Deploy

```bash
# Vercel CLI
vercel --prod
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth pages (login, register)
│   ├── dashboard/          # Protected dashboard
│   │   ├── tts/            # Text-to-Speech studio
│   │   ├── voices/         # Voice library
│   │   ├── history/        # Generation history
│   │   ├── api-keys/       # API key management
│   │   ├── billing/        # Stripe billing
│   │   └── settings/       # User settings
│   └── api/                # API routes
│       ├── tts/            # POST /api/tts
│       ├── voices/         # GET /api/voices
│       ├── history/        # GET/DELETE /api/history
│       ├── api-keys/       # CRUD /api/api-keys
│       ├── billing/        # POST /api/billing
│       └── webhooks/       # Stripe webhook
├── components/
│   ├── landing/            # Landing page sections
│   ├── dashboard/          # Dashboard UI components
│   └── auth/               # Auth form components
├── lib/
│   ├── auth/               # Auth.js config
│   ├── db/                 # Prisma client
│   ├── tts/                # TTS provider abstraction
│   ├── storage/            # S3/R2 storage
│   └── stripe/             # Stripe utilities
├── types/                  # TypeScript types
└── middleware.ts            # Route protection
prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Seed data
```

## 🔑 API Reference

### Generate Speech

```http
POST /api/tts
x-api-key: kva_your_api_key

{
  "text": "Hello World",
  "voiceId": "voice-id",
  "language": "en",
  "speed": 1.0,
  "pitch": 1.0,
  "format": "mp3"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "generationId": "...",
    "audioUrl": "https://...",
    "characters": 11
  }
}
```

### List Voices

```http
GET /api/voices?language=KHMER&gender=FEMALE
```

## 🎤 Adding a TTS Provider

The provider abstraction (`src/lib/tts/service.ts`) makes it easy to add new providers:

```typescript
class MyProvider implements TTSProvider {
  name = 'myprovider'
  
  async generateSpeech(request: TTSRequest): Promise<Buffer> {
    // Call your TTS API
    return audioBuffer
  }
  
  async getAvailableVoices(): Promise<ProviderVoice[]> {
    return []
  }
}

// Register in TTSService constructor:
this.providers.set('myprovider', new MyProvider(apiKey))
```

## 💳 Stripe Setup

1. Create products in Stripe Dashboard
2. Copy price IDs to `.env`
3. Set up webhook endpoint: `POST /api/webhooks/stripe`
4. Configure webhook events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`

## 📊 Database Schema

| Table | Description |
|-------|-------------|
| `users` | User accounts + subscription info |
| `accounts` | OAuth provider accounts |
| `sessions` | Auth sessions |
| `voices` | Available TTS voices |
| `generations` | Audio generation history |
| `api_keys` | API keys per user |
| `usage_logs` | Character usage tracking |

## 🛡️ Security

- All dashboard routes protected by middleware
- API keys hashed/masked in display
- Rate limiting on TTS endpoint
- Stripe webhook signature verification
- Password hashing with bcrypt (12 rounds)
- CSRF protection via Auth.js

## 📄 License

MIT License — see [LICENSE](LICENSE)

---

Built with ❤️ for Cambodia 🇰🇭
