import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { text } = reqBody;
    const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Act as a resume reviewer and provide feedback on the following resume: ${text} .
    please provide:
    1. A summary of the resume in 20 words'.
    2. Strengths and weaknesses.
    3. Suggestions for improvement.
    4. ATS score out of 100.
    5. ALL links in the resume.
    7. A score out of 100 for the resume.

    Format the response in a clear json format, organized way
    `;

    const response = await model.generateContent(prompt as string);
    //@ts-ignore
    const aiResponseText = response.response.candidates[0].content.parts[0].text;

    return NextResponse.json({ response: aiResponseText });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}