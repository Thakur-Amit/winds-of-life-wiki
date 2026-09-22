import { defineField, defineType } from 'sanity';

/**
 * Sanity Schema: Culture
 * Civilizations, ethnic groups, religious traditions, and folkways.
 */
export const culture = defineType({
  name: 'culture',
  title: 'Culture / Society / Tradition',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Culture / People Name',
      type: 'string',
      description: 'e.g., "The First Men", "Valyrians", "Andals", "Ironborn", "Dothraki"',
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
      title: 'Cultural Depiction / Emblem',
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
          title: 'Cultural Artifact / Portrait Note',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quickSummary',
      title: 'Quick Summary (Used in Hover Cards)',
      type: 'text',
      rows: 3,
      description: 'Concise summary shown on internal hover cards and quick previews.',
      validation: (Rule) => Rule.required().min(20).max(300),
    }),
    defineField({
      name: 'region',
      title: 'Primary Homeland / Geographic Sphere',
      type: 'string',
      description: 'e.g., "The North & Beyond the Wall", "Valyrian Peninsula", "The Dothraki Sea"',
    }),
    defineField({
      name: 'religion',
      title: 'Dominant Faith / Deities',
      type: 'string',
      description: 'e.g., "Old Gods of the Forest", "Faith of the Seven", "Drowned God", "R\'hllor"',
    }),
    defineField({
      name: 'traditions',
      title: 'Religion, Customs & Traditions',
      type: 'portableText',
      description: 'Rich article body covering religious rites, marriage customs, funeral rituals, and linguistic lore.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'religion',
      media: 'image',
    },
  },
});
