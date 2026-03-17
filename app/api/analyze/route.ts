import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { profileText } = await request.json();

    if (!profileText || profileText.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide valid LinkedIn profile text' },
        { status: 400 }
      );
    }

    const message = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `You are an elite LinkedIn profile strategist and recruiter. You evaluate profiles based on what ACTUALLY matters to employers and hiring managers: clarity of expertise, demonstrated accomplishments, professional presence, and career clarity.

Profile to analyze:
${profileText}

SCORING METHODOLOGY (0-100):
Your score should reflect: Does this profile effectively communicate expertise, accomplishments, and professional value?

SCORING TIERS:
- 85-100 (Excellent): Clear expertise + strong accomplishments + professional presence + specific value proposition
- 75-84 (Very Good): Good experience + clear skills + professional tone + mostly well-articulated
- 65-74 (Good): Solid experience + decent presentation + some clarity but could be stronger
- 55-64 (Fair): Basic experience + some professional presentation + needs clarity improvements
- Below 55: Needs significant work

SCORING FACTORS (Weight them by importance to employers):
1. Career Clarity (25%) - Is it IMMEDIATELY clear what role/expertise they have? Are goals/focus obvious?
2. Accomplishments & Results (25%) - Do they demonstrate impact, achievements, metrics, real projects?
3. Professional Presentation (20%) - Is the profile well-written, clear, polished, error-free?
4. Relevant Skills & Experience (20%) - Do they have substantive, relevant experience in their field?
5. Authenticity & Personality (10%) - Does the profile feel genuine and personable, not generic?

HEADLINE TIPS (Major Trust Signal):
✅ Best: Title/Role | Key Skills | Clear Intent
✅ Good: Experience Level + Role + Skills
❌ Poor: Generic phrases like "passionate" or "hardworking"

Provide your response in this EXACT format (DO NOT DEVIATE):

PROFILE_SCORE: [EXACT NUMBER 0-100, no text after]

SCORE BREAKDOWN:
- Career Clarity: [Score 0-100 with reasoning]
- Accomplishments & Results: [Score 0-100 with reasoning]
- Professional Presentation: [Score 0-100 with reasoning]
- Relevant Skills & Experience: [Score 0-100 with reasoning]
- Authenticity & Personality: [Score 0-100 with reasoning]

CHECKLIST:
✅ or ❌ Headline clearly communicates role/expertise
✅ or ❌ About section shows personality + career focus
✅ or ❌ Experience section includes measurable results/impact
✅ or ❌ Skills are relevant + demonstrate actual expertise
✅ or ❌ Professional tone + no spelling/grammar errors
✅ or ❌ Clear target role or career direction
✅ or ❌ Demonstrates actual projects or accomplishments
✅ or ❌ Profile feels authentic, not generic
✅ or ❌ Photo is professional + presents well

WHAT'S WORKING WELL:
1. [Specific strength - what employers will notice]
2. [Specific strength - what differentiates them]
3. [Specific strength - what helps their chances]

TOP IMPROVEMENTS:
1. [High-impact change with specific example]
2. [High-impact change with specific example]
3. [High-impact change with specific example]

QUICK WINS (Implement Now):
[IF PROFILE IS 85+: Write "Good job! This profile is excellent. Keep it updated and you're all set!"]
[IF PROFILE IS 75-84: Write 2-3 quick, easy improvements]
[IF PROFILE IS BELOW 75: Write 3 quick fixes that have high impact]

OVERALL ASSESSMENT:
[2-3 sentences: Overall impression + biggest asset + main opportunity. Be honest but encouraging.]`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1500,
      temperature: 0,
      top_p: 0,
    });

    const content = message.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    return NextResponse.json({
      analysis: content,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Analysis error:', errorMessage);
    console.error('GROQ_API_KEY set?', !!process.env.GROQ_API_KEY);
    console.error('Full error:', error);
    return NextResponse.json(
      { error: `Failed to analyze profile: ${errorMessage}` },
      { status: 500 }
    );
  }
}
