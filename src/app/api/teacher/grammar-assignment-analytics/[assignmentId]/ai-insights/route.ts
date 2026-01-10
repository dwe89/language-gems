import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(
    request: NextRequest,
    { params }: { params: { assignmentId: string } }
) {
    try {
        const body = await request.json();
        const { assignmentTitle, completionStats, accuracyStats, commonMistakes } = body;

        if (!assignmentTitle) {
            return NextResponse.json(
                { error: 'Missing assignment data' },
                { status: 400 }
            );
        }

        // Construct the prompt
        const mistakesText = commonMistakes && commonMistakes.length > 0
            ? commonMistakes.map((m: any) =>
                `- "${m.question}" (${m.type}): ${m.incorrect_count} failures`
            ).join('\n')
            : "No specific common mistakes detected.";

        const prompt = `
You are an expert language teacher assistant.
Analyze the following class performance data for the grammar assignment "${assignmentTitle}".

Stats:
- Average Practice Accuracy: ${Math.round(accuracyStats.average_practice_accuracy)}%
- Average Test Accuracy: ${Math.round(accuracyStats.average_test_accuracy)}%
- Tests Completed: ${completionStats.tests_completed}
- Fully Mastered: ${completionStats.fully_mastered}

Top Common Mistakes:
${mistakesText}

Task:
Provide a concise code-breaking insight for the teacher (max 3 sentences).
Focus on identifying *why* students might be making these specific mistakes and suggest one quick teaching intervention or review strategy.
Do not just repeat the stats. Be encouraging but analytical.
`;

        // Call OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-nano", // Use a fast, capable model
            messages: [
                { role: "system", content: "You are a helpful pedagogical expert." },
                { role: "user", content: prompt }
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        const insight = completion.choices[0].message.content?.trim() ||
            "Unable to generate insights at this time. Please try again later.";

        return NextResponse.json({ insight });

    } catch (error) {
        console.error('Error generating AI insights:', error);
        return NextResponse.json(
            { error: 'Failed to generate insights' },
            { status: 500 }
        );
    }
}
