import { isSafeLogField, type LogSeverity } from './log-policy';

/**
 * Sprint 9A — Safe Structured Logger
 *
 * Enforces log field rules and filters out forbidden properties (PII, prompts, keys).
 */
export class SafeLogger {
  private static sanitizePayload(payload: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(payload)) {
      if (isSafeLogField(key)) {
        sanitized[key] = value;
      } else {
        // Replace forbidden fields with a safe placeholder
        sanitized[key] = '[REDACTED_PRIVACY_SAFE]';
      }
    }

    return sanitized;
  }

  private static log(severity: LogSeverity, event: string, payload?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const cleanPayload = payload ? this.sanitizePayload(payload) : {};

    const logObject = {
      timestamp,
      severity,
      event,
      ...cleanPayload
    };

    // Output structured JSON log to stdout
    console.log(JSON.stringify(logObject));
  }

  public static debug(event: string, payload?: Record<string, unknown>) {
    this.log('debug', event, payload);
  }

  public static info(event: string, payload?: Record<string, unknown>) {
    this.log('info', event, payload);
  }

  public static warn(event: string, payload?: Record<string, unknown>) {
    this.log('warn', event, payload);
  }

  public static error(event: string, payload?: Record<string, unknown>) {
    this.log('error', event, payload);
  }

  public static security(event: string, payload?: Record<string, unknown>) {
    this.log('security', event, payload);
  }
}
