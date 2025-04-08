import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemPrompt } from "../../../utils/prompt";

export async function POST(req: Request) {
  try {
    console.log("Received a request at /codeGen");

    const { prompts } = await req.json();

    if (!Array.isArray(prompts)) {
      console.error("Invalid or missing prompts in request");
      return NextResponse.json({ error: "Invalid or missing prompts" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Missing Gemini API key");
      return NextResponse.json({ error: "Missing Gemini API key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Recommended model as of now
    });

    // Merge system and user prompts
    const fullPrompt = [getSystemPrompt(), ...prompts].join("\n");

    const result = await model.generateContent(fullPrompt);

    const text = result.response.text();

    if (!text) {
      console.error("No response from Gemini");
      return NextResponse.json({ error: "No response from Gemini" }, { status: 500 });
    }

    console.log("Gemini response generated successfully");
    console.log(text);

    return NextResponse.json({ response: text }, { status: 200 });
  } catch (error: any) {
    console.error("Error occurred in /codeGen:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
