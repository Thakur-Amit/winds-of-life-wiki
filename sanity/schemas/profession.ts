import { defineField, defineType } from 'sanity';

/**
 * Sanity Schema: Profession / Role
 * Categorizes characters into professions (Kings, Knights, Lords, Assassins, Maesters, etc.)
 * Dynamically populates sub-category cards on the directory page.
 */
export const profession = defineType({
  name: 'profession',
  title: 'Profession / Archetype',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Profession Name',
      type: 'string',
      description: 'e.g. "Kings & Queens", "Knights & Champions", "Lords & Nobles", "Assassins & Rogues", "Maesters & Scholars"',
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
      name: 'image',
      title: 'Card Background / Icon Image',
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
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      description: 'Brief summary of the role in the realm.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
});
