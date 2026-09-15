export const runtime = "nodejs";

const allowed = new Set(["all", "love", "escapes", "wardrobe", "society"]);
const consentText = {
  waitlist: "I agree that SLC may save my email and send me updates about the areas I’ve selected.",
  partner: "I agree that SLC may save these details to review my application and contact me about this proposal.",
};
function reply(body: object, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return reply({ error: "Please submit this form from the SLC website." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return reply({ error: "Invalid form submission." }, 415);
  let payload: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error();
    let length = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 16000) { await reader.cancel(); return reply({ error: "Your submission is too long." }, 413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    payload = JSON.parse(new TextDecoder().decode(bytes));
    if (!payload || Array.isArray(payload) || typeof payload !== "object") throw new Error();
  } catch { return reply({ error: "Please check your form and try again." }, 400); }
  const clean = (name: string) => typeof payload[name] === "string" ? (payload[name] as string).trim() : "";
  const kind = clean("kind");
  const email = clean("email").toLowerCase();
  const interest = clean("interest");
  if (!["waitlist", "partner"].includes(kind) || clean("fax") || payload.consent !== true ||
      email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !allowed.has(interest)) {
    return reply({ error: "Please enter a valid email, select an SLC area and tick the consent box." }, 400);
  }
  const isPartner = kind === "partner";
  const name = clean("name"), organisation = clean("organisation"), website = clean("website"), proposal = clean("proposal"), id = clean("requestId");
  if (isPartner && (!name || name.length > 120 || !organisation || organisation.length > 160 || proposal.length < 20 || proposal.length > 3000 ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))) {
    return reply({ error: "Please add your name, organisation and a short description of your idea." }, 400);
  }
  if (isPartner && website) {
    try { const url = new URL(website); if (!["http:", "https:"].includes(url.protocol) || website.length > 500) throw new Error(); }
    catch { return reply({ error: "Please use a full website or social link starting with https://." }, 400); }
  }
  const databaseUrl = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!databaseUrl || !secret) return reply({ error: "Signups are temporarily unavailable. Your details have not been saved. Please try again later." }, 503);
  const timestamp = new Date().toISOString();
  const record = isPartner
    ? { id, email, interest, name, organisation, website: website || null, proposal, consent_text: consentText.partner, consent_at: timestamp }
    : { email, interest, consent_text: consentText.waitlist, consent_at: timestamp };
  const table = isPartner ? "slc_partner_applications" : "slc_waitlist";
  try {
    const endpoint = new URL(`/rest/v1/${table}`, databaseUrl);
    if (endpoint.protocol !== "https:") throw new Error();
    endpoint.searchParams.set("on_conflict", isPartner ? "id" : "email");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: secret, Authorization: `Bearer ${secret}`, "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify(record), cache: "no-store", signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) return reply({ error: "We couldn’t save your details. Please try again later." }, 502);
    return reply({ saved: true });
  } catch { return reply({ error: "We couldn’t confirm your submission. Please try again; duplicates won’t create another record." }, 502); }
}
