export interface Tag {
  id: string;
  cn: string;
  en: string;
}

// 'all' is a UI filter only — not a real post tag.
export const TAGS: Tag[] = [
  { id: 'all', cn: '全部', en: 'All' },
  { id: 'notes', cn: '随笔', en: 'Notes' },
  { id: 'tea', cn: '茶', en: 'Tea' },
  { id: 'cooking', cn: '做饭', en: 'Cooking' },
  { id: 'walks', cn: '散步', en: 'Walks' },
  { id: 'craft', cn: '手艺', en: 'Craft' },
  { id: 'genesis', cn: '造物', en: 'Genesis' },
  { id: 'guide', cn: '指南', en: 'Guides' },
];

export function tagLabel(id: string): Tag {
  return TAGS.find((t) => t.id === id) ?? { id, cn: id, en: id };
}
