import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

let vapidInitialized = false;
function ensureVapidDetails() {
  if (vapidInitialized) return;
  const subject = process.env.VAPID_SUBJECT;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!subject || !publicKey || !privateKey) {
    console.warn("[Push] VAPID keys not configured in environment.");
    return;
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);
  vapidInitialized = true;
}

let supabaseAdminInstance: any = null;
function getSupabaseAdmin(): any {
  if (supabaseAdminInstance) return supabaseAdminInstance;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase credentials not configured in environment.");
  }
  supabaseAdminInstance = createClient(url, serviceKey);
  return supabaseAdminInstance;
}

interface SendPushBody {
  user_id: string;
  title: string;
  body: string;
  url?: string;
}

export async function POST(req: NextRequest) {
  ensureVapidDetails();
  const supabaseAdmin = getSupabaseAdmin();
  // 1. Verify caller is our own Edge Function (service role key as Bearer token)
  const authHeader = req.headers.get("Authorization");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!authHeader || authHeader !== `Bearer ${serviceRoleKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse body
  let body: SendPushBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { user_id, title, body: notifBody, url } = body;
  if (!user_id || !title || !notifBody) {
    return NextResponse.json({ error: "Missing required fields: user_id, title, body" }, { status: 400 });
  }

  // 3. Fetch all push subscriptions for this user
  const { data: subscriptions, error: fetchError } = await supabaseAdmin
    .from("push_subscriptions")
    .select("id, endpoint, subscription")
    .eq("user_id", user_id);

  if (fetchError) {
    return NextResponse.json({ error: "Failed to fetch subscriptions", details: fetchError }, { status: 500 });
  }

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ sent: 0, message: "No push subscriptions found for this user" });
  }

  // 4. Build notification payload
  const payload = JSON.stringify({ title, body: notifBody, url: url || "/" });

  let sent = 0;
  let failed = 0;
  const staleEndpoints: string[] = [];

  // 5. Fan out to all subscriptions (multiple devices)
  await Promise.allSettled(
    subscriptions.map(async (row: any) => {
      try {
        await webpush.sendNotification(
          row.subscription as webpush.PushSubscription,
          payload
        );
        sent++;
      } catch (err: unknown) {
        const status = (err as { statusCode?: number }).statusCode;

        if (status === 410 || status === 404) {
          // Subscription is expired / gone — clean it up
          staleEndpoints.push(row.endpoint);
          console.log(`[Push] Stale subscription removed: ${row.endpoint}`);
        } else {
          console.error(`[Push] Failed to send to ${row.endpoint}:`, err);
          failed++;
        }
      }
    })
  );

  // 6. Remove stale subscriptions
  if (staleEndpoints.length > 0) {
    await supabaseAdmin
      .from("push_subscriptions")
      .delete()
      .in("endpoint", staleEndpoints);
  }

  return NextResponse.json({
    sent,
    failed,
    stale_removed: staleEndpoints.length,
    total: subscriptions.length,
  });
}
