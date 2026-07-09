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
    tag: z.enum(['notes', 'tea', 'cooking', 'walks', 'craft', 'genesis', 'guide']),
    readMin: z.number(),
    titleCn: z.string(),
    titleEn: z.string(),
    dekCn: z.string(),
    dekEn: z.string(),
    hero: z.string().nullable().optional(),
    // CSS object-position for the hero image's cover crop (e.g. "left", "30% center").
    // Lets a wide image keep its key subject in frame on the cropped cards.
    heroPosition: z.string().optional(),
    // Short bilingual notes carry their body in frontmatter. Long-form
    // articles (article: true) render their markdown body instead, so these
    // are optional for those.
    bodyCn: z.string().optional(),
    bodyEn: z.string().optional(),
    // When true, this entry is a full markdown article: the post template
    // renders the markdown body (headings, tables, code, images) rather than
    // splitting bodyCn/bodyEn into paragraphs.
    article: z.boolean().optional(),
    // Optional closing pull-quote. When set, it overrides the default
    // (first-sentence) pull-quote and renders at the END of each language block.
    pullQuoteCn: z.string().optional(),
    pullQuoteEn: z.string().optional(),
  }),
});

export const collections = { notes };
