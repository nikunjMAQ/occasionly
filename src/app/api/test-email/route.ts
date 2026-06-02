import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendReminderEmail } from "@/services/delivery/email/send-reminder-email";
import { birthdayReminderTemplate } from "@/services/delivery/email/templates/birthday-reminder-template";
import { createWhatsAppLink } from "@/services/delivery/whatsapp/create-link";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const phone = searchParams.get("phone") || "+1234567890";
  const name = searchParams.get("name") || "Nikunj";
  const message = searchParams.get("message") || "Wishing you a wonderful celebration filled with joy and success! 🎉";

  if (!email) {
    return NextResponse.json(
      { error: "Missing required 'email' query parameter." },
      { status: 400 }
    );
  }

  // 1. Get active user details
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fallback to a mock UUID if unauthenticated for local/offline testing ease
  const targetUserId = user?.id || "00000000-0000-0000-0000-000000000000";
  const dummyReminderId = uuidv4();

  // 2. Generate WhatsApp link
  const whatsappLink = createWhatsAppLink(phone, message);

  // 3. Render HTML
  const html = birthdayReminderTemplate({
    personName: name,
    message,
    whatsappLink,
  });

  try {
    // 4. Send email
    const { data: resData, error: sendError } = await sendReminderEmail({
      to: email,
      subject: `🎉 Celebration Alert: ${name}'s Birthday Today!`,
      html,
    });

    if (sendError) {
      console.error("Resend API returned error:", sendError);
      
      // Log failure to public.reminder_deliveries
      await supabase.from("reminder_deliveries").insert({
        reminder_id: dummyReminderId,
        user_id: targetUserId,
        delivery_type: "email",
        status: "failed",
        error_message: sendError.message || JSON.stringify(sendError),
      });

      return NextResponse.json(
        { error: "Failed to dispatch email", details: sendError },
        { status: 500 }
      );
    }

    // Log success to public.reminder_deliveries
    const { error: dbError } = await supabase.from("reminder_deliveries").insert({
      reminder_id: dummyReminderId,
      user_id: targetUserId,
      delivery_type: "email",
      status: "delivered",
      delivered_at: new Date().toISOString(),
    });

    if (dbError) {
      console.warn("Email sent but failed to write log to DB:", dbError.message);
    }

    return NextResponse.json({
      success: true,
      message: `Test email successfully dispatched to ${email}`,
      resendId: resData?.id,
      whatsappLink,
    });
  } catch (err: any) {
    console.error("Unexpected error in test-email handler:", err);
    
    // Log unexpected crash to public.reminder_deliveries
    await supabase.from("reminder_deliveries").insert({
      reminder_id: dummyReminderId,
      user_id: targetUserId,
      delivery_type: "email",
      status: "failed",
      error_message: err.message || err.toString(),
    });

    return NextResponse.json(
      { error: "Unexpected execution exception", details: err.message },
      { status: 500 }
    );
  }
}
