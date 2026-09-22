import { defineType } from 'sanity';

/**
 * Custom Internal Link Annotation for Sanity Portable Text
 * Allows editors to highlight text and link directly to a Character, House, Location, or Event.
 */
export const internalLink = defineType({
  name: 'internalLink',
  type: 'object',
  title: 'Internal Wiki Link',
  icon: () => '🔗',
  fields: [
    {
      name: 'reference',
      type: 'reference',
      title: 'Target Document',
      description: 'Select the character, house, location, or historical event to link to.',
      to: [
        { type: 'character' },
        { type: 'house' },
        { type: 'place' },
        { type: 'location' },
        { type: 'culture' },
        { type: 'event' },
        { type: 'magic' },
        { type: 'species' },
        { type: 'book' },
        { type: 'profession' },
      ],
      validation: (Rule) => Rule.required().error('An internal link must reference an existing wiki document.'),
      options: {
        disableNew: false,
        filter: ({ document }: any) => {
          // Prevent self-referencing if linking inside character or house doc
          if (document?._id) {
            return {
              filter: '!(_id in [$id, $draftId])',
              params: {
                id: document._id.replace('drafts.', ''),
                draftId: `drafts.${document._id.replace('drafts.', '')}`,
              },
            };
          }
          return {};
        },
      },
    },
  ],
});
