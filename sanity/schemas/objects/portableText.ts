import { defineType } from 'sanity';

/**
 * Standard Lore-Rich Portable Text Schema
 * Embeds standard typographic marks + custom internalLink annotations
 */
export const portableText = defineType({
  name: 'portableText',
  title: 'Lore Content & Biography',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal Paragraph', value: 'normal' },
        { title: 'Major Section (H2)', value: 'h2' },
        { title: 'Sub-section (H3)', value: 'h3' },
        { title: 'Detail Header (H4)', value: 'h4' },
        { title: 'In-Universe Chronicle / Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet List', value: 'bullet' },
        { title: 'Numbered Chronicle', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong / Bold', value: 'strong' },
          { title: 'Emphasis / Italic', value: 'em' },
          { title: 'In-Universe Codex Code', value: 'code' },
          { title: 'Underline', value: 'underline' },
          { title: 'Strikethrough', value: 'strike-through' },
        ],
        annotations: [
          {
            name: 'internalLink',
            type: 'internalLink',
            title: 'Internal Wiki Link',
          },
          {
            name: 'externalLink',
            type: 'object',
            title: 'External Web Reference',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule) =>
                  Rule.uri({
                    scheme: ['http', 'https', 'mailto'],
                  }),
              },
              {
                name: 'blank',
                type: 'boolean',
                title: 'Open in new tab',
                initialValue: true,
              },
            ],
          },
        ],
      },
    },
    {
      type: 'image',
      title: 'Historical Illustration / Map Snippet',
      options: { hotspot: true },
      fields: [
        {
          name: 'caption',
          type: 'string',
          title: 'Caption / Archival Note',
        },
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text for Accessibility',
          validation: (Rule) => Rule.required(),
        },
      ],
    },
  ],
});
