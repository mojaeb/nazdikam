export interface BusinessAnnouncement {
  id: string;
  businessSlug: string;
  businessName: string;
  title: string;
  description: string;
}

export function filterAnnouncements(
  items: BusinessAnnouncement[],
  query: string,
): BusinessAnnouncement[] {
  const q = query.trim();
  if (!q) return items;
  return items.filter(
    (a) =>
      a.title.includes(q) ||
      a.description.includes(q) ||
      a.businessName.includes(q),
  );
}
