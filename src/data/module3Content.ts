import type { NodeContent } from './module1Content';

export const module3Nodes: Record<string, NodeContent> = {
  '1': {
    id: '1',
    imageUrl: '/images/modules/bright-mixed-playiq-03.png',
    title: 'Why Pre-Learning Destroys Overwhelm',
    bigIdea: [
      'Your mission: make tomorrow\u2019s lesson feel familiar today.',
      'Imagine walking into class and hearing a new topic\u2014but instead of feeling lost, you already recognize the main idea, the important words, and the question you want to ask. That is pre-learning.',
      'You are not trying to master the entire lesson before the teacher teaches it. You are giving your brain a map so the new details have somewhere to land.',
    ],
    sections: [
      {
        title: 'Lightning Hook \u2014 See the map',
        content: [
          'Which would you rather see before entering a giant theme park for the first time?',
          'A. Every fact about every ride.',
          'B. A simple map showing the main areas.',
          'C. One exciting ride so you understand what the park feels like.',
          'Choice B resembles map-first learning. Choice C resembles example-first learning. Today you will test both.',
        ],
      },
      {
        title: 'The five-part map',
        content: [
          'A useful starter map answers:',
          '1. What is the topic?',
          '2. What are its main parts?',
          '3. Which words will probably appear?',
          '4. What is one easy example?',
          '5. What should I listen for or ask in class?',
        ],
      },
      {
        title: 'First principle: the idea underneath the details',
        content: [
          'A first principle is the simplest useful idea that helps the other details make sense.',
          'Example for photosynthesis: "Plants use light energy to build food from water and carbon dioxide."',
          'That sentence is not the entire lesson. It is the hook that the details attach to.',
        ],
      },
    ],
    activity: {
      title: 'Build Your First Map',
      instructions: [
        'Choose a topic you will study soon.',
        'Use the Orion prompt to request a five-part map, core idea, essential words, everyday example, and class question.',
        'Complete the map quality check.',
      ],
      scenarios: [
        'Is the map short enough to scan in one minute?',
        'Does it show the main parts rather than every detail?',
        'Can I explain the core idea in my own words?',
        'Did I check unfamiliar or doubtful information?',
      ],
      reflection: [
        'What do I currently think the topic is about?',
        'What already feels confusing?',
      ],
    },
    miniCheck: [
      'What are the five parts of a pre-learn map?',
      'What is a first principle?',
      'Why does the map focus on main parts instead of every detail?',
    ],
    teachBack: 'Explain the five-part map to someone and show them how it reduces overwhelm for a new topic.',
  },

  '2': {
    id: '2',
    imageUrl: '/images/modules/bright-mixed-playiq-04.png',
    title: 'Learn How You Learn \u2014 Map vs Example',
    bigIdea: [
      'This experiment tests what helps you enter a new topic. It does not decide how you must learn forever.',
      'You will compare map-first and example-first approaches on the same topic.',
    ],
    sections: [
      {
        title: 'Round A \u2014 Map-first',
        content: [
          'Prompt: "Give me a five-part map of [topic]. Use one short line per part. Do not explain details until I ask."',
          'Write what you think the topic is about before reading further.',
          'Rate: clarity, curiosity, and overwhelm (each /5).',
        ],
      },
      {
        title: 'Round B \u2014 Example-first',
        content: [
          'Start fresh. Prompt: "Give me two simple real-world examples and one non-example of [topic]. Then ask what pattern I notice before explaining the rule."',
          'What pattern did you notice?',
          'Rate: clarity, curiosity, and overwhelm (each /5).',
        ],
      },
      {
        title: 'Non-examples reveal the boundary',
        content: [
          'An example shows what a concept is. A non-example shows what it is not. Seeing both helps the brain find the boundary.',
          'Example concept: mammal. Example: dolphin\u2014warm-blooded, breathes air, nurses its young. Non-example: shark\u2014fish with gills; it does not nurse its young.',
          'Choose one key term from your topic and find an example and non-example.',
        ],
      },
    ],
    activity: {
      title: 'Map vs Example Comparison',
      instructions: [
        'Run both rounds (map-first and example-first) on a second unfamiliar topic.',
        'Find one example and one non-example for a key term.',
        'Verify the example and non-example with a trusted source.',
      ],
      scenarios: [
        'Which beginning helped me form an accurate first idea faster?',
        'Which beginning made me more curious?',
        'Which beginning reduced overwhelm?',
        'Did either version fail because Orion used words I did not understand?',
        'Which sequence should Orion test next time: map then examples, or examples then map?',
      ],
      reflection: [
        'What is the important difference between your example and non-example?',
        'What source did you use to verify?',
      ],
    },
    miniCheck: [
      'What is the difference between map-first and example-first learning?',
      'What is a non-example and why does it help?',
      'Which approach worked better for you and why?',
    ],
    teachBack: 'Explain the difference between a map-first and example-first approach, and describe which one worked better for your test topic.',
  },

  '3': {
    id: '3',
    imageUrl: '/images/modules/bright-mixed-playiq-05.png',
    title: 'The Ten-Line Pre-Learn Brief',
    bigIdea: [
      'A ten-line brief captures everything you need to walk into class prepared. If a line is uncertain, write "I need to check" rather than inventing an answer.',
    ],
    sections: [
      {
        title: 'The ten lines',
        content: [
          '1. This topic is about ___',
          '2. The core idea is ___',
          '3. One main part is ___',
          '4. Another main part is ___',
          '5. A useful word is ___, which means ___',
          '6. A simple example is ___',
          '7. A non-example or common confusion is ___',
          '8. This matters because ___',
          '9. I still need to check ___',
          '10. My best question for class is ___',
        ],
      },
      {
        title: 'Memory test',
        content: [
          'Read the ten lines once. Cover them and say the core idea from memory.',
          'What did you remember? What disappeared from memory?',
          'That missing part is a useful signal for your next question.',
        ],
      },
    ],
    activity: {
      title: 'Complete Your Pre-Learn Brief',
      instructions: [
        'Fill in all ten lines using your own words.',
        'Write "I need to check" for any uncertain line.',
        'Test your memory of the core idea.',
      ],
      scenarios: [
        'This topic is about ___',
        'The core idea is ___',
        'One main part is ___',
        'A useful word and its meaning',
        'My best question for class is ___',
      ],
      reflection: [
        'What did you remember after covering the brief?',
        'What disappeared from memory?',
      ],
    },
    miniCheck: [
      'What are the ten lines of the pre-learn brief?',
      'Why should you write "I need to check" instead of guessing?',
      'What does the memory test reveal?',
    ],
    teachBack: 'Create a ten-line pre-learn brief for a topic you will study soon and explain why each line matters.',
  },

  '4': {
    id: '4',
    imageUrl: '/images/modules/bright-mixed-playiq-06.png',
    title: 'Blueprint, Proof & Beat Tomorrow\u2019s Class',
    bigIdea: [
      'Your Blueprint setting tells your future tutor how to introduce a brand-new topic. It does not control every explanation and it can change when evidence changes.',
    ],
    sections: [
      {
        title: 'Learning Supercharger Blueprint update',
        content: [
          'pre-learn-sequence options:',
          'map-first: begin with the main parts, then show examples',
          'example-first: begin with examples and a non-example, then show the map',
          'question-first: first ask what the student already knows, then choose the sequence',
          'Confidence: low | medium | high',
          'Review condition: Test this setting with another subject before calling it a strong preference.',
        ],
      },
      {
        title: 'Knowledge File update \u2014 My Study System',
        content: [
          'module: 3',
          'record_type: experiment_result',
          'topic_tested: [topic]',
          'pre_learn_sequence_to_test: [map-first | example-first | question-first]',
          'core_idea_in_own_words: [student sentence]',
          'best_entry_signal: [clarity | curiosity | lower overwhelm]',
          'evidence: [comparison result]',
          'confidence: [low | medium | high]',
          'rule_updated: pre-learn-sequence',
          'privacy: safe_for_tutor_project',
        ],
      },
      {
        title: 'Proof artifact \u2014 Pre-Learn Mission Card',
        content: [
          'Upcoming topic:',
          'Five-part map completed: yes / not yet',
          'Core idea in my own words:',
          'Sequence tested:',
          'Sequence to test again:',
          'One fact I verified:',
          'My question for class:',
          'Orion rule staged: pre-learn-sequence =',
        ],
      },
    ],
    activity: {
      title: 'Mastery Challenge \u2014 Beat Tomorrow\u2019s Class',
      instructions: [
        'Choose a real topic that will appear in school, training, or a personal learning goal soon.',
        '1. Use your selected pre-learn sequence.',
        '2. Create a five-part map.',
        '3. Identify the core idea.',
        '4. Add one example and one non-example.',
        '5. Verify one claim.',
        '6. Complete the ten-line pre-learn brief.',
        '7. Enter the lesson with one useful question.',
        'After the real lesson, return and answer the reflection questions.',
      ],
      scenarios: [
        'I can create a map without requesting every detail.',
        'I can explain the core idea in my own words.',
        'I can use examples and non-examples.',
        'I can explain what my Blueprint setting controls.',
      ],
      reflection: [
        'What felt familiar because I pre-learned it?',
        'What did the teacher or trusted source correct or deepen?',
        'Should I keep, change, or retest my sequence?',
      ],
    },
    miniCheck: [
      'What is your pre-learn-sequence setting and why?',
      'What evidence supports your choice?',
      'What did you learn from your real-class test?',
    ],
    teachBack: 'Explain your pre-learn process and what happened when you walked into class having already mapped the topic.',
  },
};
