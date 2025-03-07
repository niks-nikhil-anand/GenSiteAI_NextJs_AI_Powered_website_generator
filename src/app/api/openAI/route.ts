import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("Received a request");

    // Parse the request body
    const { message } = await req.json();
    console.log("Parsed request body:", message);

    // Initialize the OpenAI client
    const client = new OpenAI({
      baseURL: "https://models.inference.ai.azure.com",
      apiKey: process.env.OPEN_AI_API_KEYS,
    });

    console.log("OpenAI client initialized");

    // Generate a response using the OpenAI API
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

    // Log the entire response object for debugging
    console.log("OpenAI response object:", JSON.stringify(response, null, 2));

    // Create a readable stream for the response
    const stream = new ReadableStream({
      async start(controller) {
        // Log each chunk of the stream
        for await (const chunk of response) {
          console.log("Stream chunk:", JSON.stringify(chunk, null, 2));
          const text = chunk.choices[0]?.delta?.content || "";
          console.log("Streaming text:", text);
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
        console.log("Stream closed");
      },
    });

    // Return the stream as the response
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}