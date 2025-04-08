import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { message, userInput } = await req.json();
    const input = message || userInput;

    console.log("Received input:", input);

    if (!input || typeof input !== "string") {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
    }

    const prompt = `${input}\n\nReturn either 'node' or 'react' based on what you think this project should be. Only return a single word: either 'node' or 'react'. Do not return anything extra.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().toLowerCase();

    console.log("Gemini response:", text);

    if (text === "react") {
      return NextResponse.json({
        prompts: [
          "BASE_PROMPT",
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\nreactBasePrompt\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: ["reactBasePrompt"],
      });
    }

    if (text === "node") {
      return NextResponse.json({
        prompts: [
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\nnodeBasePrompt\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: ["nodeBasePrompt"],
      });
    }

    return NextResponse.json({ error: "Invalid response from Gemini" }, { status: 400 });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
