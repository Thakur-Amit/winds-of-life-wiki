import { defineField, defineType } from 'sanity';

/**
 * Sanity Schema: Species / Creature / Bestiary
 * Mythical fauna, non-human sentient races, and formidable beasts.
 */
export const species = defineType({
  name: 'species',
  title: 'Species / Creature / Beast',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Species / Creature Name',
      type: 'string',
      description: 'e.g., "Direwolves", "Dragons", "Children of the Forest", "The Others (White Walkers)", "Giants"',
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
      title: 'Bestiary Depiction / Illustration',
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
          title: 'Maester / Explorer Field Note',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quickSummary',
      title: 'Quick Summary (Used in Hover Cards)',
      type: 'text',
      rows: 3,
      description: 'Concise summary shown on internal hover cards.',
      validation: (Rule) => Rule.required().min(20).max(300),
    }),
    defineField({
      name: 'habitat',
      title: 'Primary Habitat / Range',
      type: 'string',
      description: 'e.g., "The Haunted Forest / Beyond the Wall", "Valyrian Freehold / Dragonstone"',
    }),
    defineField({
      name: 'status',
      title: 'Survival Status',
      type: 'string',
      options: {
        list: [
          { title: 'Thriving', value: 'Thriving' },
          { title: 'Endangered / Rare', value: 'Rare' },
          { title: 'Presumed Extinct', value: 'Presumed Extinct' },
          { title: 'Legendary / Mythical', value: 'Mythical' },
        ],
      },
      initialValue: 'Rare',
    }),
    defineField({
      name: 'description',
      title: 'Detailed Anatomy & Lore Description',
      type: 'portableText',
      description: 'Comprehensive natural history, behavioral traits, magical bonds, and role in world chronicles.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'habitat',
      media: 'image',
    },
  },
});
