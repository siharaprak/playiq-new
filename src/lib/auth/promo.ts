/**
 * Promo code validation and normalization for PlayIQ Pilot & Beta testing.
 */

const DEFAULT_VALID_PROMO_CODES = [
  'PLAYIQ2025',
];

export function normalizePromoCode(code?: string | null): string {
  if (!code) return '';
  return code
    .trim()
    .toUpperCase()
    .replace(/^["']|["']$/g, '')
    .replace(/[^A-Z0-9]/g, '');
}

export function getValidPromoCodes(): string[] {
  const envCodes = (process.env.BETA_PROMO_CODE || '')
    .split(',')
    .map(c => normalizePromoCode(c))
    .filter(Boolean);

  const merged = new Set([
    ...DEFAULT_VALID_PROMO_CODES.map(c => normalizePromoCode(c)),
    ...envCodes,
  ]);

  return Array.from(merged);
}

export function isValidBetaPromoCode(code?: string | null): boolean {
  const normalized = normalizePromoCode(code);
  if (!normalized) return false;
  const validCodes = getValidPromoCodes();
  return validCodes.includes(normalized);
}
