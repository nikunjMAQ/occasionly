import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

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

export async function POST(req: NextRequest) {
  ensureVapidDetails();
  // 1. Auth — require active user session
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse optional custom payload from body
  let customTitle: string | undefined;
  let customBody: string | undefined;
  let customUrl: string | undefined;

  try {
    const body = await req.json().catch(() => ({}));
    customTitle = body.title;
    customBody = body.body;
    customUrl = body.url;
  } catch {
    // ignore, use defaults
  }

  const title = customTitle ?? "🎉 Occasionly Test Notification";
  const body = customBody ?? "This is a test. Tap to open WhatsApp.";
  const url = customUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? "/";

  // 3. Fetch subscriptions for this user via admin client
  const admin = await createAdminClient();
  const { data: subscriptions, error: fetchError } = await admin
    .from("push_subscriptions")
    .select("id, endpoint, subscription")
    .eq("user_id", user.id);

  if (fetchError) {
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ sent: 0, message: "No subscriptions found. Enable push notifications first." });
  }

  const payload = JSON.stringify({ title, body, url });
  let sent = 0;
  const staleEndpoints: string[] = [];

  await Promise.allSettled(
    subscriptions.map(async (row) => {
      try {
        await webpush.sendNotification(row.subscription as webpush.PushSubscription, payload);
        sent++;
      } catch (err: unknown) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 410 || status === 404) {
          staleEndpoints.push(row.endpoint);
        }
      }
    })
  );

  if (staleEndpoints.length > 0) {
    await admin.from("push_subscriptions").delete().in("endpoint", staleEndpoints);
  }

  return NextResponse.json({ sent, stale_removed: staleEndpoints.length });
}
