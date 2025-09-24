import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv'

dotenv.config()
const client = new GoogleGenAI({})

export default async function aiScoreLead(lead: any, offer: any) {
    const prompt = `
    You are a B2B sales assistant.
    
    Product offer:
    ${JSON.stringify(offer)}

    Lead:
    ${JSON.stringify(lead)}

    Task:
    Classify buying intent as High, Medium, or Low and explain in 1 - 2 short sentences.
    Return ONLY a single, raw JSON object. DO NOT include ANY text, markdown formatting (like triple backticks), or conversational filler outside of the JSON object itself.
    The values for 'intent' and 'explanation' must be contained on a single line.
    JSON schema: {"intent" : "High|Medium|Low", "explanation":"..."}
    `;

    try {
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                temperature: 0,
                maxOutputTokens: 500,
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        intent: {
                            type: "string",
                            description: "The classified buying intent, must be High, Medium, or Low."
                        },
                        explanation: {
                            type: "string",
                            description: "A 1-2 sentence explanation for the intent."
                        }
                    },
                    required: ["intent", "explanation"]
                }
            }
        })

        let text = response.text!.trim();
        text = text.replace(/```json\s*/i, '').replace(/\s*```/g, '');
        text = text.trim();
        const jsonMatch = text.match(/{[\s\S]*}/);
        if (!jsonMatch) {
            console.error("No valid JSON object found in response text: ", text);
            throw new Error("Model response was not valid JSON object");
        }
        const jsonString = jsonMatch[0];
        const cleanJsonString = jsonString.replace(/[\n\t]/g, ' ');
        const aiResult = JSON.parse(cleanJsonString);
        // const aiResult = JSON.parse(text);

        let aiPoints = 0;
        if (aiResult.intent === "High") aiPoints = 50;
        else if (aiResult.intent === "Medium") aiPoints = 30;
        else aiPoints = 10;

        return { aiPoints, aiIntent: aiResult.intent, aiExplanation: aiResult.explanation };
    } catch (err) {
        console.error("Gemini API call failed or JSON parsing error: ", err);
        return { aiPoints: 10, aiIntent: "Low", aiExplanation: "AI call failed" }
    }
}