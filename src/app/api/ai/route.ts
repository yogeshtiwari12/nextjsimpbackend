import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
    try {
        let { link, projectType = "completed", todayFeature } = await request.json();

        if (!link && projectType !== "working") {
            return Response.json({
                error: "link is required for completed projects. For ongoing projects, set projectType: 'working' and provide todayFeature.",
                status: 400
            });
        }
        

        const cleanLink = link ? link.trim() : null;

        const basePrompt = `
You are a developer sharing ${projectType === "working" ? "daily progress" : "a completed project"}.

${cleanLink ? `Project: ${cleanLink}` : ""}
${todayFeature ? `Today's Feature: ${todayFeature}` : ""}

CRITICAL POST QUALITY RULES:
1. AVOID REPETITION - Each post must have unique angle and content
2. ENGAGING HOOKS - Start with curiosity, excitement, or problem-solving
3. MIX TECHNICAL & BENEFITS - Balance code details with user value
4. STRATEGIC HASHTAGS - Use specific, relevant tags, avoid generic ones
5. NATURAL EMOJIS - Use 1-2 emojis max, placed strategically
6. CONVERSATIONAL - Sound like a real developer sharing naturally

${projectType === "working" ? `
WORKING PROJECT FOCUS:
- Progress excitement and challenges
- Learning moments and solutions
- Next steps teasers
- Build-in-public vibe` : `
COMPLETED PROJECT FOCUS:
- Problem solved and impact
- Technical achievements
- User benefits and features
- Launch excitement`}

PLATFORM SPECIFICS:
Twitter: 300-350 chars, 2-3 specific hashtags, punchy hooks
LinkedIn: 300-350 chars, 3-5 professional hashtags, insights & questions
Instagram: 300-350 chars, 4-7 engaging hashtags, emoji-friendly

Return ONLY valid JSON:
{
  "twitter": [
    { "category": "string", "text": "string with link" }
  ],
  "linkedin": [
    { "category": "string", "text": "string with link" }
  ],
  "instagram": [
    { "category": "string", "text": "string with link" }
  ]
}

Ensure each platform has 2-3 unique posts with different angles.
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
            error: "Failed to generate posts", 
            status: 503 
        });
    }
}