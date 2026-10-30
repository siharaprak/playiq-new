import 'server-only';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { CourseShell } from './learning-record';

export interface CourseLesson {
  moduleNumber: number;
  title: string;
  html: string;
  betaQuestions: string[];
}

export const COURSE_SOURCE_PATH = path.join(
  'docs', 'curriculum', 'playiq-weekend-test-20261030',
  'PLAYIQ_COMPLETE_COURSE_MASTER_20261030.html',
);

export function courseShellEnabled(shell: CourseShell): boolean {
  if (shell !== 'beta' && shell !== 'final') return false;
  return (shell === 'beta'
    ? process.env.PLAYIQ_COURSE_BETA_ENABLED
    : process.env.PLAYIQ_COURSE_FINAL_ENABLED) === 'true';
}

function plainText(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
    .replace(/&#x([a-f\d]+);/gi, (_, number) => String.fromCodePoint(parseInt(number, 16)))
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ').trim();
}

// This is a finite, repo-controlled generated document, never an uploaded HTML renderer.
// Strip active document elements and inline handlers as defense in depth. The page's
// own scripts/styles/copy controls are intentionally not imported into the app.
function prepareLessonHtml(html: string): string {
  return html
    .replace(/<(script|style|iframe|object|embed|form)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<(?:script|style|iframe|object|embed|link|meta|base)\b[^>]*\/?\s*>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s+(?:href|src)\s*=\s*(["'])\s*(?:javascript|data|vbscript):[\s\S]*?\1/gi, '')
    .replace(/\s+(?:href|src)\s*=\s*(?:javascript|data|vbscript):[^\s>]+/gi, '')
    .replace(/(["'])(?:assets\/)?orion-reference\.png\1/g, '"/course-release/orion-reference.png"')
    .replace(/(["'])(?:output\/pdf\/)?PLAYIQ_COMPLETE_COURSE_LIGHT_PRINT_\d+\.pdf\1/g, '"/course-release/course-print.pdf"');
}

export function extractCourseLessons(source: string, shell: CourseShell): CourseLesson[] {
  const lessons: CourseLesson[] = [];
  const sections = source.matchAll(/<section\b[^>]*\bid=["']module-(\d+)["'][^>]*>([\s\S]*?)<\/section\s*>/gi);
  for (const section of sections) {
    const moduleNumber = Number(section[1]);
    if (!Number.isInteger(moduleNumber) || moduleNumber < 0 || moduleNumber > 14
      || lessons.some(lesson => lesson.moduleNumber === moduleNumber)) {
      throw new Error('Invalid or duplicate module in the course release source.');
    }
    const fullHtml = prepareLessonHtml(section[2]);
    const title = plainText(fullHtml.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? '');
    if (!title) throw new Error(`Course source has no title for Module ${moduleNumber}.`);
    const feedbackStart = fullHtml.search(/<h[23]\b[^>]*>\s*Beta\s+tester\s+feedback[\s\S]*?<\/h[23]>/i);
    const feedbackHtml = feedbackStart >= 0 ? fullHtml.slice(feedbackStart) : '';
    const betaQuestions = shell === 'beta'
      ? Array.from(feedbackHtml.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi), item => plainText(item[1])).filter(Boolean)
      : [];
    // Only the beta tail is replaced by a working form. All lesson content before
    // that heading, including every tutorial/prompt/table, remains unabridged.
    const html = feedbackStart >= 0 ? fullHtml.slice(0, feedbackStart) : fullHtml;
    lessons.push({ moduleNumber, title, html, betaQuestions });
  }
  lessons.sort((a, b) => a.moduleNumber - b.moduleNumber);
  if (lessons.length !== 15 || lessons.some((lesson, index) => lesson.moduleNumber !== index)) {
    throw new Error('Course source must contain exactly Module 00 and Modules 1–14.');
  }
  return lessons;
}

export function loadCourseLessons(shell: CourseShell): CourseLesson[] {
  // Fixed path: neither a query string nor student input can select a file to read.
  return extractCourseLessons(readFileSync(path.join(process.cwd(), COURSE_SOURCE_PATH), 'utf8'), shell);
}
