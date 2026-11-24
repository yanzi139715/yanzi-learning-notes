/** 2026-11-24 → 2026 · 11 · 24 */
export function formatDate(isoDate: string): string {
  return isoDate.split("-").join(" · ");
}
