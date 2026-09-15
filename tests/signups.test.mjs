import { test } from "node:test";
import assert from "node:assert/strict";
import { POST } from "../app/api/signups/route.ts";

const valid = { kind:"waitlist", email:" Person@example.com ", interest:"love", consent:true };
const request = (body, origin="https://slc.test") => new Request("https://slc.test/api/signups", {
  method:"POST", headers:{"Content-Type":"application/json", Origin:origin}, body:JSON.stringify(body),
});
test("signups reject invalid data and never report unsaved details as saved", async () => {
  const originalFetch = globalThis.fetch;
  const originalUrl = process.env.SUPABASE_URL;
  const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  try {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    assert.equal((await POST(request(valid))).status,503);
    assert.equal((await POST(request({...valid,consent:false}))).status,400);
    assert.equal((await POST(request({...valid,email:"invalid"}))).status,400);
    assert.equal((await POST(request({...valid,interest:"unknown"}))).status,400);
    assert.equal((await POST(request(valid,"https://other.test"))).status,403);
    assert.equal((await POST(request({...valid,fax:"bot"}))).status,400);
    assert.equal((await POST(request({...valid,extra:"x".repeat(17000)}))).status,413);
    process.env.SUPABASE_URL = "https://database.example";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
    let writes = [];
    globalThis.fetch = async (url,options) => {
      writes.push({url:String(url),options,record:JSON.parse(options.body)});
      return new Response(null,{status:201});
    };
    const saved = await POST(request(valid));
    assert.equal(saved.status,200);
    assert.equal((await saved.json()).saved,true);
    assert.equal(writes[0].record.email,"person@example.com");
    assert.ok(writes[0].record.consent_at);
    assert.match(writes[0].url,/slc_waitlist/);
    assert.equal(writes[0].options.headers.Prefer,"resolution=ignore-duplicates,return=minimal");
    const partner = {...valid,kind:"partner",name:"Test",organisation:"Test project",proposal:"A test partnership proposal for review only.",requestId:"12345678-1234-4123-8123-123456789abc"};
    assert.equal((await POST(request(partner))).status,200);
    assert.match(writes[1].url,/slc_partner_applications/);
    assert.equal(writes[1].record.status,undefined); // Database owns pending/review status.
    assert.equal((await POST(request({...partner,website:"javascript:alert(1)"}))).status,400);
    globalThis.fetch = async () => new Response(null,{status:500});
    const failed = await POST(request(valid));
    assert.equal(failed.status,502);
    assert.notEqual((await failed.json()).saved,true);
    globalThis.fetch = async () => { throw new Error("network failure"); };
    assert.equal((await POST(request(valid))).status,502);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = originalUrl;
    if (originalKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
  }
});
