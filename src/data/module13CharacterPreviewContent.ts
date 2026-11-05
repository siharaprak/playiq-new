export interface Module13PreviewSection {
  part: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export const MODULE_13_PREVIEW_CONTENT = {
  title: "Your Orion Character's Next Adventure",
  subtitle:
    'A short, fun possibility preview showing how your Module 1 Character Guardrail Card can grow into a future story, storyboard, or cartoon short.',
  noRequirementBanner:
    'No project, story, storyboard, cartoon, quiz, proof artifact, or Tutor upload is required to complete Module 13. You can enjoy this preview, optionally jot down a future idea, and continue straight to Module 14: Capstone — The Master Trial.',
  sections: [
    {
      part: 'Part 0',
      title: 'The 30-Second Imagination Spark',
      paragraphs: [
        'Remember the character you created in Module 1 and protected with your Character Guardrail Card (My_Character_Card_v1.md)?',
        'In Module 1, you learned how a Guardrail Card keeps your character’s three must-keep visual features and personality consistent across new scenes. In Module 3 and Module 4, you saw how that same character could appear as a Map Scout or hold up a Rescue Signal.',
        'What if, after this course, you wanted to take that character on a bigger creative adventure — like a short story, a 4-panel comic storyboard, or an animated cartoon short?',
      ],
    },
    {
      part: 'Part 1',
      title: 'A Tiny Map of a Future Creative Project',
      paragraphs: [
        'When creators build a longer story or animation with AI tools, they do not ask AI to "make a whole movie at once." They use the exact same step-by-step guardrail engineering you learned in PlayIQ:',
      ],
      bullets: [
        'Step 1 — Character Guardrail Card: Lock in your character’s name, three must-keep visual features, personality, and "never change" rules (from Module 1).',
        'Step 2 — 3-Beat Story Outline: Plan the Beginning (the spark), Middle (the obstacle), and Ending (the discovery) in your own words.',
        'Step 3 — 4-Scene Storyboard: Describe one camera shot and one action per scene while pasting your Character Guardrail Card so your character stays recognizable.',
        'Step 4 — Short Comic or Cartoon Experiment: Test one scene at a time in a parent-approved image or video tool, fixing one detail at a time if the character drifts.',
      ],
    },
    {
      part: 'Part 2',
      title: 'Why Keep Creative Story Projects Separate from Your Tutor & Assistant?',
      paragraphs: [
        'If you ever decide to try this later, you would create a separate Project named "My Character Story" using ONLY your Module 1 Character Kit (PlayIQ_Character_Kit/My_Character_Card_v1.md).',
      ],
      bullets: [
        'Never upload personal_learning_knowledge_file.md, Tutor records, or Personal Assistant files into a creative story project.',
        'Keeping each Project focused on one clear job prevents your Tutor from acting like a fiction writer during math homework and keeps your personal learning records private.',
        'Your Character Guardrail Card is your creative anchor: you stay the director and author, while AI helps you test scenes.',
      ],
    },
    {
      part: 'Part 3',
      title: 'Keep It as an Idea for Later (No Homework Today!)',
      paragraphs: [
        'You do NOT need to build a story, storyboard, or cartoon today. Module 13 has no required quiz, no required proof artifact, and no required Tutor Project update.',
        'If an idea popped into your head, you can optionally save a one-line note in the optional Future Idea box below — or simply click "Complete Module 13 Preview & Continue to Module 14 Capstone" right now!',
      ],
    },
  ] satisfies Module13PreviewSection[],
};

