import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch('https://quizzical-cohen-angry.lemme.cloud/api/99532368-3fcd-48ea-8aeb-73a42b293026', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();

    return NextResponse.json({ study_plan: result });
  } catch (error) {
    console.error('Error fetching study plan:', error);
    return NextResponse.json({ error: 'Failed to generate study plan' }, { status: 500 });
  }
}
