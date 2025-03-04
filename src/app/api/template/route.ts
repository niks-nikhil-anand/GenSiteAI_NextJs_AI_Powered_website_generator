import OpenAI from "openai";
import { NextResponse } from "next/server";
import { basePrompt as nodeBasePrompt } from "../../../utils/default/node";
import { basePrompt as reactBasePrompt } from "../../../utils/default/react";
import { BASE_PROMPT, getSystemPrompt } from "../../../utils/prompt";

export async function POST(req: Request) {
  try {
    console.log("Received a request");

    const { message } = await req.json();
    console.log("Parsed request body:", message);

    if (!message || typeof message !== "string") {
      console.error("Invalid message format:", message);
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      baseURL: process.env.OPENAI_BASE_URL, // Ensure the env variable is correct
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log("OpenAI client initialized");

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an AI assistant." },
        { role: "user", content: message },
        {
          role: "system",
          content:
            "Return either 'node' or 'react' based on what you think this project should be. Only return a single word: either 'node' or 'react'. Do not return anything extra.",
        },
      ],
      temperature: 1,
      max_tokens: 100,
      top_p: 1,
    });

    console.log("OpenAI response received:", response);

    if (!response || !response.choices || response.choices.length === 0) {
      console.error("Invalid response from OpenAI:", response);
      return NextResponse.json(
        { error: "Invalid response from AI" },
        { status: 400 }
      );
    }

    const answer = response.choices[0]?.message?.content?.trim().toLowerCase();
    console.log("Parsed AI response:", answer);

    if (answer === "react") {
      console.log("Detected React project");
      return NextResponse.json({
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [reactBasePrompt],
      });
    }

    if (answer === "node") {
      console.log("Detected Node.js project");
      return NextResponse.json({
        prompts: [
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [nodeBasePrompt],
      });
    }

    console.warn("Unexpected AI response:", answer);
    return NextResponse.json(
      { error: "Invalid response from AI" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
