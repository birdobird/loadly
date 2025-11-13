import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { q } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData();
  const image = String(form.get("image") || "");
  const caption = String(form.get("caption") || "");

  const user = await q("SELECT id FROM users WHERE email=$1", [
    session.user.email,
  ]);
  const userId = user.rows[0]?.id;
  if (!userId)
    return NextResponse.json({ error: "user_not_found" }, { status: 400 });

  const conn = await q(
    "SELECT page_id, page_access_token FROM meta_connections WHERE user_id=$1",
    [userId]
  );

  const pageId = conn.rows[0]?.page_id;
  const pageToken = conn.rows[0]?.page_access_token;

  if (!pageId || !pageToken)
    return NextResponse.json({ error: "no_facebook_connection" }, { status: 400 });

  const apiUrl = `https://graph.facebook.com/v20.0/${pageId}/photos`;

  const fbRes = await fetch(apiUrl, {
    method: "POST",
    body: new URLSearchParams({
      url: image,
      caption,
      access_token: pageToken,
    }),
  });

  const data = await fbRes.json();

  if (!fbRes.ok)
    return NextResponse.json({ error: "facebook_error", details: data }, { status: 500 });

  return NextResponse.json({
    ok: true,
    platform: "facebook",
    post_id: data.post_id,
  });
}
