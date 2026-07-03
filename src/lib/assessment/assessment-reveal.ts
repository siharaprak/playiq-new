/**
 * Module 0 — Reveal Personalization Logic
 *
 * Rule set that selects which Orion script variants to display
 * based on diagnostic responses. Also generates the AI-powered
 * personalized summary for Part A of The Reveal.
 */

import { GoogleGenAI } from '@google/genai';

function getGeminiClient() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is missing from environment variables.');
  return new GoogleGenAI({ apiKey });
}

// ── Types ───────────────────────────────────────────────────────────────────

export interface AssessmentProfile {
  display_name: string;
  explanation_style: string;     // 'verbal' | 'analytical' | 'visual'
  pacing_preference: string;     // 'sequential' | 'top_down'
  challenge_response: string;    // 'push_through' | 'ask_help' | 'take_break'
  ai_literacy_level: string;     // 'answer_seeking' | 'explanation_seeking' | 'not_using' | 'power_user'
  motivation_driver: string;     // 'mastery' | 'competitive' | 'purpose' | 'identity'
  rescue_target_subject: string;
  advance_target_subject: string;
  personal_goal: string;
  baseline_task1_correct: boolean;
}

// ── Learning Style Labels (human-readable) ──────────────────────────────────

export const STYLE_LABELS: Record<string, Record<string, string>> = {
  explanation_style: {
    verbal: 'Verbal / Story-Based',
    analytical: 'Analytical / Step-by-Step',
    visual: 'Visual / Big-Picture First',
  },
  pacing_preference: {
    sequential: 'Sequential — master each part before moving on',
    top_down: 'Big-Picture First — overview then details',
  },
  challenge_response: {
    push_through: 'Persistent — pushes through challenges independently',
    ask_help: 'Collaborative — seeks help quickly when stuck',
    take_break: 'Reflective — steps away and returns with fresh eyes',
  },
  ai_literacy_level: {
    answer_seeking: 'Answer-seeking — high dependency risk',
    explanation_seeking: 'Explanation-seeking — healthy curiosity',
    not_using: 'Not using AI yet — blank slate',
    power_user: 'Power user — advanced but may need integrity guardrails',
  },
  motivation_driver: {
    mastery: 'Seeing measurable improvement',
    competitive: 'Being ahead of other students',
    purpose: 'Building real-world skills',
    identity: 'Leveling up and earning recognition',
  },
};

export function getStyleLabel(category: string, value: string): string {
  return STYLE_LABELS[category]?.[value] ?? value;
}

// ── Vision Outcomes (selected by motivation driver) ─────────────────────────

const VISION_OUTCOMES: Record<string, string[]> = {
  mastery: [
    'You can learn to understand anything — not just memorize it — and explain it better than most adults can.',
    'You can walk into any class ahead of what the teacher is about to teach — and actually feel that.',
    'You can track your own growth with real numbers — and watch yourself get sharper every single week.',
  ],
  competitive: [
    'You can walk into any class ahead of what the teacher is about to teach — and actually feel that.',
    'You can think like an entrepreneur — spot problems, build solutions, and understand how value actually gets created.',
    'You can build skills that put you years ahead of other students who are just memorizing and forgetting.',
  ],
  purpose: [
    'You can build your own AI tools — custom study assistants, research agents, systems that work for your specific brain. Not someday. In this program.',
    'You can think like an entrepreneur — spot problems, build solutions, and understand how value actually gets created.',
    'You can learn to understand anything — not just memorize it — and explain it better than most adults can.',
  ],
  identity: [
    'You can build your own AI tools — custom study assistants, research agents, systems that work for your specific brain. Not someday. In this program.',
    'You can walk into any class ahead of what the teacher is about to teach — and actually feel that.',
    'You can think like an entrepreneur — spot problems, build solutions, and understand how value actually gets created.',
  ],
};

export function getVisionOutcomes(motivationDriver: string): string[] {
  return VISION_OUTCOMES[motivationDriver] ?? VISION_OUTCOMES.mastery;
}

// ── Personalized Reveal Summary (AI-generated) ─────────────────────────────

