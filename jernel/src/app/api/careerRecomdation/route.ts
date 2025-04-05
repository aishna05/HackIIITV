
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    console.log('Request received');
    const { entry } = await req.json()

    const prompt = `
You are a career guidance assistant.

Analyze the following journal entry written by a student. Your task is to:
- Summarize the core emotions, goals, and interests expressed.
- Identify the user’s emotional state (e.g., inspired, frustrated, curious).
- Highlight any hidden passions or recurring themes.
- Infer potential skills or inclinations from the tone or content.
- Based on this analysis, recommend a realistic and fulfilling career path.
- Also suggest at least 3 related fields or domains the user may enjoy.

**Journal Entry**:
"${entry}"

Respond strictly in the following JSON format:

{
  "summary": "Short summary of user's journal entry.",
  "mood": "Inferred emotional state of the user.",
  "career_recommendation": "One clear and motivational career suggestion.",
  "related_fields": [
    "Field 1",
    "Field 2",
    "Field 3"
  ],
  "justification": "Explain briefly why this career path is a good fit for the user."
`;

    const lemmaResponse = await fetch('https://quizzical-cohen-angry.lemme.cloud/api/5f9a97a4-e263-4d49-a69e-02fc65406b1f', {
      method: 'POST',
      headers: {
        
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
       
        entry:prompt,
      }),
    })

    const result = await lemmaResponse.json()
    console.log('=======>:', result);

   

    return NextResponse.json({
      summary: result, })

    } catch (error: any) {
        
        console.error('Error processing request:', error.message)
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 })
        }
  }
    
