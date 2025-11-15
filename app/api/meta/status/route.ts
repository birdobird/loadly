import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { q } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ connected: false }, { status: 401 });

  const user = await q("SELECT id FROM users WHERE email=$1", [
    session.user.email,
  ]);

  const userId = user.rows[0]?.id;
  if (!userId) return NextResponse.json({ connected: false });

  const conn = await q(
    "SELECT fb_page_id, ig_user_id FROM meta_connections WHERE user_id=$1",
    [userId]
  );

  return NextResponse.json({
    facebook: Boolean(conn.rows[0]?.fb_page_id),
    instagram: Boolean(conn.rows[0]?.ig_user_id),
  });
}
