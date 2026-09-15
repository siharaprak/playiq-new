import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value.trim();
  }
});

const apiKey = env.GOOGLE_GENERATIVE_AI_API_KEY || env.GEMINI_API_KEY;
console.log('Gemini API Key exists:', !!apiKey);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function testEvaluation() {
  console.log('Testing Gemini evaluation with sample scenarios...');
  const scenarios = [
    {
      label: 'Superpower',
      nextMode: 'Superpower',
      question: 'Using AI to quiz myself on concepts strengthens my memory retrieval and identifies knowledge gaps.',
      verification: 'Ask the AI to generate practice questions and explain any wrong answers.'
    },
    {
      label: 'Superweapon Against You',
      nextMode: 'Superweapon Against You',
      question: 'Copy-pasting an essay prompt and having AI write the whole essay degrades my own writing and critical thinking.',
      verification: 'Write my own outline and draft first, using AI only for grammar feedback.'
    },
    {
      label: 'Superpower',
      nextMode: 'Superpower',
      question: 'Asking AI for step-by-step analogies helps me understand complex math theorems.',
      verification: 'Verify each step manually and solve a similar problem on my own.'
    },
    {
      label: 'Superweapon Against You',
      nextMode: 'Superweapon Against You',
      question: 'Blindly trusting AI output without fact-checking can lead to spreading hallucinations.',
      verification: 'Cross-reference facts with reputable textbooks or source documents.'
    },
    {
      label: 'Superpower',
      nextMode: 'Superpower',
      question: 'Creating personalized flashcards with AI saves formatting time while keeping study focus high.',
      verification: 'Review each flashcard for accuracy before studying.'
    },
    {
      label: 'Superweapon Against You',
      nextMode: 'Superweapon Against You',
      question: 'Letting AI solve all homework problems replaces actual learning with false confidence.',
      verification: 'Attempt all problems first and only ask AI for hints when stuck.'
    }
  ];

  const ai = new GoogleGenAI({ apiKey });
  const scenarioCount = scenarios.length;
  const systemInstruction = `
You are the PlayIQ AI Engine assessing a student's Boss Battle performance.
The student evaluated ${scenarioCount} scenarios about responsible technology and AI use. For each scenario, they provided:
1. A Label classifying the scenario (e.g., Superpower vs Superweapon, Useful vs Risky vs Wrong, etc.)
2. An explanation of why they chose that label
3. A suggested next action or highest-path response

Analyze their inputs holistically. Award 1 point for every fundamentally correct overarching scenario understanding. Max score is ${scenarioCount}.
We are looking for: do they understand when technology helps vs hurts growth? Do they know not to trust AI blindly? Do they choose the highest-path response?

Return a raw JSON object and nothing else.
Format:
{
  "score": number, // an integer from 0 to ${scenarioCount}
  "feedback": "Targeted feedback on their performance.",
  "fingerprints": {
    "explanationPreference": "Short description (e.g., 'Visual metaphors', 'Direct bullet points')",
    "modePreference": "Short description (e.g., 'Socratic Coach', 'Direct Answers')",
    "shortcutTendency": "Short description (e.g., 'Low - Prefers step-by-step', 'High - Seeks quick answers')",
    "integritySnapshot": "Short description (e.g., 'Strong Verification Habit', 'Trusts AI too quickly')"
  }
}`;

  const contents = `Student Boss Battle Data:\n${JSON.stringify(scenarios, null, 2)}\n\nEvaluate and return JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      temperature: 0.1,
    }
  });

  console.log('Gemini Response:');
  let cleanJson = response.text || '';
  if (cleanJson.startsWith('```json')) {
    cleanJson = cleanJson.replace(/```json/g, '').replace(/```/g, '').trim();
  }
  const evalResult = JSON.parse(cleanJson);
  console.log(JSON.stringify(evalResult, null, 2));

  const reflection1 = 'I learned that using AI as a cognitive amplifier requires active verification rather than passive consumption.';
  const reflection2 = 'My biggest vulnerability is wanting quick solutions when fatigued, which I will combat using the 3-step verification ritual.';
  const reflection3 = 'I will always write my initial thoughts down before querying AI for synthesis or critique.';

  const reflectionScore = [reflection1, reflection2, reflection3].filter(r => r && r.length > 20).length;
  const totalScore = evalResult.score + reflectionScore;
  console.log(`\nScores: AI Score = ${evalResult.score}, Reflection Score = ${reflectionScore}, Total = ${totalScore} (Passing threshold: 4)`);

  const studentId = '37c74b67-86b6-4dab-abdf-84fd244ab418'; // Lucas
  const moduleId = 'fe87ea18-8042-43e6-9cc3-da9117590809'; // Module 3

  console.log('\nInserting successful submission into database for Lucas...');
  const { data: bossSubmission, error: subErr } = await supabase.from('assessment_submissions').insert({
    student_id: studentId,
    module_id: moduleId,
    assessment_type: 'boss_battle',
    submission_payload: { scenarios, reflections: { reflection1, reflection2, reflection3 }, geminiFeedback: evalResult.feedback },
    score_numeric: totalScore,
    pass_status: totalScore >= 4 ? 'pass' : 'revise'
  }).select().single();

  if (subErr) {
    console.error('Error recording boss battle submission:', subErr);
  } else {
    console.log('Successfully recorded Boss Battle assessment:', bossSubmission.id, bossSubmission.pass_status);
  }

  // Also test fingerprint insertion
  if (evalResult.fingerprints && bossSubmission) {
    const signals = [
      { student_id: studentId, module_id: moduleId, signal_type: 'explanation_preference', signal_value: evalResult.fingerprints.explanationPreference },
      { student_id: studentId, module_id: moduleId, signal_type: 'mode_preference', signal_value: evalResult.fingerprints.modePreference },
      { student_id: studentId, module_id: moduleId, signal_type: 'shortcut_tendency', signal_value: evalResult.fingerprints.shortcutTendency },
      { student_id: studentId, module_id: moduleId, signal_type: 'integrity_snapshot', signal_value: evalResult.fingerprints.integritySnapshot },
    ];
    const { error: sigErr } = await supabase.from('fingerprint_signals').insert(signals);
    if (sigErr) {
      console.error('Fingerprint insert error:', sigErr);
    } else {
      console.log('Successfully saved fingerprint signals for Lucas!');
    }
  }
}

testEvaluation().catch(console.error);
