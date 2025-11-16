import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { q } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "unauth" }, { status: 401 });

  const email = session.user.email;

  const userRes = await q(`SELECT id, email, image FROM users WHERE email=$1`, [
    email,
  ]);

  const user = userRes.rows[0];

  const subRes = await q(
    `SELECT plan, credits_remaining 
     FROM subscriptions 
     WHERE user_id=$1 
     ORDER BY created_at DESC 
     LIMIT 1`,
    [user.id]
  );

  const sub = subRes.rows[0] || {
    plan: "free",
    credits_remaining: 1,
  };

  const metaRes = await q(
    `SELECT fb_page_id, ig_user_id 
     FROM meta_connections 
     WHERE user_id=$1`,
    [user.id]
  );

  return NextResponse.json({
    email: user.email,
    image: user.image,
    plan: sub.plan,
    credits: sub.credits_remaining,
    facebook: !!metaRes.rows[0]?.fb_page_id,
    instagram: !!metaRes.rows[0]?.ig_user_id,
  });
}
