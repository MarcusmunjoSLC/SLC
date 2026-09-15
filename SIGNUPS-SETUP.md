# Activate real SLC signups

The website has real server-side insert code. No signup is stored in browser local storage or a temporary file. It requires the following Supabase and Vercel configuration before it can collect records. This setup has not been applied to a live database in this delivery.

1. Open the Supabase project you want to use for SLC.
2. In SQL Editor, run supabase/001_slc_signups.sql. This creates slc_waitlist and slc_partner_applications. Public reads and writes are disabled; submissions go through the website server.
3. In Vercel, select the SLC project and add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY as server-side environment variables. Use the project's URL and its legacy service_role API key. Do not put the key in GitHub, a NEXT_PUBLIC variable or a chat message.
4. Deploy the updated website files. Include app, components and public. A redeploy is necessary after setting environment variables.
5. Submit a test signup using an email you control. Check that the row appears in Supabase Table Editor under slc_waitlist before sharing the form.
6. Submit a test partnership application and check slc_partner_applications. Its default status must be pending.

## Where records go

- slc_waitlist: email, selected SLC area, consent wording, consent timestamp, created timestamp, status.
- slc_partner_applications: email, name, organisation, optional website, selected area, proposal, consent wording, timestamps, review status and internal notes.

Review and export records in Supabase Table Editor. Partnership status can be changed there to reviewing, accepted or declined. Changing a status does not send any emails. The public website has no access to read the records or change review statuses.

Waitlist duplicates are ignored by normalized email; the first recorded interest and consent are retained. Partnership retry duplicates are ignored by request ID. A new application after reloading the page is a new request.

## Behaviour and limits

Missing configuration returns 503 and an explicit not-saved message. Failed database writes return an error, never a success toast. The form only says saved when the database API confirms the write. A timeout may happen after a database write; retry safely.

Validation checks email, consent, lengths, area and partner fields. A hidden honeypot catches basic bots; there is no CAPTCHA or distributed rate limit yet. Add provider spam protection if abuse occurs. No welcome emails or marketing campaigns are sent automatically. Review the brand's privacy/contact information and unsubscribe handling before sending campaigns.

## Images

All nine tees now use individual 1122×1402 generated PNG renders under public/tees instead of low-resolution contact-sheet crops. They preserve the supplied colours and slogans but remain concept visualisations, not production photographs.
