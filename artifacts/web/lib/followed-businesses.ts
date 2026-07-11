const FOLLOWED_BUSINESSES_KEY = "nazdikam.followedBusinesses";

function normalize(items: string[]): string[] {
  return Array.from(new Set(items.filter(Boolean)));
}

export function getFollowedBusinesses(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FOLLOWED_BUSINESSES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? normalize(parsed.map(String)) : [];
  } catch {
    return [];
  }
}

export function setFollowedBusinesses(slugs: string[]): void {
  if (typeof window === "undefined") return;
  const clean = normalize(slugs);
  window.localStorage.setItem(FOLLOWED_BUSINESSES_KEY, JSON.stringify(clean));
}

export function isBusinessFollowed(slug: string): boolean {
  return getFollowedBusinesses().includes(slug);
}

export function setBusinessFollowed(slug: string, followed: boolean): void {
  const current = getFollowedBusinesses();
  if (followed) {
    setFollowedBusinesses([...current, slug]);
  } else {
    setFollowedBusinesses(current.filter((s) => s !== slug));
  }
}
