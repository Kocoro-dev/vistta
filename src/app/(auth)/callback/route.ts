import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if this is a new user (created in the last 60 seconds)
      const createdAt = new Date(data.user.created_at);
      const now = new Date();
      const isNewUser = (now.getTime() - createdAt.getTime()) < 60000; // 60 seconds

      // Redirect with registration flag if new user
      const redirectUrl = new URL(next, origin);
      if (isNewUser) {
        redirectUrl.searchParams.set("registered", "true");
      }

      return NextResponse.redirect(redirectUrl.toString());
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
