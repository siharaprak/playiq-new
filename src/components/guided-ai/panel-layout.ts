/** Pure layout calculation; never reads chat, identity, storage, or provider data. */
export interface OrionViewport {
  width: number;
  height: number;
  offsetLeft: number;
  offsetTop: number;
}

const finite = (value: number, fallback: number) => Number.isFinite(value) ? value : fallback;

export function getOrionPanelLayout(viewport: OrionViewport, expanded: boolean) {
  const viewportWidth = Math.max(1, finite(viewport.width, 320));
  const viewportHeight = Math.max(1, finite(viewport.height, 480));
  const narrow = viewportWidth < 768;
  const short = viewportHeight < 500;
  // VisualViewport dimensions shrink with a mobile keyboard or browser zoom.
  const margin = Math.min(narrow || short ? 8 : 16, viewportWidth / 4, viewportHeight / 4);
  const availableWidth = viewportWidth - margin * 2;
  const availableHeight = viewportHeight - margin * 2;
  const fullViewport = narrow || short;
  const width = Math.min(availableWidth, fullViewport ? availableWidth : expanded ? Math.max(544, Math.min(1200, viewportWidth * 0.68)) : 544);
  const height = fullViewport || expanded ? availableHeight : Math.min(736, availableHeight);

  return {
    width,
    height,
    left: Math.max(0, finite(viewport.offsetLeft, 0)) + viewportWidth - margin - width,
    top: Math.max(0, finite(viewport.offsetTop, 0)) + viewportHeight - margin - height,
    autoCollapseCharacter: narrow || viewportHeight < 600,
    canExpand: !fullViewport,
  };
}
