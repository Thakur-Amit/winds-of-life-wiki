import { defineField, defineType } from 'sanity';

/**
 * Sanity Schema: Place / Kingdom / Stronghold
 * Geographical realms, great castles, free cities, and landmarks.
 */
export const place = defineType({
  name: 'place',
  title: 'Kingdom / Place / Stronghold',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Place / Kingdom Name',
      type: 'string',
      description: 'e.g., "Winterfell", "King\'s Landing", "The Eyrie", "Braavos"',
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
      name: 'region',
      title: 'Region / Kingdom',
      type: 'string',
      description: 'e.g., "The North", "The Crownlands", "The Reach", "Essos"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'locationType',
      title: 'Place Type',
      type: 'string',
      options: {
        list: [
          { title: 'Castle', value: 'Castle' },
          { title: 'City', value: 'City' },
          { title: 'Village', value: 'Village' },
          { title: 'Capital', value: 'Capital' },
          { title: 'Kingdom', value: 'Kingdom' },
          { title: 'Fortress', value: 'Fortress' },
          { title: 'Ruins', value: 'Ruins' },
          { title: 'Landmark', value: 'Landmark' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Map / Architectural Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          initialValue: 'Map or depiction of place',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Cartographer / Citadel Archival Notes',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quickSummary',
      title: 'Quick Summary (Used in Hover Cards & Search)',
      type: 'text',
      rows: 3,
      description: 'Concise 2-3 sentence overview displayed on hover link preview.',
      validation: (Rule) =>
        Rule.required()
          .min(20)
          .max(300)
          .warning('Keep quick summary under 300 characters for optimal hover card display.'),
    }),
    defineField({
      name: 'ruler',
      title: 'Ruling House or Overlord',
      type: 'reference',
      to: [{ type: 'house' }, { type: 'character' }],
      description: 'The noble house or sovereign reigning over this territory.',
    }),
    defineField({
      name: 'notableLandmarks',
      title: 'Notable Landmarks & Sub-structures',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g., "The Great Keep", "The Sept of Baelor", "The Godswood"',
    }),
    defineField({
      name: 'details',
      title: 'Detailed Chronicle & Architecture',
      type: 'portableText',
      description: 'Rich article body detailing geography, history, and defenses.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'region',
      media: 'image',
    },
  },
});
