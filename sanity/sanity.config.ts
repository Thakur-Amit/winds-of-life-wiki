import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'worldbuilding-wiki',
  title: 'droplet-spire Codex Lore Studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'droplet-spire-codex-wiki',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('droplet-spire Worldbuilding Codex')
          .items([
            S.listItem()
              .title('Personages & Characters')
              .icon(() => '👤')
              .child(S.documentTypeList('character').title('All Characters')),

            S.listItem()
              .title('Noble Houses & Dynasties')
              .icon(() => '🛡️')
              .child(S.documentTypeList('house').title('Noble Houses')),

            S.listItem()
              .title('Kingdoms & Places')
              .icon(() => '🏰')
              .child(S.documentTypeList('place').title('Kingdoms, Places & Strongholds')),

            S.listItem()
              .title('Cultures & Traditions')
              .icon(() => '📜')
              .child(S.documentTypeList('culture').title('Cultures & Peoples')),

            S.listItem()
              .title('Historical Events & Wars')
              .icon(() => '⚔️')
              .child(S.documentTypeList('event').title('Historical Events & Battles')),

            S.listItem()
              .title('Magic & Arcane Artifacts')
              .icon(() => '✨')
              .child(S.documentTypeList('magic').title('Magic Disciplines & Artifacts')),

            S.listItem()
              .title('Bestiary & Mythical Species')
              .icon(() => '🐉')
              .child(S.documentTypeList('species').title('Mythical Species & Beasts')),

            S.listItem()
              .title('Books & Canonical Tomes')
              .icon(() => '📖')
              .child(S.documentTypeList('book').title('Books & Chronicles')),

            S.divider(),

            S.listItem()
              .title('Professions & Archetypes')
              .icon(() => '🏷️')
              .child(S.documentTypeList('profession').title('Professions & Archetypes')),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
