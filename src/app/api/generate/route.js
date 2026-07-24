import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { AIService } from "@/lib/services/ai";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { cardId, userPrompt } = body;

    if (!cardId) {
      return new NextResponse("Card ID is required", { status: 400 });
    }

    const headerApiKey = req.headers.get("x-custom-api-key");
    const customApiKey = headerApiKey || body.customApiKey || session.user.customApiKey || null;

    const requestId = await AIService.generateCardHTML(session.user.id, cardId, userPrompt, customApiKey);

    return NextResponse.json({ requestId });
  } catch (error) {
    console.error("[GENERATE_CARD]", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}
