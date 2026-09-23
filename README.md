# SLC lightweight admin + Stripe checkout

This starter assumes:
- Next.js App Router
- Supabase
- Vercel
- Stripe

## Install

```bash
npm install stripe @supabase/supabase-js
```

## Environment variables

Add these later in Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_SITE_URL=https://your-domain.com
ADMIN_EMAIL=your@email.com
```

## Supabase

Run `supabase/schema.sql` in the Supabase SQL Editor.

Create your admin account in Supabase Authentication using the same email
as `ADMIN_EMAIL`.

## Behaviour before pricing

Products can be created with no price and no Stripe Price ID.

They can still exist in the catalogue, but checkout will refuse to process
an item until `stripe_price_id` has been added.

## When pricing is ready

Create the product price in Stripe and paste the `price_...` ID into the
product from `/admin`.

## Stripe webhook

After deployment, point Stripe to:

`https://YOUR-DOMAIN/api/stripe/webhook`

Listen for:

`checkout.session.completed`
