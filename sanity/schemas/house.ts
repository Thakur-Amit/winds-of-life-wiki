import { defineField, defineType } from 'sanity';

/**
 * Sanity Schema: House
 * Captures Great Houses, minor lordships, sigils, words, and ancestral heritage.
 */
export const house = defineType({
  name: 'house',
  title: 'Noble House / Dynasty',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'House Name',
      type: 'string',
      description: 'e.g., House Stark, House Targaryen, House Lannister',
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
      name: 'sigil',
      title: 'Coat of Arms / Sigil',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Heraldic Blazon Alt Text',
          initialValue: 'House heraldic sigil',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'motto',
      title: 'House Motto / Words',
      type: 'string',
      description: 'e.g., "Winter is Coming", "Fire and Blood", "Hear Me Roar!"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seat',
      title: 'Ancestral Seat / Stronghold',
      type: 'reference',
      to: [{ type: 'place' }, { type: 'location' }],
      description: 'Primary fortress or seat of power (e.g., Winterfell, Casterly Rock).',
    }),
    defineField({
      name: 'region',
      title: 'Geographical Realm / Region',
      type: 'string',
      description: 'e.g., "The North", "The Crownlands", "The Westerlands"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'currentLord',
      title: 'Current Head of House / Lord',
      type: 'reference',
      to: [{ type: 'character' }],
    }),
    defineField({
      name: 'ancestralWeapon',
      title: 'Ancestral Valyrian Steel Weapon / Relic',
      type: 'string',
      description: 'e.g., "Ice (greatsword)", "Blackfyre", "Brightroar"',
    }),
    defineField({
      name: 'founder',
      title: 'Legendary Founder',
      type: 'string',
      description: 'e.g., "Bran the Builder", "Aegon the Conqueror", "Lann the Clever"',
    }),
    defineField({
      name: 'quickSummary',
      title: 'Quick Summary (Used in Hover Cards & Search)',
      type: 'text',
      rows: 3,
      description: 'Concise summary shown on internal link hover preview cards.',
      validation: (Rule) => Rule.required().min(20).max(300),
    }),
    defineField({
      name: 'history',
      title: 'House History & Annals',
      type: 'portableText',
      description: 'Comprehensive historical lineage, wars fought, and alliances.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'motto',
      media: 'sigil',
    },
  },
});
