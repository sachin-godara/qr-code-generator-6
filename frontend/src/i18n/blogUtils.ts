/**
 * Helper to compute smart, category-aware, and circular related posts.
 * Guarantees every single blog post receives internal inbound links, eliminating
 * the crawl starvation problem in Google Search Console.
 */
export function getSmartRelatedPosts<T extends { id: string; data: { category: string; pubDate: Date } }>(
  currentPost: T,
  allPosts: T[],
  count: number = 3
): T[] {
  // Sort all posts deterministically by pubDate descending
  const sortedAll = [...allPosts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const currentIndex = sortedAll.findIndex((p) => p.id === currentPost.id);
  const total = sortedAll.length;

  const selected: T[] = [];

  // 1. Same-category companion post (topical relevance)
  const sameCat = sortedAll.filter(
    (p) => p.id !== currentPost.id && p.data.category === currentPost.data.category
  );
  if (sameCat.length > 0) {
    selected.push(sameCat[0]);
  }

  // 2. Next post in circular sequence
  for (let offset = 1; offset < total; offset++) {
    const nextCandidate = sortedAll[(currentIndex + offset) % total];
    if (nextCandidate.id !== currentPost.id && !selected.some((s) => s.id === nextCandidate.id)) {
      selected.push(nextCandidate);
      break;
    }
  }

  // 3. Previous post in circular sequence
  for (let offset = 1; offset < total; offset++) {
    const prevCandidate = sortedAll[(currentIndex - offset + total) % total];
    if (prevCandidate.id !== currentPost.id && !selected.some((s) => s.id === prevCandidate.id)) {
      selected.push(prevCandidate);
      break;
    }
  }

  // 4. Fill remaining slots if count > 3
  while (selected.length < count) {
    for (let offset = 2; offset < total; offset++) {
      const candidate = sortedAll[(currentIndex + offset) % total];
      if (candidate.id !== currentPost.id && !selected.some((s) => s.id === candidate.id)) {
        selected.push(candidate);
        if (selected.length >= count) break;
      }
    }
    break;
  }

  return selected.slice(0, count);
}
