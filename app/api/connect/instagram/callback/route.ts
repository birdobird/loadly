import { NextRequest, NextResponse } from "next/server";
import { q } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.redirect("/login");

  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect("/?error=no_code");

  // 1) WYMIANA CODE → SHORT TOKEN
  const shortRes = await fetch(
    `https://graph.facebook.com/v20.0/oauth/access_token?` +
      new URLSearchParams({
        client_id: process.env.META_APP_ID!,
        client_secret: process.env.META_APP_SECRET!,
        redirect_uri: process.env.META_REDIRECT_IG!,
        code,
      })
  );

  const shortData = await shortRes.json();
  if (!shortData.access_token)
    return NextResponse.redirect("/?error=short_token_fail");

  const shortToken = shortData.access_token;

  // 2) SHORT → LONG TOKEN
  const longRes = await fetch(
    `https://graph.facebook.com/v20.0/oauth/access_token?` +
      new URLSearchParams({
        grant_type: "fb_exchange_token",
        client_id: process.env.META_APP_ID!,
        client_secret: process.env.META_APP_SECRET!,
        fb_exchange_token: shortToken,
      })
  );

  const longData = await longRes.json();
  if (!longData.access_token)
    return NextResponse.redirect("/?error=long_token_fail");

  const token = longData.access_token;

  // 3) LISTA STRON (konieczne do pobrania konta IG)
  const pagesRes = await fetch(
    `https://graph.facebook.com/v20.0/me/accounts?access_token=${token}`
  );
  const pagesData = await pagesRes.json();

  if (!pagesData.data?.length)
    return NextResponse.redirect("/?error=no_pages");

  // Szuka strony, do której jest podłączony IG
  let igBusinessId: string | null = null;

  for (const page of pagesData.data) {
    const igRes = await fetch(
      `https://graph.facebook.com/v20.0/${page.id}?fields=instagram_business_account&access_token=${token}`
    );
    const igData = await igRes.json();

    if (igData.instagram_business_account?.id) {
      igBusinessId = igData.instagram_business_account.id;
      break;
    }
  }

  if (!igBusinessId)
    return NextResponse.redirect("/?error=no_ig_business_account");

  // 4) Zapis do bazy
  const user = await q("SELECT id FROM users WHERE email=$1", [
    session.user.email,
  ]);

  const userId = user.rows[0].id;

  await q(
    `
    INSERT INTO meta_connections (user_id, ig_user_id, ig_token)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id)
    DO UPDATE SET ig_user_id = $2, ig_token = $3, updated_at = now()
    `,
    [userId, igBusinessId, token]
  );

  return NextResponse.redirect("/?connected=instagram");
}
