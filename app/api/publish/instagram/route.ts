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
    "SELECT ig_business_id, ig_access_token FROM meta_connections WHERE user_id=$1",
    [userId]
  );

  const igId = conn.rows[0]?.ig_business_id;
  const igToken = conn.rows[0]?.ig_access_token;

  if (!igId || !igToken)
    return NextResponse.json({ error: "no_instagram_connection" }, { status: 400 });

  const createMedia = await fetch(
    `https://graph.facebook.com/v20.0/${igId}/media`,
    {
      method: "POST",
      body: new URLSearchParams({
        image_url: image,
        caption,
        access_token: igToken,
      }),
    }
  );

  const mediaData = await createMedia.json();

  if (!createMedia.ok)
    return NextResponse.json(
      { error: "instagram_media_error", details: mediaData },
      { status: 500 }
    );

  const publish = await fetch(
    `https://graph.facebook.com/v20.0/${igId}/media_publish`,
    {
      method: "POST",
      body: new URLSearchParams({
        creation_id: mediaData.id,
        access_token: igToken,
      }),
    }
  );

  const publishData = await publish.json();

  if (!publish.ok)
    return NextResponse.json(
      { error: "instagram_publish_error", details: publishData },
      { status: 500 }
    );

  return NextResponse.json({
    ok: true,
    platform: "instagram",
    media_id: mediaData.id,
    published_id: publishData.id,
  });
}
