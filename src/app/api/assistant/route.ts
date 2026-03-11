import { NextRequest, NextResponse } from "next/server";

const SYSTEM_CATEGORIES = [
  "OMS / PMS",
  "Market Data",
  "Analytics",
  "CRM / Deal Management",
  "Spreadsheets",
  "Communication",
  "File Storage",
  "Custom / Internal",
  "Other",
];

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const { mode, text, existingSystemNames } = await request.json();

  if (!text || !mode) {
    return NextResponse.json(
      { error: "Missing required fields: mode and text" },
      { status: 400 }
    );
  }

  const systemPrompt =
    mode === "system"
      ? `You are a data extraction assistant for a financial operations firm. The user will describe a system/tool used at their firm. Extract structured information and return ONLY valid JSON with these fields:
{
  "name": "string - the system/tool name",
  "category": "string - one of: ${SYSTEM_CATEGORIES.join(", ")}",
  "description": "string - a concise description of what this system does and what data it holds",
  "criticality": "string - one of: low, medium, high, critical"
}
Return ONLY the JSON object, no markdown, no explanation.`
      : `You are a data extraction assistant for a financial operations firm. The user will describe a workflow or pain point that spans multiple systems. Extract structured information and return ONLY valid JSON with these fields:
{
  "title": "string - a short descriptive title for the workflow",
  "description": "string - the full workflow description",
  "systemNames": ["array of system names mentioned or implied"],
  "category": "string - one of: workflow, pain-point"
}
The existing systems in the firm are: ${(existingSystemNames || []).join(", ") || "none yet"}.
Try to match system names to existing ones when possible. Return ONLY the JSON object, no markdown, no explanation.`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { error: `OpenAI API error: ${res.status}`, details: err },
        { status: 502 }
      );
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 502 }
      );
    }

    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json({ mode, result: parsed });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to parse AI response", details: message },
      { status: 500 }
    );
  }
}
