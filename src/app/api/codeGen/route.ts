import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemPrompt } from "../../../utils/prompt";

export async function POST(req: Request) {
  try {
    console.log("🔧 Received a request at /codeGen");

    const body = await req.json();
    const { prompts, uiPrompts } = body;

    console.log("📥 Received user prompts:");
    console.log("📥 Received UI prompts:");

    if (!Array.isArray(prompts) || !Array.isArray(uiPrompts)) {
      console.error("❌ Invalid or missing prompts/uiPrompts");
      return NextResponse.json(
        { error: "Invalid or missing prompts/uiPrompts" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("❌ Missing Gemini API key");
      return NextResponse.json(
        { error: "Missing Gemini API key" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // Create structured full prompt
    const basePrompt = `
==== 🧠 System Prompt ====
${getSystemPrompt()}
==== 📦 Base Prompt ====
This request contains structured prompt parts to help you understand the context of the user's request.
`;

    const formattedUiPrompts = uiPrompts.map((p, i) => `💡 UI Prompt ${i + 1}: ${p}`).join("\n");
    const formattedUserPrompts = prompts.map((p, i) => `🧑‍💻 User Prompt ${i + 1}: ${p}`).join("\n");

    const fullPrompt = [
      basePrompt,
      formattedUiPrompts,
      formattedUserPrompts,
    ].join("\n\n");

    console.log("📤 Sending to Gemini:\n");

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    if (!text) {
      console.error("❌ No response from Gemini");
      return NextResponse.json(
        { error: "No response from Gemini" },
        { status: 500 }
      );
    }

    console.log("✅ Gemini response generated successfully");
    console.log("📝 Generated response text:\n", text);

    return NextResponse.json({ response: text }, { status: 200 });
  } catch (error: any) {
    console.error("💥 Error occurred in /codeGen:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
