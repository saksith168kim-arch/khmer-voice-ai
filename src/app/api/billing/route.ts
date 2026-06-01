import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import {
  createCheckoutSession,
  createBillingPortalSession,
  getInvoices,
} from '@/lib/stripe'
import { z } from 'zod'

const checkoutSchema = z.object({
  priceId: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { action } = body

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    if (action === 'checkout') {
      const parsed = checkoutSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
      }

      const url = await createCheckoutSession(
        session.user.id,
        session.user.email,
        parsed.data.priceId,
        `${baseUrl}/dashboard/billing?success=true`,
        `${baseUrl}/dashboard/billing?canceled=true`
      )

      return NextResponse.json({ success: true, url })
    }

    if (action === 'portal') {
      const url = await createBillingPortalSession(
        session.user.id,
        `${baseUrl}/dashboard/billing`
      )
      return NextResponse.json({ success: true, url })
    }

    if (action === 'invoices') {
      const invoices = await getInvoices(session.user.id)
      return NextResponse.json({ success: true, data: invoices })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Billing error:', error)
    return NextResponse.json(
      { error: 'Billing operation failed', details: (error as Error).message },
      { status: 500 }
    )
  }
}
