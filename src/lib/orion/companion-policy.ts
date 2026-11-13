/** Presentation-only release gate. It grants no course, chat or data access. */
export type CompanionScope = 'off' | 'beta' | 'all';
export function resolveCompanionScope(mode: string | undefined, isAdmin: boolean): CompanionScope {
  if (mode === 'all' || mode === 'beta') return mode;
  if (mode === 'admin' && isAdmin) return 'all';
  return 'off';
}
export function companionVisibleOnRoute(scope: CompanionScope, pathname: string | null): boolean {
  return scope === 'all' || (scope === 'beta' && /^\/student\/course-beta(?:\/|$)/.test(pathname ?? ''));
}
export type CompanionViewport = {width: number; height: number; offsetLeft: number; offsetTop: number};
export function companionGeometry(viewport: CompanionViewport, compact = false) {
  const scale = compact ? 1 : viewport.width < 768 || viewport.height < 500 ? 0.625 : 1;
  return {width: compact ? 56 : 192 * scale, height: compact ? 56 : 208 * scale, scale};
}
export function boundCompanion(x: number, y: number, viewport: CompanionViewport, compact = false) {
  const {width, height} = companionGeometry(viewport, compact);
  const safe = (value: number) => Number.isFinite(value) ? value : 0;
  const left = Math.max(0, safe(viewport.offsetLeft)), top = Math.max(0, safe(viewport.offsetTop));
  return {
    x: Math.max(left, Math.min(safe(x), left + Math.max(0, safe(viewport.width) - width - 8))),
    y: Math.max(top, Math.min(safe(y), top + Math.max(0, safe(viewport.height) - height - 48))),
  };
}
export function defaultCompanionPosition(viewport: CompanionViewport, compact = false) {
  const {width, height} = companionGeometry(viewport, compact);
  const safe = (value: number) => Number.isFinite(value) ? value : 0;
  return boundCompanion(
    safe(viewport.offsetLeft) + safe(viewport.width) - width - 16,
    safe(viewport.offsetTop) + safe(viewport.height) - height - 56,
    viewport,
    compact,
  );
}
