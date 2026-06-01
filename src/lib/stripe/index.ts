import Stripe from 'stripe'
import { prisma } from '@/lib/db/prisma'
import { PLAN_LIMITS } from '@/types'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

export async function createOrRetrieveCustomer(userId: string, email: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true, name: true },
  })

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name: user?.name || undefined,
    metadata: { userId },
  })

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  })

  return customer.id
}

export async function createCheckoutSession(
  userId: string,
  email: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  const customerId = await createOrRetrieveCustomer(userId, email)

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId },
    subscription_data: {
      metadata: { userId },
    },
    allow_promotion_codes: true,
  })

  return session.url!
}

export async function createBillingPortalSession(
  userId: string,
  returnUrl: string
): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  })

  if (!user?.stripeCustomerId) {
    throw new Error('No Stripe customer found')
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: returnUrl,
  })

  return session.url
}

export async function handleStripeWebhook(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      if (!userId || !session.subscription) break

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
      const priceId = subscription.items.data[0].price.id

      // Determine plan from priceId
      const plan =
        priceId === process.env.STRIPE_PRO_PRICE_ID
          ? 'PRO'
          : ('FREE' as 'PRO' | 'FREE' | 'ENTERPRISE')

      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          subscriptionPlan: plan,
          subscriptionStatus: 'ACTIVE',
          charactersLimit: PLAN_LIMITS[plan].characters,
        },
      })
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      if (!invoice.subscription) break

      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
      const userId = subscription.metadata?.userId
      if (!userId) break

      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          subscriptionStatus: 'ACTIVE',
          // Reset monthly characters
          charactersUsed: 0,
        },
      })
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      if (!invoice.subscription) break

      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
      const userId = subscription.metadata?.userId
      if (!userId) break

      await prisma.user.update({
        where: { id: userId },
        data: { subscriptionStatus: 'PAST_DUE' },
      })
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.userId
      if (!userId) break

      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionPlan: 'FREE',
          subscriptionStatus: 'CANCELED',
          stripePriceId: null,
          stripeSubscriptionId: null,
          stripeCurrentPeriodEnd: null,
          charactersLimit: PLAN_LIMITS.FREE.characters,
        },
      })
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.userId
      if (!userId) break

      const priceId = subscription.items.data[0].price.id
      const plan =
        priceId === process.env.STRIPE_PRO_PRICE_ID
          ? 'PRO'
          : ('FREE' as 'PRO' | 'FREE' | 'ENTERPRISE')

      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionPlan: plan,
          subscriptionStatus: subscription.status.toUpperCase() as any,
          stripePriceId: priceId,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          charactersLimit: PLAN_LIMITS[plan].characters,
        },
      })
      break
    }
  }
}

export async function getInvoices(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  })

  if (!user?.stripeCustomerId) return []

  const invoices = await stripe.invoices.list({
    customer: user.stripeCustomerId,
    limit: 10,
  })

  return invoices.data.map((invoice) => ({
    id: invoice.id,
    amount: invoice.amount_paid / 100,
    currency: invoice.currency,
    status: invoice.status,
    date: new Date(invoice.created * 1000),
    pdf: invoice.invoice_pdf,
    hostedUrl: invoice.hosted_invoice_url,
  }))
}
