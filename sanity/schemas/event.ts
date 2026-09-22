import { defineField, defineType } from 'sanity';

/**
 * Sanity Schema: Event
 * Major historical chronicles, battles, sieges, tourneys, and rebellions.
 */
export const event = defineType({
  name: 'event',
  title: 'Historical Event / Battle',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Event Title',
      type: 'string',
      description: 'e.g., "Robert\'s Rebellion", "Tourney at Harrenhal", "The Red Wedding"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date / Era',
      type: 'string',
      description: 'e.g., "282 AC – 283 AC", "281 AC (Year of the False Spring)"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Primary Battleground / Site',
      type: 'reference',
      to: [{ type: 'place' }, { type: 'location' }],
      description: 'Main location where the event transpired.',
    }),
    defineField({
      name: 'involvedParties',
      title: 'Involved Parties & Belligerents',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'character' }, { type: 'house' }],
        },
      ],
      description: 'Houses and notable commanders participating in the conflict.',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'outcome',
      title: 'Historical Outcome',
      type: 'string',
      description: 'e.g., "Rebel victory; overthrow of the Targaryen dynasty."',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quickSummary',
      title: 'Quick Summary (Used in Hover Cards)',
      type: 'text',
      rows: 3,
      description: 'Short summary displayed when hovering over internal wiki links.',
      validation: (Rule) => Rule.required().min(20).max(300),
    }),
    defineField({
      name: 'image',
      title: 'Historical Chronicle Illustration',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Chronicle Description & Aftermath',
      type: 'portableText',
      description: 'Exhaustive historical account with references and timeline.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'date',
      media: 'image',
    },
  },
});