export async function generateRevealSummary(profile: AssessmentProfile): Promise<string> {
  try {
    const ai = getGeminiClient();

    const systemInstruction = `You are Orion, the AI mentor inside PlayIQ — a learning platform for teenagers.

You just completed an assessment with a new apprentice. Based on their responses, you need to deliver a SHORT, SPECIFIC, EMOTIONALLY RESONANT preview of what you can do for them.

CRITICAL RULES:
1. Speak directly to the apprentice in second person ("you").
2. Reference their ACTUAL responses — their learning style, what they struggle with, how they use AI.
3. Keep it to 3-4 short paragraphs. Each paragraph should be 1-2 sentences max.
4. Tone: warm, direct, slightly surprising. Never clinical. Never robotic. Never salesy.
5. Do NOT list features. Do NOT sound like a product pitch.
6. Make the apprentice think: "This is actually about me."
7. If they have high AI dependency (answer_seeking), gently acknowledge it and reframe it.
8. End with a forward-looking statement about starting with their rescue target subject.

Here is an example of the right tone and structure:
"You think in big pictures first — and that's actually an advantage. You just haven't been taught how to use it."
"Right now you're using AI to get answers. That feels helpful — but it's actually slowing you down. I'm going to fix that."
"We're going to start with [subject] — because that's where you told me you need it most. And I'm going to teach you in the way your brain actually processes information, not the way most classrooms do."`;

    const userContext = `Apprentice Profile:
- Name: ${profile.display_name}
- Learning style: ${profile.explanation_style} (${getStyleLabel('explanation_style', profile.explanation_style)})
- Pacing: ${profile.pacing_preference} (${getStyleLabel('pacing_preference', profile.pacing_preference)})
- Challenge response: ${profile.challenge_response} (${getStyleLabel('challenge_response', profile.challenge_response)})
- Current AI use: ${profile.ai_literacy_level} (${getStyleLabel('ai_literacy_level', profile.ai_literacy_level)})
- Motivation: ${profile.motivation_driver} (${getStyleLabel('motivation_driver', profile.motivation_driver)})
- Subject they're struggling in: ${profile.rescue_target_subject}
- Subject they want to advance in: ${profile.advance_target_subject}
- Personal goal: "${profile.personal_goal}"
- AI verification instinct: ${profile.baseline_task1_correct ? 'Correctly identified the wrong AI answer' : 'Trusted the confidently wrong AI answer'}

Generate the personalized reveal summary.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userContext,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 400,
      },
    });

    return response.text || getFallbackReveal(profile);
  } catch (err) {
    console.error('Reveal generation error:', err);
    return getFallbackReveal(profile);
  }
}

// ── Fallback (no AI) ────────────────────────────────────────────────────────

function getFallbackReveal(profile: AssessmentProfile): string {
  const styleDesc =
    profile.explanation_style === 'visual'
      ? 'You think in big pictures first — and that\'s actually an advantage.'
      : profile.explanation_style === 'analytical'
        ? 'You like things step by step — and that precision is a strength.'
        : 'You learn best through stories and explanations — and we\'re going to use that.';

  const aiDesc =
    profile.ai_literacy_level === 'answer_seeking'
      ? 'Right now you\'re using AI to get answers. That feels helpful — but it\'s actually slowing you down. I\'m going to fix that.'
      : profile.ai_literacy_level === 'not_using'
        ? 'You haven\'t really used AI for school yet — and honestly, that might be an advantage. You don\'t have bad habits to unlearn.'
        : 'You already use AI for learning — now let\'s make sure you\'re using it in a way that actually makes you smarter.';

  const subjectLine = profile.rescue_target_subject
    ? `We're going to start with ${profile.rescue_target_subject} — because that's where you told me you need it most. And I'm going to teach you in the way your brain actually processes information, not the way most classrooms do.`
    : 'We\'re going to start with the subjects where you need it most — taught in the way your brain actually works.';

  return `${styleDesc}\n\n${aiDesc}\n\n${subjectLine}`;
}

// ── Build Learning Blueprint Object ─────────────────────────────────────────

export interface LearningBlueprintData {
  explanationStyle: string;
  explanationStyleLabel: string;
  primaryMotivation: string;
  primaryMotivationLabel: string;
  currentAIUse: string;
  currentAIUseLabel: string;
  rescueTarget: string;
  advanceTarget: string;
  baselinePDI: string;
  personalGoal: string;
}

export function buildLearningBlueprint(profile: AssessmentProfile): LearningBlueprintData {
  return {
    explanationStyle: profile.explanation_style,
    explanationStyleLabel: getStyleLabel('explanation_style', profile.explanation_style),
    primaryMotivation: profile.motivation_driver,
    primaryMotivationLabel: getStyleLabel('motivation_driver', profile.motivation_driver),
    currentAIUse: profile.ai_literacy_level,
    currentAIUseLabel: getStyleLabel('ai_literacy_level', profile.ai_literacy_level),
    rescueTarget: profile.rescue_target_subject || 'Not specified',
    advanceTarget: profile.advance_target_subject || 'Not specified',
    baselinePDI: 'Recorded — visible after Module 3',
    personalGoal: profile.personal_goal || 'Not specified',
  };
}
