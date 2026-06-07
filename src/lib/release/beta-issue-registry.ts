import { BetaIssue } from './beta-severity-policy';

export const BETA_ISSUE_REGISTRY: BetaIssue[] = [
  {
    id: 'ISS-01',
    category: 'Build and Deployment',
    description: 'ESLint warnings (160) exist on unused variables and Next.js img element recommendations.',
    severity: 'P2',
    tags: ['lint', 'warning', 'cosmetic'],
    checklistItemId: 'CHK-BLD-01'
  },
  {
    id: 'ISS-02',
    category: 'Data/Schema/Migrations',
    description: 'Sprint 9A/9B found 60 SELECT * low-risk queries. Deeper DB query refactoring is safely deferred.',
    severity: 'P2',
    tags: ['database', 'select_star', 'performance'],
    checklistItemId: 'CHK-DAT-02'
  },
  {
    id: 'ISS-03',
    category: 'Cost Controls',
    description: 'External cloud billing console alerts are documented in runbooks but not programmatically configured.',
    severity: 'P2',
    tags: ['billing', 'alerts', 'external'],
    checklistItemId: 'CHK-CST-01'
  },
  {
    id: 'ISS-04',
    category: 'Staging Reset Safety',
    description: 'Staging reset helper verified in dry-run; live data removal test deferred.',
    severity: 'P2',
    tags: ['staging', 'reset', 'dry_run'],
    checklistItemId: 'CHK-STG-01'
  }
];
