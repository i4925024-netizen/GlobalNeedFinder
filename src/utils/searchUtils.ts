export function generateSearchKeywords(text: string): string[] {
  if (!text) return [];
  const normalized = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 2);

  // Return unique keywords
  return Array.from(new Set(normalized));
}

export function matchesKeywords(
  targetText: string,
  searchQuery: string
): boolean {
  if (!searchQuery.trim()) return true;
  const searchTerms = searchQuery
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0);

  const targetLower = targetText.toLowerCase();
  return searchTerms.every((term) => targetLower.includes(term));
}
