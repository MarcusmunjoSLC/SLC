import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function requireAdmin(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7);

  const supabaseAdmin = getSupabaseAdmin();

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !user?.email) {
    return null;
  }

  if (
    user.email.toLowerCase() !==
    process.env.ADMIN_EMAIL?.toLowerCase()
  ) {
    return null;
  }

  return user;
}