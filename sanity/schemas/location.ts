import { defineField, defineType } from 'sanity';

/**
 * Sanity Schema: Location
 * Castles, realms, cities, and landmarks of the world.
 */
export const location = defineType({
  name: 'location',
  title: 'Location / Stronghold / Realm',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Location Name',
      type: 'string',
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
      name: 'region',
      title: 'Realm / Region',
      type: 'string',
      description: 'e.g., "The North", "Beyond the Wall", "The Reach"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'locationType',
      title: 'Location Type',
      type: 'string',
      description: 'e.g., "Castle / Fortress", "Metropolis / Port", "Ruins", "Natural Wonder"',
      initialValue: 'Castle / Fortress',
    }),
    defineField({
      name: 'ruler',
      title: 'Current Ruler / Ruling House',
      type: 'reference',
      to: [{ type: 'character' }, { type: 'house' }],
      description: 'The noble entity or lord holding stewardship over this place.',
    }),
    defineField({
      name: 'mapImage',
      title: 'Map Image / Architectural Depiction',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          initialValue: 'Map of location',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Cartographer notes / caption',
        },
      ],
      validation: (Rule) => Rule.required(),
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
      name: 'notableLocations',
      title: 'Key Landmarks & Sub-sites',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g., "The Crypts of Winterfell", "The Godswood", "The Broken Tower"',
    }),
    defineField({
      name: 'details',
      title: 'Architectural Details & Lore Description',
      type: 'portableText',
      description: 'Detailed geographical, defensive, and strategic chronicle.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'region',
      media: 'mapImage',
    },
  },
});
