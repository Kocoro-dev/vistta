import { NextRequest, NextResponse } from "next/server";
import { sendDiscordNotification, isDiscordConfigured } from "@/lib/discord";
import type { NotifyPayload } from "@/types/attribution";

export async function POST(request: NextRequest) {
  try {
    const payload: NotifyPayload = await request.json();
    const result = await sendDiscordNotification(payload);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send notification" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notify API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    webhook_configured: isDiscordConfigured(),
  });
}
