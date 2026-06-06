import fs from 'fs';
import path from 'path';

import { module1Nodes } from './src/data/module1Content';
import { module2Nodes } from './src/data/module2Content';
import { module3Nodes } from './src/data/module3Content';
import { module4Nodes } from './src/data/module4Content';
import { module5Nodes } from './src/data/module5Content';
import { module6Nodes } from './src/data/module6Content';
import { module7Nodes } from './src/data/module7Content';
import { module8Nodes } from './src/data/module8Content';
import { module9Nodes } from './src/data/module9Content';
import { module10Nodes } from './src/data/module10Content';

const allModules = [
  module1Nodes, module2Nodes, module3Nodes, module4Nodes, module5Nodes,
  module6Nodes, module7Nodes, module8Nodes, module9Nodes, module10Nodes
];

let markdown = `# PlayIQ Curriculum\n\n`;

allModules.forEach((module, index) => {
  markdown += `## Module ${index + 1}\n\n`;
  
  for (const nodeId in module) {
    const node = module[nodeId] as any;
    markdown += `### Node ${nodeId}: ${node.title}\n\n`;
    
    if (node.bigIdea) {
        markdown += `**Big Idea:**\n`;
        node.bigIdea.forEach((idea: string) => {
        markdown += `- ${idea}\n`;
        });
        markdown += `\n`;
    }
    
    if (node.sections) {
        node.sections.forEach((section: any) => {
        if (section.title) {
            markdown += `**${section.title}**\n`;
        }
        section.content.forEach((content: string) => {
            markdown += `- ${content}\n`;
        });
        markdown += `\n`;
        });
    }
    
    if (node.activity) {
      markdown += `#### Activity: ${node.activity.title}\n\n`;
      if (node.activity.instructions) {
          markdown += `**Instructions:**\n`;
          node.activity.instructions.forEach((inst: string) => {
            markdown += `- ${inst}\n`;
          });
      }
      if (node.activity.scenarios) {
          markdown += `\n**Scenarios:**\n`;
          node.activity.scenarios.forEach((scen: string) => {
            markdown += `- ${scen}\n`;
          });
      }
      if (node.activity.reflection) {
        markdown += `\n**Reflection:**\n`;
        node.activity.reflection.forEach((ref: string) => {
          markdown += `- ${ref}\n`;
        });
      }
      markdown += `\n`;
    }
    
    if (node.miniCheck) {
      markdown += `#### Mini Check\n`;
      node.miniCheck.forEach((check: string) => {
        markdown += `- ${check}\n`;
      });
      markdown += `\n`;
    }
    
    if (node.teachBack) {
      markdown += `#### Teach Back\n`;
      markdown += `> ${node.teachBack}\n\n`;
    }
    
    markdown += `---\n\n`;
  }
});

fs.writeFileSync('public/playiq-curriculum.md', markdown);
console.log('Markdown generated successfully!');
