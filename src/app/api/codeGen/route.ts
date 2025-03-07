import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getSystemPrompt } from "../../../utils/prompt";

export async function POST(req: Request) {
  try {
    console.log("Received a request at /codeGen");

    // Parse the request body to extract `prompts` (or `messages`)
    const { prompts } = await req.json();

    // Check if prompts is provided and is an array
    if (!Array.isArray(prompts)) {
      console.error("Invalid or missing prompts in request");
      return NextResponse.json(
        { error: "Invalid or missing prompts" },
        { status: 400 }
      );
    }

    // Initialize the OpenAI client
    const client = new OpenAI({
        baseURL: "https://models.inference.ai.azure.com",
        apiKey: process.env.OPENAI_API_KEY, // Ensure the environment variable is correctly named
    });

    console.log("OpenAI client initialized");

    // Generate a response using the OpenAI API
    const response = await client.chat.completions.create({
      model: "gpt-4o", // Use the correct model name
      messages: [
        { role: "system", content: getSystemPrompt() }, // Use the system prompt
        { role: "user", content: prompts.join("\n") }, // Combine prompts into a single message
      ],
      temperature: 1,
      max_tokens: 100,
      top_p: 1,
    });

    // Extract the AI's response
    const aiResponse = response.choices[0]?.message?.content;

    if (!aiResponse) {
      console.error("Invalid response from AI");
      return NextResponse.json(
        { error: "Invalid response from AI" },
        { status: 400 }
      );
    }

    console.log("AI response generated successfully");

    // Return the AI's response
    return NextResponse.json({ response: aiResponse }, { status: 200 });
  } catch (error: any) {
    console.error("Error occurred in /codeGen:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}