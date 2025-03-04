import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    console.log("Received a request");

    const { message } = await req.json();
    console.log("Parsed request body:", message);

    const client = new OpenAI({
      baseURL: "https://models.inference.ai.azure.com",
      apiKey: process.env.OPEN_AI_API_KEYS,
    });

    console.log("OpenAI client initialized");

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are an AI assistant." },
        { role: "user", content: message },
      ],
      model: "gpt-4o",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
      stream: true, // Enable streaming
    });

    console.log("OpenAI response received:", response);

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || "";
          console.log("Streaming chunk:", text);
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
        console.log("Stream closed");
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error:any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
