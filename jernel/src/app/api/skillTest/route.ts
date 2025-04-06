// File: app/api/generate-challenges/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openaiApiKey = process.env.OPENAI_API_KEY!;

export async function POST(req: Request) {
  try {
    const { skill, level } = await req.json();

    const prompt = `Generate 10 real-world programming questions for a Level ${level} ${skill} developer. Each question should include:\n\n1. Title\n2. Scenario\n3. Problem statement\n4. Expected solution (code)\n5. Difficulty level (easy, medium, hard)`;

    const aiRes = await fetch("https://quizzical-cohen-angry.lemme.cloud/api/dbc771de-e3ee-49ea-b4ee-e022672de7eb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const aiData = await aiRes.json();
    const questionsRaw = aiData.choices[0].message.content;

    const sessionId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const { error } = await supabase.from("challenge_sessions").insert([
      {
        session_id: sessionId,
        skill,
        level,
        questions_json: questionsRaw,
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ success: true, sessionId });
  } catch (err) {
    console.error("Error generating challenge:", err);
    return NextResponse.json({ success: false, message: "Failed to generate challenges." }, { status: 500 });
  }
}
