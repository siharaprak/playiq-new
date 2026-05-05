import 'server-only';

export function parsePaginationParams(searchParams: URLSearchParams, defaultPageSize: number = 20) {
  const pageParam = searchParams.get('page');
  const pageSizeParam = searchParams.get('pageSize');

  const page = Math.max(1, parseInt(pageParam || '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(pageSizeParam || String(defaultPageSize), 10)));

  return { page, pageSize };
}
