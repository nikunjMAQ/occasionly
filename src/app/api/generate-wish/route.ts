import { NextResponse } from "next/server";
import { generateWish } from "@/services/ai-service";

export async function POST(
  request: Request
) {
  const body =
    await request.json();

  const wish =
    await generateWish(
      body
    );

  return NextResponse.json({
    wish,
  });
}
