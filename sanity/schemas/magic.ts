import { defineField, defineType } from 'sanity';

/**
 * Sanity Schema: Magic & Artifacts
 * Arcane schools, legendary relics, Valyrian steel, and sorcery.
 */
export const magic = defineType({
  name: 'magic',
  title: 'Magic / Arcana / Artifact',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Magic Discipline or Artifact Name',
      type: 'string',
      description: 'e.g., "Valyrian Steel Forging", "Glass Candles", "Bloodmagic", "Greensight"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL Identifier)',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Relic / Arcane Illustration',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Relic / Grimoire Archival Note',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quickSummary',
      title: 'Quick Summary (Used in Hover Cards)',
      type: 'text',
      rows: 3,
      description: 'Concise summary shown on internal hover cards and quick search previews.',
      validation: (Rule) => Rule.required().min(20).max(300),
    }),
    defineField({
      name: 'origin',
      title: 'Origin / Tradition',
      type: 'string',
      description: 'e.g., "Old Valyria", "Asshai-by-the-Shadow", "Children of the Forest"',
    }),
    defineField({
      name: 'dangerLevel',
      title: 'Potency / Peril Level',
      type: 'string',
      options: {
        list: [
          { title: 'Subtle / Divinatory', value: 'Subtle' },
          { title: 'Potent / Hazardous', value: 'Potent' },
          { title: 'Cataclysmic / Forbidden', value: 'Cataclysmic' },
        ],
      },
      initialValue: 'Potent',
    }),
    defineField({
      name: 'rulesAndArtifacts',
      title: 'Rules, Principles & Famous Artifacts',
      type: 'portableText',
      description: 'Detailed lore explaining the metaphysical laws, known relics, costs, and practitioners.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'origin',
      media: 'image',
    },
  },
});
