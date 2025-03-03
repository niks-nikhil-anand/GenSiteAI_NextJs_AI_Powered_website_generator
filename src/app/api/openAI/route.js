import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json(); // Parse JSON request body

    const client = new OpenAI({
      baseURL: "https://models.inference.ai.azure.com",
      apiKey: process.env.OPEN_AI_API_KEYS, // Store token in .env.local
    });

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are an AI assistant." },
        { role: "user", content: message },
      ],
      model: "gpt-4o",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
    });

    return NextResponse.json({ response: response.choices[0].message.content }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
