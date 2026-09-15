# Soft Life Club Store

## Latest update

The homepage now introduces Love, Escapes, Wardrobe and Society. Love and Escapes are Coming Soon; Wardrobe holds all five clothing/accessory categories; Society contains the journal. Join SLC and Partners have separate submission forms.

Real collection is implemented through a server-only Supabase REST route, but live configuration is not complete. Follow SIGNUPS-SETUP.md and run supabase/001_slc_signups.sql in the selected project, then add the two server environment variables to Vercel and redeploy. Missing configuration produces an error instead of pretending to save emails.

All nine T-shirt contact-sheet crops have been replaced with individual generated product renders. The built-in image generator used each original slogan and colour from the supplied reference to create complete, uncropped 1122×1402 back-facing tee visualisations. Files are public/tees/<product-id>.png. The source board is retained for reference.

A Vercel-ready Next.js clothing and lifestyle storefront. Five category pages, thirteen product pages and a Community / Blog hub with three original starter articles.

## Updating the live site

Upload the updated app, components and public folders to the root of the existing GitHub repository and commit. The connected Vercel project can then deploy the commit. Keep all nested folders, including the square-bracket route folders.

## Content

Edit products, category names, quotes and two-line descriptions in components/catalogue.ts. Edit journal articles in components/journal.ts. The four new categories each contain one AI-generated design concept; they are labelled as concepts and are not purchasable. Materials, sizing, stock, performance specifications and prices for these pieces have not been supplied. Sunglasses carry the SLC logo only; their quote is editorial copy.

The built-in image generator produced the four concept assets using the approved SLC logo and neutral palette. Clothing prompts specified the visible slogans: “OFF DUTY. STILL THAT GIRL.”, “SOFT LIFE. STRONG CORE.” and “MOVING AT MY OWN PACE.” Product image paths are public/joggers.png, public/sports-bra.png, public/sunglasses.png and public/tracksuit.png.

Community / Blog currently provides editorial reading pages, not accounts, public posts or comments.

## Before launch

1. Add approved prices, currency, sizes and stock to the catalogue and connect the shopping flow.
2. Add individual product photography when available.
3. Create the matching Stripe products/prices and connect checkout.
4. Add approved contact details, shipping, returns, privacy and terms pages.

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Import this folder into Vercel, then add the required environment variables from `.env.example`.
