# Runbook: Proof Artifact Cleanup Schedule

## Overview
This runbook defines the operational process for cleaning up expired draft proof artifacts and orphaned storage objects. The cleanup endpoint is strictly internal and requires a bearer token secret to execute.

## Prerequisites
1. Ensure you have the Google Cloud SDK (`gcloud`) or Firebase CLI configured for your environment.
2. You must have access to set secrets on the hosting platform (Firebase App Hosting or equivalent).

## Step 1: Set the Cron Secret
The cleanup endpoint requires a secret token to run. Set this environment variable in your production environment.

**Note: Verify exact command before production based on your Firebase App Hosting setup.**
```bash
firebase apphosting:secrets:set PROOF_CLEANUP_CRON_SECRET
```
*(When prompted, enter a secure, randomly generated string).*

## Step 2: Create the Cloud Scheduler Job
We use Cloud Scheduler to hit the internal endpoint automatically every day at 3 AM.

```bash
gcloud scheduler jobs create http playiq-proof-cleanup-daily \
  --schedule="0 3 * * *" \
  --uri="https://YOUR_APP_DOMAIN/api/internal/proof-artifacts/cleanup" \
  --http-method=POST \
  --headers="Authorization=Bearer YOUR_SECRET,Content-Type=application/json" \
  --message-body='{"dryRun":false,"olderThanHours":24}'
```

## Manual Execution (CLI)
You can also run the cleanup via the included NPM scripts locally or in CI environments that have direct database access (using `SUPABASE_SERVICE_ROLE_KEY`):

- **Dry Run (Default):**
  ```bash
  npm run cleanup:proof-drafts:dry-run
  ```
- **Execute (Danger):**
  ```bash
  npm run cleanup:proof-drafts:execute
  ```

## Safety Mechanisms
- **Default Dry Run:** Both the script and the API route default to `dryRun: true`.
- **Time Floor:** The system strictly enforces a minimum of 24 hours for artifact deletion. Artifacts younger than 24 hours are physically impossible to delete via this tool.
- **Status Filter:** Only artifacts explicitly set to `draft` are targeted. `submitted`, `under_review`, `approved`, `revise`, and `rejected` states are heavily guarded.
