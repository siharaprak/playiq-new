import 'server-only';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function createApiSuccess<T>(data: T) {
  return NextResponse.json({ ok: true, data });
}

export function createApiError(message: string, status: number = 500) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export function createApiValidationError(error: ZodError, status: number = 400) {
  return NextResponse.json({ ok: false, error: 'Invalid input', details: error.flatten() }, { status });
}

export function handleApiError(error: unknown, defaultMessage: string = 'Internal server error') {
  if (error instanceof Response) return error;
  if (error instanceof Error) {
    return createApiError(error.message || defaultMessage, 400);
  }
  return createApiError(defaultMessage, 500);
}
