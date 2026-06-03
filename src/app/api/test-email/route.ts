import { createClient, createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendReminderEmail } from "@/services/delivery/email/send-reminder-email";
import { getTemplate } from "@/services/delivery/email/get-template";
import { createWhatsAppLink } from "@/services/delivery/whatsapp/create-link";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let email = searchParams.get("email")?.trim() || "";
  // Remove surrounding single or double quotes if any
  email = email.replace(/^["']|["']$/g, "");

  const phone = searchParams.get("phone") || "+1234567890";
  const name = searchParams.get("name") || "Nikunj";
  const message = searchParams.get("message") || "Wishing you a wonderful celebration filled with joy and success! 🎉";
  const reminderId = searchParams.get("reminder_id") || searchParams.get("reminderId") || "";

  // 1. Get active user details
  const supabase = await createClient();
  let targetUserId = "00000000-0000-0000-0000-000000000000";
  let finalEmail = email;
  let reminder: any = null;

  if (reminderId) {
    // Query the reminder from events table using service role key/admin client
    const adminSupabase = await createAdminClient();
    const { data: fetchedReminder, error: reminderError } = await adminSupabase
      .from("events")
      .select("*")
      .eq("id", reminderId)
      .single();

    if (reminderError || !fetchedReminder) {
      console.error("Failed to fetch reminder:", reminderError);
      return NextResponse.json(
        { error: `Reminder with ID ${reminderId} not found.` },
        { status: 404 }
      );
    }

    reminder = fetchedReminder;
    targetUserId = reminder.user_id;

    // Fetch user details dynamically using admin client
    const { data: userData, error: userError } = await adminSupabase.auth.admin.getUserById(targetUserId);
    if (userError || !userData?.user) {
      console.error("Failed to fetch user by ID:", userError);
      return NextResponse.json(
        { error: `Failed to fetch dynamic user for user_id ${targetUserId}.` },
        { status: 500 }
      );
    }
    
    finalEmail = userData.user.email || "";
  } else {
    // If no reminder_id is provided, default to currently authenticated user session
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      targetUserId = user.id;
      finalEmail = user.email || email;
    }
  }

  // Ensure email matches valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!finalEmail || !emailRegex.test(finalEmail)) {
    return NextResponse.json(
      { error: "Invalid or missing 'email' parameter. Please provide a valid email format (e.g. 'user@example.com')." },
      { status: 400 }
    );
  }

  const dummyReminderId = reminderId || uuidv4();

  // 2. Generate WhatsApp link
  const whatsappLink = createWhatsAppLink(phone, message);

  // 3. Render HTML
  const typeParam = searchParams.get("type") || searchParams.get("eventType");
  const eventType = typeParam || (reminder ? reminder.occasion_type : "birthday");

  const template = getTemplate(eventType);
  const emailContent = template({
    personName: name,
    message,
    whatsappLink,
  });

  try {
    // 4. Send email
    const { data: resData, error: sendError } = await sendReminderEmail({
      to: finalEmail,
      subject: emailContent.subject,
      html: emailContent.html,
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
      message: `Test email successfully dispatched to ${finalEmail}`,
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

