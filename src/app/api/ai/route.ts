import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
    try {
        let { link, projectType, todayFeature } = await request.json();

        const cleanLink = link ? link.trim() : "";

        const basePrompt = `
You are a skilled software developer who writes social media posts about projects.

Your goal: Generate platform-specific posts for ${projectType ? (projectType === "working" ? "a WORK-IN-PROGRESS project" : "a COMPLETED project") : "a project"}.

${cleanLink ? `Project link: ${cleanLink}` : ""}
${todayFeature ? `Today's feature or progress: ${todayFeature}` : ""}

🚨 IMPORTANT RULES:
1. **NO BLANK FIELDS** — every platform and category must have complete, non-empty "text" and "category". If any info is missing, fill it with a plausible, relevant detail.
2. **NO REPETITION** — each post must have a unique tone, focus, or perspective.
3. **REAL DEVELOPER VOICE** — sound like a human developer sharing their genuine progress, not marketing.
4. **HOOK FIRST** — start each post with an attention-grabbing line.
5. **SHOW VALUE** — mix what you built + why it matters.
6. **LIMIT EMOJIS** — 1–2 relevant emojis max, never forced.
7. **RELEVANT HASHTAGS ONLY** — use accurate, specific tech or topic-related hashtags (no #coding, #developer, #tech in every post).
8. **NO EMPTY STRINGS OR NULL VALUES** — ensure every string has actual text. If a field is missing, fill it with a plausible value.

📘 CONTENT STYLE RULES:

If project type = "working":
- Emphasize progress, challenges, learning, and next steps.
- Add curiosity or community-building tone (build-in-public style).
- Avoid final-sounding language.

If project type = "completed":
- Focus on impact, features, problem solved, and technical achievement.
- Express excitement or value to users.
- Use clear completion or launch tone.

📱 PLATFORM WRITING RULES:

**Twitter/X**
- Length: 400–600 characters (generate more words)
- 2–3 relevant hashtags
- Natural flow, short sentences, engaging tone


**twitter**
- Length: 500–700 characters (generate more words)
- 4–7 engaging hashtags
- Friendly and casual tone with 1–2 emojis

**LinkedIn**
- Length: 500–700 characters (generate more words)
- 3–5 professional hashtags
- Slightly more descriptive and reflective
- Optionally end with a thought-provoking question

**Instagram**
- Length: 500–700 characters (generate more words)
- 4–7 engaging hashtags
- Friendly and casual tone with 1–2 emojis

🧩 OUTPUT FORMAT (STRICT JSON):
Return ONLY valid JSON — no explanations, code blocks, markdown, or commentary.
The JSON must exactly follow this structure:

{
  "twitter": [
    { "category": "string (e.g., progress update, challenge solved, feature launch)", "text": "string (post text${cleanLink ? ` including link (${cleanLink}) and hashtags` : " including hashtags"})" },
    { "category": "string", "text": "string" }
  ],
  "linkedin": [
    { "category": "string", "text": "string" },
    { "category": "string", "text": "string" }
  ],
  "instagram": [
    { "category": "string", "text": "string" },
    { "category": "string", "text": "string" }
  ]
}

⚠️ CRITICAL VALIDATION:
- Each array must have at least 2 non-empty posts.
- Each "text" must include the project link if provided.
- No fields may be empty, blank, or null. If any info is missing, fill it with a plausible, relevant detail.
- Output must be valid JSON (parseable directly by JSON.parse in JavaScript).

Generate now.
`;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
        });

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: basePrompt }] }]
        });

        const text = result.response.text();
        let parsed;

        try {
            parsed = JSON.parse(text.replace(/```json|```/g, ""));
        } catch {
            try {
                parsed = JSON.parse(text);
            } catch {
                parsed = { twitter: [], linkedin: [], instagram: [] };
            }
        }

        return Response.json({
            result: parsed,
            status: 200,
            projectType: projectType
        });

    } catch (error: any) {
        return Response.json({
            error: error || "Failed to generate posts",

            status: 503
        });
    }
}