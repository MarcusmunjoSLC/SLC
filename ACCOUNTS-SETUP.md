# Activate SLC accounts

Included: email/password account creation, email confirmation, login, logout, password reset and account-specific wishlists. Size/fit/model guides are on every item.

## Already configured

The browser uses the SLC project's public publishable key. This key is designed to be public; no service-role secret is included in browser code. Email login and sign-up are enabled and email confirmation is required in the connected Supabase project.

The slc_wishlist_items table has been created in that project. Row-level security allows each signed-in customer to read, add and remove only their own items. Guest wishlists stay separate on that browser and are not automatically copied into another person's account. Sign-up does not automatically subscribe someone to marketing or the waitlist.

## Before launch

1. Upload app, components, lib, package.json and package-lock.json to the GitHub repository. Include ACCOUNTS-SETUP.md and supabase/migrations for the project record. Vercel will install the new Supabase client dependency and deploy.
2. Supabase → Authentication → URL Configuration: set Site URL to https://slc-liard.vercel.app and add these exact Redirect URLs:
   - https://slc-liard.vercel.app/account
   - https://slc-liard.vercel.app/account?reset=1
   Add equivalent addresses if using a custom domain. Keep the confirmation and recovery email templates using the standard ConfirmationURL link.
3. Supabase → Authentication → email/SMTP settings: configure a verified email sender through your email provider for public sign-ups and password recovery. Supabase's default email sender is restricted to authorised project-team addresses and is rate-limited; it is not a public production email service. SMTP credentials belong only in Supabase settings.
4. Open /account, choose Create an account, submit an email you control, then follow the confirmation email. Log out and log in again.
5. Save an item, log in on another device/browser, and check /wishlist. Remove it and refresh the other device. Sign out to check account items are no longer shown.
6. Test Forgot password, open the email link, set a new password and verify login with the new password. Test an expired link too.

No additional Vercel environment variables are required for this SLC project. Optional NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY can override the public connection if the project changes. Never use a service-role/secret key for either variable.

## Size and model information

Each product has category-specific measuring instructions. No supplier size chart, garment/frame dimensions or model measurements were provided. These are explicitly marked as unavailable and must be completed from verified supplier/model data before selling. Current images are product renders, not photographs of models.

## Verification

Production build and TypeScript checks passed. Live database isolation was tested with two temporary users in a rolled-back transaction: own read/insert/delete succeeded; cross-user operations were denied. Security advisor reported no wishlist findings. Its informational notices on the existing waitlist and partner tables are intentional: these are server-only tables with no browser policies.

Email delivery, confirmation, reset and full browser login need the launch checks above after deployment and email configuration. They have not been verified against a real customer's mailbox.
