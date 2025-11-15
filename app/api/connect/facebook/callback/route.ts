import { NextRequest, NextResponse } from "next/server";
import { q } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.redirect("/login");

  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect("/?error=no_code");

  // 1) Wymiana CODE na ACCESS TOKEN
  const tokenRes = await fetch(
    `https://graph.facebook.com/v20.0/oauth/access_token?` +
      new URLSearchParams({
        client_id: process.env.META_APP_ID!,
        client_secret: process.env.META_APP_SECRET!,
        redirect_uri: process.env.META_REDIRECT_FB!,
        code,
      })
  );

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token)
    return NextResponse.redirect("/?error=token_fail");

  const userToken = tokenData.access_token;

  // 2) Pobranie listy stron użytkownika
  const pagesRes = await fetch(
    `https://graph.facebook.com/v20.0/me/accounts?access_token=${userToken}`
  );

  const pagesData = await pagesRes.json();

  if (!pagesData.data?.length)
    return NextResponse.redirect("/?error=no_pages_found");

  // BIERZEMY PIERWSZĄ STRONĘ
  const page = pagesData.data[0];

  // 3) Zapis do bazy
  const user = await q("SELECT id FROM users WHERE email=$1", [
    session.user.email,
  ]);

  const userId = user.rows[0].id;

  await q(
    `
    INSERT INTO meta_connections (user_id, fb_page_id, fb_page_token)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id)
    DO UPDATE SET fb_page_id = $2, fb_page_token = $3, updated_at = now()
    `,
    [userId, page.id, page.access_token]
  );

  return NextResponse.redirect("/?connected=facebook");
}
