import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Bilingual notes. CN primary, EN supporting.
// Bodies live in frontmatter (paragraphs separated by a blank line) so the
// post template can split them and inject the pull-quote between paragraphs —
// matching the original design exactly. The markdown body itself is unused.
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    date: z.coerce.date(),
    tag: z.enum(['notes', 'tea', 'cooking', 'walks', 'craft']),
    readMin: z.number(),
    titleCn: z.string(),
    titleEn: z.string(),
    dekCn: z.string(),
    dekEn: z.string(),
    hero: z.string().nullable().optional(),
    bodyCn: z.string(),
    bodyEn: z.string(),
  }),
});

export const collections = { notes };
