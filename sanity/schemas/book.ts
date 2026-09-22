import { defineField, defineType } from 'sanity';

/**
 * Sanity Schema: Book / Canonical Tome
 * Canonical novels, novellas, histories, and in-universe sourcebooks.
 */
export const book = defineType({
  name: 'book',
  title: 'Book / Canonical Tome',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Book Title',
      type: 'string',
      description: 'e.g., "A Game of Thrones", "A Clash of Kings", "Fire & Blood"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL Identifier)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Book Cover / Tome Illumination',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'releaseOrder',
      title: 'Canonical Release Order / Number',
      type: 'number',
      description: 'Chronological publication sequence number (e.g., 1 for A Game of Thrones).',
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: 'publicationYear',
      title: 'Publication Year',
      type: 'string',
      description: 'e.g., "1996", "1998", "2018"',
    }),
    defineField({
      name: 'pageCount',
      title: 'Page Count / Volume Length',
      type: 'number',
    }),
    defineField({
      name: 'quickSummary',
      title: 'Quick Summary (Used in Hover Cards)',
      type: 'text',
      rows: 3,
      description: 'Concise summary shown on internal link hover cards.',
      validation: (Rule) => Rule.required().min(20).max(300),
    }),
    defineField({
      name: 'synopsis',
      title: 'Detailed Synopsis & Chapter Perspectives',
      type: 'portableText',
      description: 'Full narrative overview, major POV characters, narrative themes, and historical impact.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publicationYear',
      media: 'coverImage',
    },
  },
});
