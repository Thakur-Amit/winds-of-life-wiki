import { defineField, defineType } from 'sanity';

/**
 * Sanity Schema: Character
 * Captures comprehensive personage lore, lineage links, and rich bio
 */
export const character = defineType({
  name: 'character',
  title: 'Character / Personage',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name / Epithet',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL Identifier)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titles',
      title: 'Noble Titles & Honorifics',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g., "Lord of Winterfell", "Warden of the North", "King in the North"',
    }),
    defineField({
      name: 'aliases',
      title: 'Aliases / Nicknames',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g., "The Quiet Wolf", "Ned", "The Young Wolf"',
    }),
    defineField({
      name: 'house',
      title: 'Allegiance / Noble House',
      type: 'reference',
      to: [{ type: 'house' }],
      description: 'Primary noble house or dynasty this character belongs to.',
    }),
    defineField({
      name: 'location',
      title: 'Kingdom / Primary Location',
      type: 'reference',
      to: [{ type: 'place' }, { type: 'location' }],
      description: 'Primary kingdom, seat, or geographical realm where this personage resides.',
    }),
    defineField({
      name: 'professions',
      title: 'Professions / Archetypes',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'profession' }] }],
      description: 'Role categories such as Kings, Knights, Lords, Assassins, Maesters.',
    }),
    defineField({
      name: 'image',
      title: 'Portrait / Heraldic Depiction',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          initialValue: 'Character portrait',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption / Artist Credit',
        },
      ],
    }),
    defineField({
      name: 'age',
      title: 'Age or Chronology',
      type: 'string',
      description: 'e.g., "35 (at death, 298 AC)" or "Born 263 AC"',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Alive', value: 'Alive' },
          { title: 'Deceased', value: 'Deceased' },
          { title: 'Unknown / Presumed Dead', value: 'Unknown' },
          { title: 'Resurrected / Undead', value: 'Resurrected' },
        ],
        layout: 'radio',
      },
      initialValue: 'Alive',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'culture',
      title: 'Culture / Ethnicity',
      type: 'string',
      description: 'e.g., "Northmen / First Men", "Valyrian", "Andal"',
    }),
    defineField({
      name: 'born',
      title: 'Born',
      type: 'string',
      description: 'e.g., "263 AC, at Winterfell"',
    }),
    defineField({
      name: 'died',
      title: 'Died',
      type: 'string',
      description: 'e.g., "298 AC, at Great Sept of Baelor, King\'s Landing"',
    }),
    defineField({
      name: 'quickSummary',
      title: 'Quick Summary (Used in Hover Cards & Search)',
      type: 'text',
      rows: 3,
      description: 'Concise 2-3 sentence overview displayed when hovering over internal wiki links.',
      validation: (Rule) =>
        Rule.required()
          .min(20)
          .max(300)
          .warning('Keep quick summary under 300 characters for optimal hover card display.'),
    }),
    // Family Tree Node Structuring Fields:
    defineField({
      name: 'father',
      title: 'Father (Lineage Reference)',
      type: 'reference',
      to: [{ type: 'character' }],
      description: 'Used for automatic hierarchical family tree graph generation.',
    }),
    defineField({
      name: 'mother',
      title: 'Mother (Lineage Reference)',
      type: 'reference',
      to: [{ type: 'character' }],
      description: 'Used for automatic hierarchical family tree graph generation.',
    }),
    defineField({
      name: 'spouse',
      title: 'Consort / Spouse',
      type: 'reference',
      to: [{ type: 'character' }],
      description: 'Used for marital connection rendering in the family tree.',
    }),
    defineField({
      name: 'children',
      title: 'Direct Issue / Children',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'character' }] }],
      description: 'Explicit child relationships for cross-verifying generation edges.',
    }),
    defineField({
      name: 'biography',
      title: 'Detailed Biography & Chronicles',
      type: 'portableText',
      description: 'Rich article body containing lore sections, citations, and internal links.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'house.name',
      media: 'image',
      status: 'status',
    },
    prepare({ title, subtitle, media, status }) {
      return {
        title,
        subtitle: `${subtitle || 'Independent'} • [${status || 'Unknown'}]`,
        media,
      };
    },
  },
});
