import {
  CharacterDoc,
  CharacterSection,
  HouseDoc,
  LocationDoc,
  PlaceDoc,
  CultureDoc,
  EventDoc,
  MagicDoc,
  SpeciesDoc,
  BookDoc,
  ProfessionDoc,
} from '../types/wiki';
import { getWorldTimeline } from './timelineData';

export function buildCharacterSections(
  data: Partial<Pick<CharacterDoc, 'appearance' | 'character' | 'history' | 'recentEvents' | 'sections' | 'quickSummary' | 'biography'>> = {}
): CharacterSection[] {
  const combinedSections: CharacterSection[] = [];
  const seenTitles = new Set<string>();

  const pushSection = (title: string, content?: string) => {
    if (!title || !content || !content.trim()) return;
    const normalizedTitle = title.trim();
    if (seenTitles.has(normalizedTitle.toLowerCase())) return;
    seenTitles.add(normalizedTitle.toLowerCase());
    combinedSections.push({ title: normalizedTitle, content: content.trim() });
  };

  const extractPortableTextText = (blocks: any[] | undefined): string => {
    if (!Array.isArray(blocks)) return '';
    return blocks
      .map((block: any) => {
        if (Array.isArray(block?.children)) {
          return block.children.map((child: any) => child?.text || '').join(' ');
        }
        if (typeof block?.text === 'string') return block.text;
        return '';
      })
      .filter(Boolean)
      .join('\n\n')
      .trim();
  };

  const fallbackBiographyText = extractPortableTextText((data as any)?.biography);
  const appearanceContent = [data.appearance, data.character].filter(Boolean).join('\n\n').trim();
  const historyContent = typeof data.history === 'string' ? data.history.trim() : (typeof data.history === 'object' ? extractPortableTextText(data.history as any) : '');
  const recentContent = typeof data.recentEvents === 'string' ? data.recentEvents.trim() : '';

  pushSection('Appearance and Character', appearanceContent || (data.quickSummary || fallbackBiographyText || ''));
  pushSection('History', historyContent || fallbackBiographyText || data.quickSummary || '');
  pushSection('Recent Events', recentContent || '');

  if (Array.isArray(data.sections)) {
    data.sections
      .filter((section) => section && typeof section.title === 'string' && typeof section.content === 'string')
      .forEach((section) => {
        pushSection(section.title, section.content);
      });
  }

  return combinedSections;
}

/**
 * Rich Lore-Heavy Dataset for A Wiki of Ice and Fire / Worldbuilding Wiki
 * Structured exactly as Sanity documents with dereferenced Portable Text markDefs.
 */

export const mockHouses: HouseDoc[] = [
  {
    _id: 'house-stark',
    _type: 'house',
    name: 'House Stark of Winterfell',
    slug: { current: 'house-stark' },
    sigil: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    motto: 'Winter is Coming',
    region: 'The North',
    seat: {
      _id: 'loc-winterfell',
      _type: 'location',
      name: 'Winterfell',
      slug: { current: 'winterfell' },
    },
    ancestralWeapon: 'Ice (Ancestral Valyrian steel greatsword)',
    founder: 'Brandon the Builder (Age of Heroes)',
    overlord: 'House Baratheon of King\'s Landing (de jure)',
    quickSummary:
      'House Stark of Winterfell is a Great House of Antos and the royal house of the North. Ruling from the great fortress of Winterfell, their sigil is a grey direwolf racing over a white field.',
    history: [
      {
        _type: 'block',
        _key: 'h1',
        style: 'normal',
        children: [
          {
            _key: 'c1',
            _type: 'span',
            text: 'House Stark traces its descent from Brandon the Builder, a legendary hero of the Age of Heroes who built ',
          },
          {
            _key: 'c2',
            _type: 'span',
            text: 'Winterfell',
            marks: ['link-winterfell'],
          },
          {
            _key: 'c3',
            _type: 'span',
            text: ' and the great Wall in the distant north. For millennia, the Starks ruled as Kings in the North until Torrhen Stark knelt to Aegon the Conqueror.',
          },
        ],
        markDefs: [
          {
            _type: 'internalLink',
            _key: 'link-winterfell',
            reference: {
              _ref: 'loc-winterfell',
              _type: 'location',
              name: 'Winterfell',
              slug: { current: 'winterfell' },
              region: 'The North',
              mapImage: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=600&auto=format&fit=crop&q=80',
              quickSummary: 'Winterfell is the ancestral castle and seat of power of House Stark, situated atop natural hot springs in the center of the North.',
            },
          },
        ],
      },
      {
        _type: 'block',
        _key: 'h2',
        style: 'blockquote',
        children: [
          {
            _key: 'c4',
            _type: 'span',
            text: '"Winter is Coming" — The words of House Stark are not a boast of honor or blood, but a grim warning of vigilance and mortality.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'h3',
        style: 'h2',
        children: [
          {
            _key: 'c5',
            _type: 'span',
            text: 'Role in Recent Conflicts',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'h4',
        style: 'normal',
        children: [
          {
            _key: 'c6',
            _type: 'span',
            text: 'During ',
          },
          {
            _key: 'c7',
            _type: 'span',
            text: "Robert's Rebellion",
            marks: ['link-roberts-rebellion'],
          },
          {
            _key: 'c8',
            _type: 'span',
            text: ', Lord ',
          },
          {
            _key: 'c9',
            _type: 'span',
            text: 'Eddard Stark',
            marks: ['link-eddard'],
          },
          {
            _key: 'c10',
            _type: 'span',
            text: ' united the Northern banners alongside House Baratheon after the brutal executions of his father Rickard and brother Brandon at King’s Landing.',
          },
        ],
        markDefs: [
          {
            _type: 'internalLink',
            _key: 'link-roberts-rebellion',
            reference: {
              _ref: 'event-roberts-rebellion',
              _type: 'event',
              name: "Robert's Rebellion",
              slug: { current: 'roberts-rebellion' },
              date: '282 AC – 283 AC',
              quickSummary: 'The continent-wide rebellion that toppled the 300-year Targaryen dynasty following the abduction of Lyanna Stark.',
            },
          },
          {
            _type: 'internalLink',
            _key: 'link-eddard',
            reference: {
              _ref: 'char-eddard-stark',
              _type: 'character',
              name: 'Eddard Stark',
              slug: { current: 'eddard-stark' },
              status: 'Deceased',
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
              quickSummary: 'Lord of Winterfell, Warden of the North, and Hand of the King to Robert I Baratheon. Renowned for unyielding honor.',
            },
          },
        ],
      },
    ],
  },
  {
    _id: 'house-targaryen',
    _type: 'house',
    name: 'House Targaryen of King\'s Landing',
    slug: { current: 'house-targaryen' },
    sigil: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
    motto: 'Fire and Blood',
    region: 'The Crownlands',
    seat: {
      _id: 'loc-kings-landing',
      _type: 'location',
      name: "King's Landing",
      slug: { current: 'kings-landing' },
    },
    ancestralWeapon: 'Blackfyre & Dark Sister (Valyrian steel longswords)',
    founder: 'Aegon I Targaryen (The Conqueror)',
    overlord: 'High Kingship of the Seven Kingdoms',
    quickSummary:
      'House Targaryen is a noble family of Valyrian descent who escaped the Doom. For nearly three centuries, they ruled the Seven Kingdoms with their terrifying winged dragons.',
    history: [
      {
        _type: 'block',
        _key: 'th1',
        style: 'normal',
        children: [
          {
            _key: 'tc1',
            _type: 'span',
            text: 'House Targaryen fled Valyria twelve years before the Cataclysm known as the Doom, settling upon the volcanic redoubt of Dragonstone. United by the will of Aegon the Conqueror and his sister-wives Visenya and Rhaenys, the dragons melted swords into the Iron Throne.',
          },
        ],
      },
    ],
  },
];

export const mockLocations: LocationDoc[] = [
  {
    _id: 'loc-winterfell',
    _type: 'location',
    name: 'Winterfell',
    slug: { current: 'winterfell' },
    region: 'The North',
    locationType: 'Ancient Fortress & droplet-spire',
    ruler: {
      _id: 'house-stark',
      _type: 'house',
      name: 'House Stark',
      slug: { current: 'house-stark' },
    },
    mapImage: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=600&auto=format&fit=crop&q=80',
    quickSummary:
      'Winterfell is the ancient ancestral castle and seat of power of House Stark. Situated in the heart of the North, it is defended by double granite curtain walls and warmed by subterranean hot springs.',
    notableLocations: [
      'The Great Keep',
      'The Ancient Godswood & Heart Tree',
      'The Deep Crypts of Winterfell',
      'The Broken Tower',
      'The Glass Gardens',
    ],
    details: [
      {
        _type: 'block',
        _key: 'w1',
        style: 'normal',
        children: [
          {
            _key: 'wc1',
            _type: 'span',
            text: 'Built atop geothermal hot springs, Winterfell’s stone halls remain temperate even amidst brutal multi-year blizzards. Its oldest courtyard cradles an ancient three-acre Godswood centered upon an ancient weirwood Heart Tree with carved crimson weeping eyes.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'w2',
        style: 'h2',
        children: [
          {
            _key: 'wc2',
            _type: 'span',
            text: 'The Crypts of the Kings in the North',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'w3',
        style: 'normal',
        children: [
          {
            _key: 'wc3',
            _type: 'span',
            text: 'Descending deep beneath the foundations lie subterranean tombs where stone statues of ',
          },
          {
            _key: 'wc4',
            _type: 'span',
            text: 'Eddard Stark',
            marks: ['link-ned'],
          },
          {
            _key: 'wc5',
            _type: 'span',
            text: ', Lyanna Stark, and their ancient ancestors sit with iron longswords laid across their knees to keep the vengeful spirits at rest.',
          },
        ],
        markDefs: [
          {
            _type: 'internalLink',
            _key: 'link-ned',
            reference: {
              _ref: 'char-eddard-stark',
              _type: 'character',
              name: 'Eddard Stark',
              slug: { current: 'eddard-stark' },
              status: 'Deceased',
              quickSummary: 'Lord of Winterfell and Hand of the King whose tragic execution sparked the War of the Five Kings.',
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
            },
          },
        ],
      },
    ],
  },
  {
    _id: 'loc-kings-landing',
    _type: 'location',
    name: "King's Landing",
    slug: { current: 'kings-landing' },
    region: 'The Crownlands',
    locationType: 'Royal Capital & Port City',
    ruler: {
      _id: 'house-targaryen',
      _type: 'house',
      name: 'House Targaryen / Baratheon',
      slug: { current: 'house-targaryen' },
    },
    mapImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    quickSummary:
      'King’s Landing is the capital of the Seven Kingdoms, home to the Iron Throne, the Red Keep, and the Great Sept of Baelor upon the Blackwater Bay.',
    notableLocations: [
      'The Red Keep & Maegor’s Holdfast',
      'The Iron Throne Room',
      'The Great Sept of Baelor',
      'The Dragonpit ruins',
      'Flea Bottom slum',
    ],
    details: [
      {
        _type: 'block',
        _key: 'kl1',
        style: 'normal',
        children: [
          {
            _key: 'klc1',
            _type: 'span',
            text: 'Founded by Aegon the Conqueror upon the spot where he first made landfall, King’s Landing is a bustling, pungent coastal metropolis overlooking Blackwater Bay.',
          },
        ],
      },
    ],
  },
];

export const mockEvents: EventDoc[] = [
  {
    _id: 'event-roberts-rebellion',
    _type: 'event',
    name: "Robert's Rebellion",
    slug: { current: 'roberts-rebellion' },
    date: '282 AC – 283 AC',
    location: {
      _id: 'loc-kings-landing',
      _type: 'location',
      name: "King's Landing",
      slug: { current: 'kings-landing' },
    },
    involvedParties: [
      {
        _id: 'char-eddard-stark',
        _type: 'character',
        name: 'Eddard Stark',
        slug: { current: 'eddard-stark' },
        side: 'Rebel Alliance Commander',
      },
      {
        _id: 'house-stark',
        _type: 'house',
        name: 'House Stark',
        slug: { current: 'house-stark' },
        side: 'Rebel High House',
      },
      {
        _id: 'house-targaryen',
        _type: 'house',
        name: 'House Targaryen',
        slug: { current: 'house-targaryen' },
        side: 'Royalist Defenders',
      },
    ],
    outcome: 'Decisive Rebel victory. Overthrow and near-extinction of House Targaryen; Robert Baratheon ascends the Iron Throne.',
    quickSummary:
      'The continent-wide insurrection triggered by Prince Rhaegar Targaryen’s disappearance with Lyanna Stark and King Aerys II’s execution of Lord Rickard Stark.',
    description: [
      {
        _type: 'block',
        _key: 'rb1',
        style: 'normal',
        children: [
          {
            _key: 'rbc1',
            _type: 'span',
            text: "Also known as the War of the Usurper, Robert's Rebellion shook the foundations of Antos. When the Mad King Aerys demanded the heads of young ",
          },
          {
            _key: 'rbc2',
            _type: 'span',
            text: 'Eddard Stark',
            marks: ['link-ned-event'],
          },
          {
            _key: 'rbc3',
            _type: 'span',
            text: ' and Robert Baratheon, Lord Jon Arryn raised his banners in defiance, forging the grand coalition of the North, Vale, and Riverlands.',
          },
        ],
        markDefs: [
          {
            _type: 'internalLink',
            _key: 'link-ned-event',
            reference: {
              _ref: 'char-eddard-stark',
              _type: 'character',
              name: 'Eddard Stark',
              slug: { current: 'eddard-stark' },
              status: 'Deceased',
              quickSummary: 'Key general in Robert’s Rebellion who liberated Storm’s End and lifted the siege of the Tower of Joy.',
            },
          },
        ],
      },
    ],
  },
  {
    _id: 'event-tourney-harrenhal',
    _type: 'event',
    name: 'Tourney at Harrenhal',
    slug: { current: 'tourney-harrenhal' },
    date: '281 AC (The Year of the False Spring)',
    involvedParties: [
      {
        _id: 'char-eddard-stark',
        _type: 'character',
        name: 'Eddard Stark',
        slug: { current: 'eddard-stark' },
      },
      {
        _id: 'house-targaryen',
        _type: 'house',
        name: 'House Targaryen',
        slug: { current: 'house-targaryen' },
      },
    ],
    outcome: 'Crown of winter roses placed in Lyanna Stark’s lap by Prince Rhaegar, sparking the chain of events leading to war.',
    quickSummary:
      'A legendary tourney held at Harrenhal during the Year of the False Spring, renowned as the fateful gathering that ignited the fall of the dragons.',
    description: [
      {
        _type: 'block',
        _key: 'th1',
        style: 'normal',
        children: [
          {
            _key: 'thc1',
            _type: 'span',
            text: 'Hosted by Lord Walter Whent, knights and lords from across all Seven Kingdoms converged on the colossal melted towers of Harrenhal for feats of chivalry and secret councils.',
          },
        ],
      },
    ],
  },
];

export const mockCharacters: CharacterDoc[] = [
  {
    _id: 'char-eddard-stark',
    _type: 'character',
    name: 'Eddard Stark',
    slug: { current: 'eddard-stark' },
    titles: [
      'Lord of Winterfell',
      'Warden of the North',
      'Hand of the King',
      'Regent & Protector of the Realm',
    ],
    aliases: ['Ned', 'The Quiet Wolf', 'Lord Snow’s Father'],
    house: {
      _id: 'house-stark',
      _type: 'house',
      name: 'House Stark of Winterfell',
      slug: { current: 'house-stark' },
      sigil: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    },
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    age: '35 (at death, 298 AC)',
    status: 'Deceased',
    culture: 'Northmen / First Men',
    born: '263 AC, at Winterfell',
    died: "298 AC, at Great Sept of Baelor, King's Landing",
    allegiance: 'House Stark, House Baratheon, The North',
    quickSummary:
      'Lord of Winterfell, Warden of the North, and Hand of the King to Robert I Baratheon. Renowned throughout the Seven Kingdoms for his solemn demeanor and unwavering commitment to northern honor.',
    father: { _id: 'char-rickard-stark', name: 'Rickard Stark', slug: { current: 'rickard-stark' } },
    mother: { _id: 'char-lyarra-stark', name: 'Lyarra Stark', slug: { current: 'lyarra-stark' } },
    spouse: { _id: 'char-catelyn-tully', name: 'Catelyn Tully', slug: { current: 'catelyn-tully' } },
    children: [
      { _id: 'char-robb-stark', name: 'Robb Stark', slug: { current: 'robb-stark' } },
      { _id: 'char-sansa-stark', name: 'Sansa Stark', slug: { current: 'sansa-stark' } },
      { _id: 'char-arya-stark', name: 'Arya Stark', slug: { current: 'arya-stark' } },
      { _id: 'char-bran-stark', name: 'Bran Stark', slug: { current: 'bran-stark' } },
      { _id: 'char-rickon-stark', name: 'Rickon Stark', slug: { current: 'rickon-stark' } },
      { _id: 'char-jon-snow', name: 'Jon Snow (acknowledged bastard)', slug: { current: 'jon-snow' } },
    ],
    biography: [
      {
        _type: 'block',
        _key: 'bio1',
        style: 'normal',
        children: [
          {
            _key: 's1',
            _type: 'span',
            text: 'Lord ',
          },
          {
            _key: 's2',
            _type: 'span',
            text: 'Eddard Stark',
            marks: ['strong'],
          },
          {
            _key: 's3',
            _type: 'span',
            text: ', colloquially known as Ned, was the head of ',
          },
          {
            _key: 's4',
            _type: 'span',
            text: 'House Stark',
            marks: ['link-stark'],
          },
          {
            _key: 's5',
            _type: 'span',
            text: ' and Lord of ',
          },
          {
            _key: 's6',
            _type: 'span',
            text: 'Winterfell',
            marks: ['link-winterfell-bio'],
          },
          {
            _key: 's7',
            _type: 'span',
            text: '. A quiet and solemn ruler who valued duty above ambition, he governed the vast domain of the North with stern fairness for nearly two decades.',
          },
        ],
        markDefs: [
          {
            _type: 'internalLink',
            _key: 'link-stark',
            reference: {
              _ref: 'house-stark',
              _type: 'house',
              name: 'House Stark of Winterfell',
              slug: { current: 'house-stark' },
              sigil: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
              motto: 'Winter is Coming',
              quickSummary: 'The ruling noble Great House of the North, seated in Winterfell since the Age of Heroes.',
            },
          },
          {
            _type: 'internalLink',
            _key: 'link-winterfell-bio',
            reference: {
              _ref: 'loc-winterfell',
              _type: 'location',
              name: 'Winterfell',
              slug: { current: 'winterfell' },
              region: 'The North',
              mapImage: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=600&auto=format&fit=crop&q=80',
              quickSummary: 'The heart and fortress of the North, protected by geothermal hot springs and monumental double walls.',
            },
          },
        ],
      },
      {
        _type: 'block',
        _key: 'bio2',
        style: 'blockquote',
        children: [
          {
            _key: 'bq1',
            _type: 'span',
            text: '"The man who passes the sentence should swing the sword. If you would take a man\'s life, you owe it to him to look into his eyes and hear his final words."',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'bio3',
        style: 'h2',
        children: [
          {
            _key: 'h2_1',
            _type: 'span',
            text: 'Early Life & Rebellion',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'bio4',
        style: 'normal',
        children: [
          {
            _key: 's8',
            _type: 'span',
            text: 'As a second son, Ned was fostered at the Eyrie under Lord Jon Arryn alongside Robert Baratheon. The bond between them was cemented in blood during ',
          },
          {
            _key: 's9',
            _type: 'span',
            text: "Robert's Rebellion",
            marks: ['link-rebellion-bio'],
          },
          {
            _key: 's10',
            _type: 'span',
            text: ', which ignited after King Aerys II burned Ned’s father Rickard and strangled his elder brother Brandon. Following the war, Ned returned north carrying an infant bastard named ',
          },
          {
            _key: 's11',
            _type: 'span',
            text: 'Jon Snow',
            marks: ['link-jon-bio'],
          },
          {
            _key: 's12',
            _type: 'span',
            text: ', swearing an unbreakable oath to his dying sister Lyanna at the Tower of Joy.',
          },
        ],
        markDefs: [
          {
            _type: 'internalLink',
            _key: 'link-rebellion-bio',
            reference: {
              _ref: 'event-roberts-rebellion',
              _type: 'event',
              name: "Robert's Rebellion",
              slug: { current: 'roberts-rebellion' },
              date: '282 AC – 283 AC',
              quickSummary: 'The grand civil war that overthrew King Aerys II Targaryen and put Robert Baratheon on the Iron Throne.',
            },
          },
          {
            _type: 'internalLink',
            _key: 'link-jon-bio',
            reference: {
              _ref: 'char-jon-snow',
              _type: 'character',
              name: 'Jon Snow',
              slug: { current: 'jon-snow' },
              status: 'Resurrected',
              image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
              quickSummary: 'The 998th Lord Commander of the Night’s Watch, crowned King in the North, and secret trueborn son of Rhaegar Targaryen and Lyanna Stark.',
            },
          },
        ],
      },
      {
        _type: 'block',
        _key: 'bio5',
        style: 'h2',
        children: [
          {
            _key: 'h2_2',
            _type: 'span',
            text: "Hand of the King & Downfall in King's Landing",
          },
        ],
      },
      {
        _type: 'block',
        _key: 'bio6',
        style: 'normal',
        children: [
          {
            _key: 's13',
            _type: 'span',
            text: 'Following the suspicious death of Jon Arryn, King Robert rode north to ',
          },
          {
            _key: 's14',
            _type: 'span',
            text: 'Winterfell',
            marks: ['link-winterfell-bio2'],
          },
          {
            _key: 's15',
            _type: 'span',
            text: " to beseech Ned to serve as Hand of the King. Reluctantly accepting, Ned journeyed south to ",
          },
          {
            _key: 's16',
            _type: 'span',
            text: "King's Landing",
            marks: ['link-kl-bio'],
          },
          {
            _key: 's17',
            _type: 'span',
            text: ', where he uncovered the incestuous parentage of Queen Cersei Lannister’s children. His mercy in giving Cersei warning proved fatal, culminating in his tragic public beheading before the Great Sept of Baelor.',
          },
        ],
        markDefs: [
          {
            _type: 'internalLink',
            _key: 'link-winterfell-bio2',
            reference: {
              _ref: 'loc-winterfell',
              _type: 'location',
              name: 'Winterfell',
              slug: { current: 'winterfell' },
              quickSummary: 'Ancestral seat of House Stark in the heart of the North.',
            },
          },
          {
            _type: 'internalLink',
            _key: 'link-kl-bio',
            reference: {
              _ref: 'loc-kings-landing',
              _type: 'location',
              name: "King's Landing",
              slug: { current: 'kings-landing' },
              quickSummary: 'The royal capital city of the Seven Kingdoms, perched on Blackwater Bay.',
            },
          },
        ],
      },
    ],
  },
  {
    _id: 'char-jon-snow',
    _type: 'character',
    name: 'Jon Snow',
    slug: { current: 'jon-snow' },
    titles: [
      '998th Lord Commander of the Night’s Watch',
      'King in the North',
      'Warden of the North',
      'Aegon Targaryen (trueborn heir)',
    ],
    aliases: ['The White Wolf', 'Lord Snow', 'The Bastard of Winterfell'],
    house: {
      _id: 'house-stark',
      _type: 'house',
      name: 'House Stark / House Targaryen',
      slug: { current: 'house-stark' },
      sigil: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    },
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    age: '22 (at 305 AC)',
    status: 'Resurrected',
    culture: 'Northmen / Valyrian',
    born: '283 AC, at Tower of Joy, Dorne',
    allegiance: "The Night's Watch, House Stark",
    quickSummary:
      'Raised as the bastard son of Eddard Stark at Winterfell, Jon Snow joined the Night’s Watch, rose to 998th Lord Commander, and was resurrected to lead humanity against the Night King.',
    father: { _id: 'char-rhaegar-targaryen', name: 'Rhaegar Targaryen', slug: { current: 'rhaegar-targaryen' } },
    mother: { _id: 'char-lyanna-stark', name: 'Lyanna Stark', slug: { current: 'lyanna-stark' } },
    biography: [
      {
        _type: 'block',
        _key: 'jb1',
        style: 'normal',
        children: [
          {
            _key: 'jc1',
            _type: 'span',
            text: 'Believed for most of his life to be the bastard son of Lord ',
          },
          {
            _key: 'jc2',
            _type: 'span',
            text: 'Eddard Stark',
            marks: ['link-ned-jon'],
          },
          {
            _key: 'jc3',
            _type: 'span',
            text: ', Jon was raised in ',
          },
          {
            _key: 'jc4',
            _type: 'span',
            text: 'Winterfell',
            marks: ['link-wf-jon'],
          },
          {
            _key: 'jc5',
            _type: 'span',
            text: ' alongside his trueborn cousins Robb, Sansa, Arya, and Bran. Upon reaching manhood, he rode north to take the black at the Wall.',
          },
        ],
        markDefs: [
          {
            _type: 'internalLink',
            _key: 'link-ned-jon',
            reference: {
              _ref: 'char-eddard-stark',
              _type: 'character',
              name: 'Eddard Stark',
              slug: { current: 'eddard-stark' },
              status: 'Deceased',
              quickSummary: 'Lord of Winterfell who sheltered and raised Jon at great personal cost to protect him from King Robert.',
            },
          },
          {
            _type: 'internalLink',
            _key: 'link-wf-jon',
            reference: {
              _ref: 'loc-winterfell',
              _type: 'location',
              name: 'Winterfell',
              slug: { current: 'winterfell' },
              quickSummary: 'Ancestral home of House Stark.',
            },
          },
        ],
      },
    ],
  },
  {
    _id: 'char-robb-stark',
    _type: 'character',
    name: 'Robb Stark',
    slug: { current: 'robb-stark' },
    titles: ['King in the North', 'King of the Trident', 'Lord of Winterfell'],
    aliases: ['The Young Wolf'],
    house: {
      _id: 'house-stark',
      _type: 'house',
      name: 'House Stark of Winterfell',
      slug: { current: 'house-stark' },
    },
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    age: '16 (at death, 299 AC)',
    status: 'Deceased',
    culture: 'Northmen',
    born: '283 AC, at Riverrun',
    died: '299 AC, at The Twins (The Red Wedding)',
    allegiance: 'House Stark, The Kingdom of the North and the Trident',
    quickSummary:
      'The eldest legitimate son of Eddard Stark. Proclaimed King in the North by his bannermen, Robb was undefeated in battle until his betrayal and assassination at the Red Wedding.',
    father: { _id: 'char-eddard-stark', name: 'Eddard Stark', slug: { current: 'eddard-stark' } },
    mother: { _id: 'char-catelyn-tully', name: 'Catelyn Tully', slug: { current: 'catelyn-tully' } },
    biography: [
      {
        _type: 'block',
        _key: 'rb_b1',
        style: 'normal',
        children: [
          {
            _key: 'r1',
            _type: 'span',
            text: 'When Lord ',
          },
          {
            _key: 'r2',
            _type: 'span',
            text: 'Eddard Stark',
            marks: ['link-ned-robb'],
          },
          {
            _key: 'r3',
            _type: 'span',
            text: ' was arrested in ',
          },
          {
            _key: 'r4',
            _type: 'span',
            text: "King's Landing",
            marks: ['link-kl-robb'],
          },
          {
            _key: 'r5',
            _type: 'span',
            text: ', Robb called the Northern banners and marched south, winning every tactical engagement against the formidable armies of House Lannister.',
          },
        ],
        markDefs: [
          {
            _type: 'internalLink',
            _key: 'link-ned-robb',
            reference: {
              _ref: 'char-eddard-stark',
              _type: 'character',
              name: 'Eddard Stark',
              slug: { current: 'eddard-stark' },
              quickSummary: 'Father of Robb Stark.',
            },
          },
          {
            _type: 'internalLink',
            _key: 'link-kl-robb',
            reference: {
              _ref: 'loc-kings-landing',
              _type: 'location',
              name: "King's Landing",
              slug: { current: 'kings-landing' },
              quickSummary: 'Capital of the Seven Kingdoms.',
            },
          },
        ],
      },
    ],
  },
  {
    _id: 'char-sansa-stark',
    _type: 'character',
    name: 'Sansa Stark',
    slug: { current: 'sansa-stark' },
    titles: ['Queen in the North', 'Lady of Winterfell'],
    aliases: ['Little Bird', 'Alayne Stone'],
    house: {
      _id: 'house-stark',
      _type: 'house',
      name: 'House Stark of Winterfell',
      slug: { current: 'house-stark' },
    },
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    age: '20 (at 305 AC)',
    status: 'Alive',
    culture: 'Northmen / Riverlands',
    born: '286 AC, at Winterfell',
    allegiance: 'House Stark',
    quickSummary:
      'Eldest daughter of Eddard Stark. Enduring years of captive abuse in King’s Landing, she evolved into a master political strategist and was crowned Queen in an independent North.',
    father: { _id: 'char-eddard-stark', name: 'Eddard Stark', slug: { current: 'eddard-stark' } },
    mother: { _id: 'char-catelyn-tully', name: 'Catelyn Tully', slug: { current: 'catelyn-tully' } },
    biography: [
      {
        _type: 'block',
        _key: 'sb1',
        style: 'normal',
        children: [
          {
            _key: 's1',
            _type: 'span',
            text: 'Sansa Stark began her journey dreaming of chivalrous knights and southern courts, but endured the cruelty of King Joffrey and the Machiavellian schemes of Petyr Baelish before reclaiming her birthright at Winterfell.',
          },
        ],
      },
    ],
  },
  {
    _id: 'char-arya-stark',
    _type: 'character',
    name: 'Arya Stark',
    slug: { current: 'arya-stark' },
    titles: ['Princess of Winterfell', 'Faceless Assassin of the House of Black and White'],
    aliases: ['Arry', 'No One', 'Cat of the Canals', 'Mercy'],
    house: {
      _id: 'house-stark',
      _type: 'house',
      name: 'House Stark of Winterfell',
      slug: { current: 'house-stark' },
    },
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    age: '18 (at 305 AC)',
    status: 'Alive',
    culture: 'Northmen',
    born: '289 AC, at Winterfell',
    allegiance: 'House Stark',
    quickSummary:
      'The fiercely independent younger daughter of Eddard Stark. Trained by the water dancers of Braavos and the Faceless Men, she avenged the Red Wedding and slew the Night King.',
    father: { _id: 'char-eddard-stark', name: 'Eddard Stark', slug: { current: 'eddard-stark' } },
    mother: { _id: 'char-catelyn-tully', name: 'Catelyn Tully', slug: { current: 'catelyn-tully' } },
    biography: [
      {
        _type: 'block',
        _key: 'ab1',
        style: 'normal',
        children: [
          {
            _key: 'ac1',
            _type: 'span',
            text: 'Rejecting the traditional courtly roles of noble ladies, Arya embraced swordcraft with her Valyrian-adjacent rapier Needle, gifted to her by her half-brother Jon Snow.',
          },
        ],
      },
    ],
  },
  {
    _id: 'char-bran-stark',
    _type: 'character',
    name: 'Bran Stark',
    slug: { current: 'bran-stark' },
    titles: ['The Three-Eyed Raven', 'King of the Andals and the First Men', 'Lord of the Six Kingdoms'],
    aliases: ['Bran the Broken', 'The Winged Wolf'],
    house: {
      _id: 'house-stark',
      _type: 'house',
      name: 'House Stark of Winterfell',
      slug: { current: 'house-stark' },
    },
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
    age: '17 (at 305 AC)',
    status: 'Alive',
    culture: 'Northmen',
    born: '290 AC, at Winterfell',
    allegiance: 'The Realm',
    quickSummary:
      'Paralyzed after being pushed from the Broken Tower of Winterfell, Bran journeyed beyond the Wall to unlock the greenseeing powers of the Three-Eyed Raven.',
    father: { _id: 'char-eddard-stark', name: 'Eddard Stark', slug: { current: 'eddard-stark' } },
    mother: { _id: 'char-catelyn-tully', name: 'Catelyn Tully', slug: { current: 'catelyn-tully' } },
    biography: [
      {
        _type: 'block',
        _key: 'bb1',
        style: 'normal',
        children: [
          {
            _key: 'bc1',
            _type: 'span',
            text: 'Gifted with the rare northern magic of skinchanging and greenseeing, Bran penetrated the veil of history to discover the true identity of Jon Snow and the ancient origins of the White Walkers.',
          },
        ],
      },
    ],
  },
  {
    _id: 'char-rickard-stark',
    _type: 'character',
    name: 'Rickard Stark',
    slug: { current: 'rickard-stark' },
    titles: ['Lord of Winterfell', 'Warden of the North'],
    aliases: ['The Southern Ambitions Lord'],
    house: {
      _id: 'house-stark',
      _type: 'house',
      name: 'House Stark',
      slug: { current: 'house-stark' },
    },
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
    age: '50 (at death, 282 AC)',
    status: 'Deceased',
    culture: 'Northmen',
    born: '232 AC',
    died: "282 AC, at King's Landing (burned by wildfire)",
    quickSummary:
      'Lord of Winterfell and father of Brandon, Eddard, Lyanna, and Benjen Stark. Executed in King’s Landing by the Mad King Aerys II Targaryen.',
    biography: [
      {
        _type: 'block',
        _key: 'rick_b1',
        style: 'normal',
        children: [
          {
            _key: 'rc1',
            _type: 'span',
            text: 'Lord Rickard forged southern marital alliances to bolster Northern influence, betrothing Brandon to Catelyn Tully and Lyanna to Robert Baratheon. When summoned by King Aerys II to answer for Brandon’s actions, Rickard demanded trial by combat; Aerys declared fire to be the champion of House Targaryen and burned Rickard alive suspended over wildfire.',
          },
        ],
      },
    ],
  },
  {
    _id: 'char-lyanna-stark',
    _type: 'character',
    name: 'Lyanna Stark',
    slug: { current: 'lyanna-stark' },
    titles: ['Princess of Winterfell'],
    aliases: ['The She-Wolf', 'The Knight of the Laughing Tree (theorized)'],
    house: {
      _id: 'house-stark',
      _type: 'house',
      name: 'House Stark',
      slug: { current: 'house-stark' },
    },
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
    age: '16 (at death, 283 AC)',
    status: 'Deceased',
    culture: 'Northmen',
    born: '267 AC, at Winterfell',
    died: '283 AC, at Tower of Joy, Dorne',
    quickSummary:
      'The fierce only daughter of Lord Rickard Stark and beloved sister of Ned. Crowned Queen of Love and Beauty by Prince Rhaegar Targaryen, her disappearance led to Robert’s Rebellion.',
    father: { _id: 'char-rickard-stark', name: 'Rickard Stark', slug: { current: 'rickard-stark' } },
    spouse: { _id: 'char-rhaegar-targaryen', name: 'Rhaegar Targaryen', slug: { current: 'rhaegar-targaryen' } },
    children: [{ _id: 'char-jon-snow', name: 'Jon Snow / Aegon Targaryen', slug: { current: 'jon-snow' } }],
    biography: [
      {
        _type: 'block',
        _key: 'ly1',
        style: 'normal',
        children: [
          {
            _key: 'lc1',
            _type: 'span',
            text: 'Renowned for wild northern courage and peerless horsemanship, Lyanna captured the heart of Prince Rhaegar at the Tourney at Harrenhal. She died in childbed at the Tower of Joy after giving birth to Jon Snow, extracting Ned’s eternal promise to keep the child safe.',
          },
        ],
      },
    ],
  },
  {
    _id: 'char-rhaegar-targaryen',
    _type: 'character',
    name: 'Rhaegar Targaryen',
    slug: { current: 'rhaegar-targaryen' },
    titles: ['Prince of Dragonstone', 'Crown Prince of the Seven Kingdoms'],
    aliases: ['The Last Dragon', 'The Silver Prince'],
    house: {
      _id: 'house-targaryen',
      _type: 'house',
      name: 'House Targaryen',
      slug: { current: 'house-targaryen' },
    },
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    age: '24 (at death, 283 AC)',
    status: 'Deceased',
    culture: 'Valyrian',
    born: '259 AC, at Summerhall',
    died: '283 AC, at the Trident (slain by Robert Baratheon)',
    quickSummary:
      'Heir to the Iron Throne and eldest son of King Aerys II. Melancholic scholar and master harpist, his obsession with the "Prince That Was Promised" prophecy catalyzed the fall of his dynasty.',
    spouse: { _id: 'char-lyanna-stark', name: 'Lyanna Stark (annulled Elia Martell)', slug: { current: 'lyanna-stark' } },
    children: [{ _id: 'char-jon-snow', name: 'Aegon Targaryen (Jon Snow)', slug: { current: 'jon-snow' } }],
    biography: [
      {
        _type: 'block',
        _key: 'rh1',
        style: 'normal',
        children: [
          {
            _key: 'rc1',
            _type: 'span',
            text: 'Prince Rhaegar was deeply loved by the smallfolk and lords alike. He fell in single combat against Robert Baratheon at the Battle of the Trident, his ruby-encrusted breastplate shattered into the swirling waters.',
          },
        ],
      },
    ],
  },
  {
    _id: 'char-daenerys-targaryen',
    _type: 'character',
    name: 'Daenerys Targaryen',
    slug: { current: 'daenerys-targaryen' },
    titles: [
      'Mother of Dragons',
      'Queen of the Andals and the First Men',
      'Khaleesi of the Great Grass Sea',
      'The Unburnt',
      'Breaker of Chains',
    ],
    aliases: ['Dany', 'Stormborn', 'The Silver Queen'],
    house: {
      _id: 'house-targaryen',
      _type: 'house',
      name: 'House Targaryen',
      slug: { current: 'house-targaryen' },
    },
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    age: '23 (at 305 AC)',
    status: 'Deceased',
    culture: 'Valyrian',
    born: '284 AC, at Dragonstone during a raging summer storm',
    allegiance: 'House Targaryen',
    quickSummary:
      'The younger sister of Rhaegar Targaryen who hatched three petrified dragon eggs in the funeral pyre of Khal Drogo, reborn as the Mother of Dragons to reconquer Antos.',
    biography: [
      {
        _type: 'block',
        _key: 'dt1',
        style: 'normal',
        children: [
          {
            _key: 'dc1',
            _type: 'span',
            text: 'Born in exile amidst the ruins of her family’s empire, Daenerys traversed the Red Waste, liberated the slaver cities of Eclind, and forged a massive armada to reclaim the Iron Throne.',
          },
        ],
      },
    ],
  },
  {
    _id: 'char-tyrion-lannister',
    _type: 'character',
    name: 'Tyrion Lannister',
    slug: { current: 'tyrion-lannister' },
    titles: ['Hand of the King', 'Hand of the Queen', 'Master of Coin', 'Lord of Casterly Rock'],
    aliases: ['The Imp', 'The Halfman', 'Yollo', 'Hugor Hill'],
    house: {
      _id: 'house-lannister',
      _type: 'house',
      name: 'House Lannister of Casterly Rock',
      slug: { current: 'house-lannister' },
    },
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    age: '32 (at 300 AC)',
    status: 'Alive',
    culture: 'Westerman',
    born: '273 AC, Casterly Rock',
    allegiance: 'House Lannister',
    quickSummary:
      'The youngest child of Lord Tywin Lannister and younger brother of Cersei and Jaime. Renowned for his sharp wit, intellect, and survival instincts in a realm hostile to his dwarfism.',
    biography: [
      {
        _type: 'block',
        _key: 'ty1',
        style: 'normal',
        children: [
          {
            _key: 'tyc1',
            _type: 'span',
            text: 'Though mocked as "The Imp", Tyrion possessed the cunning mind of his father Tywin. He devised the wildfire chain defense during the Battle of the Blackwater and later served as counselor to Queen Daenerys Targaryen.',
          },
        ],
      },
    ],
  },
  {
    _id: 'char-jaime-lannister',
    _type: 'character',
    name: 'Jaime Lannister',
    slug: { current: 'jaime-lannister' },
    titles: ['Lord Commander of the Kingsguard', 'Ser', 'The Kingslayer'],
    aliases: ['The Kingslayer', 'The Lion of Lannister', 'Goldenhand'],
    house: {
      _id: 'house-lannister',
      _type: 'house',
      name: 'House Lannister of Casterly Rock',
      slug: { current: 'house-lannister' },
    },
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    age: '36 (at 300 AC)',
    status: 'Deceased',
    culture: 'Westerman',
    born: '266 AC, Casterly Rock',
    allegiance: 'House Lannister',
    quickSummary:
      'The twin brother of Cersei Lannister and one of the realm’s most formidable swordsmen, infamous for slaying the Mad King Aerys II Targaryen despite his sacred Kingsguard vows.',
    biography: [
      {
        _type: 'block',
        _key: 'jl1',
        style: 'normal',
        children: [
          {
            _key: 'jlc1',
            _type: 'span',
            text: 'Raised to the Kingsguard at fifteen by King Aerys II, Jaime earned universal scorn when he ran the Mad King through to save King’s Landing from wildfire devastation.',
          },
        ],
      },
    ],
  },
  {
    _id: 'char-cersei-lannister',
    _type: 'character',
    name: 'Cersei Lannister',
    slug: { current: 'cersei-lannister' },
    titles: ['Queen of the Seven Kingdoms', 'Queen Regent', 'Lady of Casterly Rock', 'Protector of the Realm'],
    aliases: ['The Queen Mother', 'Light of the West'],
    house: {
      _id: 'house-lannister',
      _type: 'house',
      name: 'House Lannister of Casterly Rock',
      slug: { current: 'house-lannister' },
    },
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    age: '36 (at 300 AC)',
    status: 'Deceased',
    culture: 'Westerman',
    born: '266 AC, Casterly Rock',
    allegiance: 'House Lannister',
    quickSummary:
      'Queen Consort of King Robert Baratheon and later Queen Regnant of the Seven Kingdoms. Fiercely protective of her children, Cersei steered the realm into ruinous political conflict.',
    biography: [
      {
        _type: 'block',
        _key: 'cl1',
        style: 'normal',
        children: [
          {
            _key: 'clc1',
            _type: 'span',
            text: 'Cersei Lannister navigated court intrigue with ruthless conviction. Driven by a childhood prophecy whispered by Maggy the Frog, her paranoia accelerated her downfall in King’s Landing.',
          },
        ],
      },
    ],
  },
  {
    _id: 'char-robert-baratheon',
    _type: 'character',
    name: 'Robert Baratheon',
    slug: { current: 'robert-baratheon' },
    titles: ['King of the Andals and the First Men', 'Lord of the Seven Kingdoms', 'Lord of Storm’s End'],
    aliases: ['The Usurper', 'The Demon of the Trident'],
    house: {
      _id: 'house-baratheon',
      _type: 'house',
      name: 'House Baratheon of Storm\'s End',
      slug: { current: 'house-baratheon' },
    },
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
    age: '36 (at death)',
    status: 'Deceased',
    culture: 'Stormlander',
    born: '262 AC, Storm’s End',
    allegiance: 'House Baratheon',
    quickSummary:
      'Lord of Storm’s End and leader of Robert’s Rebellion, who smashed Prince Rhaegar Targaryen at the Trident and claimed the Iron Throne, ending nearly three centuries of Targaryen rule.',
    biography: [
      {
        _type: 'block',
        _key: 'rb1',
        style: 'normal',
        children: [
          {
            _key: 'rbc1',
            _type: 'span',
            text: 'A peerless warrior in his youth armed with a spiked warhammer, Robert defeated the Targaryens but struggled under the burdens of peacetime governance.',
          },
        ],
      },
    ],
  },
  {
    _id: 'char-brienne-tarth',
    _type: 'character',
    name: 'Brienne of Tarth',
    slug: { current: 'brienne-tarth' },
    titles: ['Ser', 'Lord Commander of the Kingsguard', 'The Maid of Tarth'],
    aliases: ['Brienne the Beauty', 'The Maid of Tarth', 'The Evenstar’s Daughter'],
    house: {
      _id: 'house-tarth',
      _type: 'house',
      name: 'House Tarth of Evenfall Hall',
      slug: { current: 'house-tarth' },
    },
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    age: '25 (at 300 AC)',
    status: 'Alive',
    culture: 'Stormlander',
    born: '280 AC, Evenfall Hall',
    allegiance: 'House Stark / House Tarth',
    quickSummary:
      'The sole surviving child of Lord Selwyn Tarth. An extraordinarily tall and martial woman who epitomizes true chivalry, knighthood, and unwavering loyalty.',
    biography: [
      {
        _type: 'block',
        _key: 'bt1',
        style: 'normal',
        children: [
          {
            _key: 'btc1',
            _type: 'span',
            text: 'Wielding the Valyrian steel blade Oathkeeper, Brienne upheld her vows to Catelyn Stark across war-torn Antos, later becoming the first woman knighted in the Seven Kingdoms.',
          },
        ],
      },
    ],
  },
  {
    _id: 'char-samwell-tarly',
    _type: 'character',
    name: 'Samwell Tarly',
    slug: { current: 'samwell-tarly' },
    titles: ['Grand Maester', 'Brother of the Night’s Watch'],
    aliases: ['Sam', 'Sam the Slayer', 'Lord Piggy'],
    house: {
      _id: 'house-tarly',
      _type: 'house',
      name: 'House Tarly of Horn Hill',
      slug: { current: 'house-tarly' },
    },
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    age: '22 (at 300 AC)',
    status: 'Alive',
    culture: 'Reachman',
    born: '283 AC, Horn Hill',
    allegiance: "Night's Watch / The droplet-spire",
    quickSummary:
      'The bookish and gentle son of Lord Randyll Tarly who joined the Night’s Watch, became Jon Snow’s closest confidant, and discovered the weakness of the White Walkers to dragonglass.',
    biography: [
      {
        _type: 'block',
        _key: 'st1',
        style: 'normal',
        children: [
          {
            _key: 'stc1',
            _type: 'span',
            text: 'Forced to the Wall by his abusive father, Samwell proved his heroism through scholarship and courage, slaying an Other with obsidian in the Haunted Forest.',
          },
        ],
      },
    ],
  },
  {
    _id: 'char-tywin-lannister',
    _type: 'character',
    name: 'Tywin Lannister',
    slug: { current: 'tywin-lannister' },
    titles: ['Lord of Casterly Rock', 'Shield of Lannisport', 'Warden of the West', 'Hand of the King'],
    aliases: ['The Great Lion of the Rock', 'The Old Lion'],
    house: {
      _id: 'house-lannister',
      _type: 'house',
      name: 'House Lannister of Casterly Rock',
      slug: { current: 'house-lannister' },
    },
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    age: '56 (at death)',
    status: 'Deceased',
    culture: 'Westerman',
    born: '242 AC, Casterly Rock',
    allegiance: 'House Lannister',
    quickSummary:
      'The patriarch of House Lannister and one of the most powerful, calculated, and ruthless politicians in Antosi history, whose pragmatic brutality cemented Lannister supremacy.',
    biography: [
      {
        _type: 'block',
        _key: 'tl1',
        style: 'normal',
        children: [
          {
            _key: 'tlc1',
            _type: 'span',
            text: 'Famous for annihilating House Reyne of Castamere, Tywin served King Aerys II as Hand for twenty years before orchestrating the downfall of House Stark during the War of the Five Kings.',
          },
        ],
      },
    ],
  },
  {
    _id: 'char-oberyn-martell',
    _type: 'character',
    name: 'Oberyn Martell',
    slug: { current: 'oberyn-martell' },
    titles: ['Prince of Dorne', 'The Red Viper of Dorne'],
    aliases: ['The Red Viper'],
    house: {
      _id: 'house-martell',
      _type: 'house',
      name: 'House Martell of Sunspear',
      slug: { current: 'house-martell' },
    },
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    age: '42 (at death)',
    status: 'Deceased',
    culture: 'Dornish',
    born: '258 AC, Sunspear',
    allegiance: 'House Martell',
    quickSummary:
      'Prince of Dorne, deadly spearman, scholar, and traveler who sought vengeance against Ser Gregor Clegane and the Lannisters for the murder of his sister Elia.',
    biography: [
      {
        _type: 'block',
        _key: 'om1',
        style: 'normal',
        children: [
          {
            _key: 'omc1',
            _type: 'span',
            text: 'Renowned across Eclind and Antos for his mastery of poisons and agile spear fighting, Oberyn fought as Tyrion’s champion in trial by combat against Ser Gregor Clegane.',
          },
        ],
      },
    ],
  },
  {
    _id: 'char-sandor-clegane',
    _type: 'character',
    name: 'Sandor Clegane',
    slug: { current: 'sandor-clegane' },
    titles: ['Sworn Shield', 'The Hound', 'Brother of the Quiet Isle'],
    aliases: ['The Hound', 'Dog'],
    house: {
      _id: 'house-clegane',
      _type: 'house',
      name: 'House Clegane',
      slug: { current: 'house-clegane' },
    },
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80',
    age: '30 (at 300 AC)',
    status: 'Deceased',
    culture: 'Westerman',
    born: '270 AC, Clegane’s Keep',
    allegiance: 'House Clegane / Independent',
    quickSummary:
      'A ferocious warrior bearing severe facial burn scars inflicted by his brother Gregor. Despite his cynicism regarding knightly hypocrisy, Sandor repeatedly protected Sansa and Arya Stark.',
    biography: [
      {
        _type: 'block',
        _key: 'sc1',
        style: 'normal',
        children: [
          {
            _key: 'scc1',
            _type: 'span',
            text: 'Refusing to swear knightly vows, Sandor wore a snarling hound helm into battle. During the Battle of the Blackwater, traumatized by wildfire, he deserted the Lannister cause.',
          },
        ],
      },
    ],
  },
  {
    _id: 'char-varys',
    _type: 'character',
    name: 'Varys',
    slug: { current: 'varys' },
    titles: ['Master of Whisperers', 'Lord Varys'],
    aliases: ['The Spider', 'The Eunuch'],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
    age: '50s',
    status: 'Deceased',
    culture: 'Lysene / Eclindi',
    born: 'c. 248 AC, Lys',
    allegiance: 'The Realm / House Targaryen',
    quickSummary:
      'The enigmatic Master of Whisperers on the Small Council whose vast network of "little birds" gathered intelligence from Oldtown to the Free Cities.',
    biography: [
      {
        _type: 'block',
        _key: 'v1',
        style: 'normal',
        children: [
          {
            _key: 'vc1',
            _type: 'span',
            text: 'A former mummer and slave in Myr and Pentos, Varys claimed all his machinations were dedicated to peace and stability for the realm and its smallfolk.',
          },
        ],
      },
    ],
  },
  {
    _id: 'char-petyr-baelish',
    _type: 'character',
    name: 'Petyr Baelish',
    slug: { current: 'petyr-baelish' },
    titles: ['Master of Coin', 'Lord Paramount of the Trident', 'Lord of Harrenhal', 'Lord Protector of the Vale'],
    aliases: ['Littlefinger'],
    house: {
      _id: 'house-baelish',
      _type: 'house',
      name: 'House Baelish of Harrenhal',
      slug: { current: 'house-baelish' },
    },
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
    age: '33 (at 300 AC)',
    status: 'Deceased',
    culture: 'Valeman',
    born: '268 AC, The Fingers',
    allegiance: 'House Baelish',
    quickSummary:
      'Master of Coin whose financial wizardry and ruthless manipulation ignited the War of the Five Kings, viewing chaos not as a pit, but a ladder.',
    biography: [
      {
        _type: 'block',
        _key: 'pb1',
        style: 'normal',
        children: [
          {
            _key: 'pbc1',
            _type: 'span',
            text: 'Rising from insignificant holdings in the Fingers through commerce and court intrigue, Baelish orchestrated the poisonings of Jon Arryn and Joffrey Baratheon.',
          },
        ],
      },
    ],
  },
  {
    _id: 'char-barristan-selmy',
    _type: 'character',
    name: 'Barristan Selmy',
    slug: { current: 'barristan-selmy' },
    titles: ['Ser', 'Lord Commander of the Kingsguard', 'Queensguard Commander', 'Hand of the Queen'],
    aliases: ['Barristan the Bold', 'Arstan Whitebeard'],
    house: {
      _id: 'house-selmy',
      _type: 'house',
      name: 'House Selmy of Harvest Hall',
      slug: { current: 'house-selmy' },
    },
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    age: '63 (at 300 AC)',
    status: 'Alive',
    culture: 'Stormlander',
    born: '237 AC, Harvest Hall',
    allegiance: 'House Targaryen / Kingsguard',
    quickSummary:
      'A legendary knight celebrated as "Barristan the Bold" who served three kings in the Kingsguard before traveling across Eclind to protect Queen Daenerys Targaryen.',
    biography: [
      {
        _type: 'block',
        _key: 'bsm1',
        style: 'normal',
        children: [
          {
            _key: 'bsmc1',
            _type: 'span',
            text: 'Famed for slaying Maelys the Monstrous in single combat during the War of the Ninepenny Kings and rescuing King Aerys II during the Defiance of Duskendale.',
          },
        ],
      },
    ],
  },
];

// Sub-category professions dynamically rendered in character directory
export const mockProfessions: ProfessionDoc[] = [
  {
    _id: 'prof-kings',
    _type: 'profession',
    name: 'Kings & Queens',
    slug: { current: 'kings-queens' },
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    description: 'Crown monarchs of the Iron Throne, the North, and ancient dynasties.',
    count: 8,
  },
  {
    _id: 'prof-knights',
    _type: 'profession',
    name: 'Knights & Champions',
    slug: { current: 'knights-champions' },
    image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=600&auto=format&fit=crop&q=80',
    description: 'Anointed warriors of the Seven, Kingsguard brothers, and sword masters.',
    count: 14,
  },
  {
    _id: 'prof-lords',
    _type: 'profession',
    name: 'Lords & Nobles',
    slug: { current: 'lords-nobles' },
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    description: 'Warden rulers, high seats, castellans, and matriarchs of Great Houses.',
    count: 19,
  },
  {
    _id: 'prof-assassins',
    _type: 'profession',
    name: 'Assassins & Rogues',
    slug: { current: 'assassins-rogues' },
    image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=600&auto=format&fit=crop&q=80',
    description: 'Faceless Men of Braavos, sellswords, master sneaks, and shadow-binders.',
    count: 6,
  },
  {
    _id: 'prof-maesters',
    _type: 'profession',
    name: 'Maesters & Scholars',
    slug: { current: 'maesters-scholars' },
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
    description: 'Chained lore-keepers of Oldtown, healers, astronomancers, and tutors.',
    count: 7,
  },
  {
    _id: 'prof-nights-watch',
    _type: 'profession',
    name: "Night's Watch",
    slug: { current: 'nights-watch' },
    image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=600&auto=format&fit=crop&q=80',
    description: 'The Sworn Brothers in black guarding the Wall against the eternal cold.',
    count: 11,
  },
];

// Landing Page 8 Main Categories styled after AWOIAF
export interface MainCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  count: string;
  slug: string;
}

export const mockMainCategories: MainCategory[] = [
  {
    id: 'cat-books',
    name: 'Books',
    description: 'The canonical tomes, novellas, and official histories of George R.R. Martin.',
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80',
    count: '6 Canonical Volumes',
    slug: 'books',
  },
  {
    id: 'cat-characters',
    name: 'Characters',
    description: 'The lords, ladies, warriors, schemers, and commoners who shaped history.',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    count: '2,400+ Profiles',
    slug: 'characters',
  },
  {
    id: 'cat-houses',
    name: 'Houses',
    description: 'The Great and Minor dynastic families, their heraldry, sigils, and ancestral seats.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    count: '430 Dynasties',
    slug: 'houses',
  },
  {
    id: 'cat-places',
    name: 'Places',
    description: 'Castles, cities, ruins, and geographical landmarks of Antos and Eclind.',
    image: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=800&auto=format&fit=crop&q=80',
    count: '1,120 Strongholds',
    slug: 'places',
  },
  {
    id: 'cat-history',
    name: 'History',
    description: 'From the Age of Heroes and the Doom of Valyria to Robert’s Rebellion.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    count: '12,000 Years of Lore',
    slug: 'history',
  },
  {
    id: 'cat-culture',
    name: 'Culture',
    description: 'Religious faiths, customs, languages, songs, and knightly traditions.',
    image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800&auto=format&fit=crop&q=80',
    count: '85 Traditions',
    slug: 'culture',
  },
  {
    id: 'cat-magic',
    name: 'Magic & Artifacts',
    description: 'Valyrian steel blades, dragon horn sorcery, wildfire, and shadow-binding.',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    count: '120 Relics',
    slug: 'magic-artifacts',
  },
  {
    id: 'cat-species',
    name: 'Species & Creatures',
    description: 'Dragons, direwolves, the Others, Children of the Forest, and giants.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    count: '34 Mythic Beasts',
    slug: 'species-creatures',
  },
];

// Associate professions to characters
mockCharacters.forEach((char) => {
  const s = char.slug?.current || (typeof (char as any).slug === 'string' ? (char as any).slug : '');
  if (['robb-stark', 'robert-baratheon', 'daenerys-targaryen', 'bran-stark', 'sansa-stark', 'cersei-lannister'].includes(s)) {
    char.professions = [mockProfessions[0]]; // Kings & Queens
  } else if (['jaime-lannister', 'brienne-tarth', 'barristan-selmy', 'oberyn-martell'].includes(s)) {
    char.professions = [mockProfessions[1]]; // Knights
  } else if (['eddard-stark', 'tyrion-lannister', 'tywin-lannister', 'petyr-baelish'].includes(s)) {
    char.professions = [mockProfessions[2]]; // Lords
  } else if (['arya-stark', 'sandor-clegane', 'varys'].includes(s)) {
    char.professions = [mockProfessions[3]]; // Assassins & Rogues
  } else if (['samwell-tarly'].includes(s)) {
    char.professions = [mockProfessions[4]]; // Maesters & Scholars
  } else if (['jon-snow'].includes(s)) {
    char.professions = [mockProfessions[5], mockProfessions[0]]; // Night's Watch & King
  } else {
    char.professions = [mockProfessions[2]];
  }
});

// Cultures dataset
export const mockCultures: CultureDoc[] = [
  {
    _id: 'culture-first-men',
    _type: 'culture',
    name: 'The First Men',
    slug: { current: 'first-men' },
    region: 'The North & Beyond the Wall',
    religion: 'Old Gods of the Forest',
    image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800&auto=format&fit=crop&q=80',
    quickSummary:
      'The original human inhabitants of Antos who crossed the Arm of Dorne twelve thousand years ago, carving faces into ancient weirwood trees and heeding the Old Gods.',
    traditions: [
      {
        _type: 'block',
        _key: 'cu1',
        style: 'normal',
        children: [
          {
            _key: 'cuc1',
            _type: 'span',
            text: 'The First Men forged a sacred Pact with the Children of the Forest upon the Isle of Faces. Their descendants—chief among them House Stark and the wildlings Beyond the Wall—maintain sacred guest right and divine worship of weirwood Heart Trees.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'cu2',
        style: 'blockquote',
        children: [
          {
            _key: 'cuc2',
            _type: 'span',
            text: '"The man who passes the sentence should swing the sword." — Ancient First Men customary law upheld in the North.',
          },
        ],
      },
    ],
  },
  {
    _id: 'culture-valyrians',
    _type: 'culture',
    name: 'High Valyrians',
    slug: { current: 'valyrians' },
    region: 'Valyrian Peninsula & Dragonstone',
    religion: 'Polytheistic Dragon-Gods (Balerion, Meraxes, Vhagar)',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    quickSummary:
      'A proud civilization of dragonlords with silvery-gold hair and violet eyes who ruled the Known World through sorcery, dragonfire, and spell-forged Valyrian steel until the cataclysmic Doom.',
    traditions: [
      {
        _type: 'block',
        _key: 'cu3',
        style: 'normal',
        children: [
          {
            _key: 'cuc3',
            _type: 'span',
            text: 'The Freehold of Valyria was ruled by forty aristocratic dragonlord families. They bonded with dragons via blood magic, forged impenetrable dark architecture, and preserved their pure lineage through sibling matrimony.',
          },
        ],
      },
    ],
  },
  {
    _id: 'culture-andals',
    _type: 'culture',
    name: 'The Andals',
    slug: { current: 'andals' },
    region: 'The South & Riverlands',
    religion: 'The Faith of the Seven',
    image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80',
    quickSummary:
      'Tall, fair-haired warriors who invaded Antos with iron weaponry and the seven-pointed star carved upon their chests, bringing chivalry, septs, and knighthood to the south.',
    traditions: [
      {
        _type: 'block',
        _key: 'cu4',
        style: 'normal',
        children: [
          {
            _key: 'cuc4',
            _type: 'span',
            text: 'The Andals displaced the First Men across the south, felling godswoods and establishing the institution of holy knighthood sworn before the Mother, Father, Warrior, Smith, Maiden, Crone, and Stranger.',
          },
        ],
      },
    ],
  },
  {
    _id: 'culture-ironborn',
    _type: 'culture',
    name: 'The Ironborn',
    slug: { current: 'ironborn' },
    region: 'The Iron Islands',
    religion: 'The Drowned God',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    quickSummary:
      'Seafaring raiders of the rocky Iron Islands living by the "Old Way"—paying the iron price in battle rather than the gold price of trade.',
    traditions: [
      {
        _type: 'block',
        _key: 'cu5',
        style: 'normal',
        children: [
          {
            _key: 'cuc5',
            _type: 'span',
            text: 'Revering the Drowned God beneath the sea, every ironborn child undergoes baptismal immersion: "What is dead may never die, but rises again, harder and stronger."',
          },
        ],
      },
    ],
  },
];

// Magic & Arcana dataset
export const mockMagic: MagicDoc[] = [
  {
    _id: 'magic-valyrian-steel',
    _type: 'magic',
    name: 'Valyrian Steel & Spell-Forging',
    slug: { current: 'valyrian-steel' },
    origin: 'Valyrian Freehold',
    dangerLevel: 'Potent',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    quickSummary:
      'An ancient, peerless alloy forged with dragonfire and blood-sorcery, lighter and sharper than conventional steel and permanently impervious to corrosion or dulling.',
    rulesAndArtifacts: [
      {
        _type: 'block',
        _key: 'mg1',
        style: 'normal',
        children: [
          {
            _key: 'mgc1',
            _type: 'span',
            text: 'The secret spells for forging fresh Valyrian steel perished with the Doom of Valyria. Only master smiths in Qohor retain the closely guarded knowledge required to re-melt and rework existing blades such as Ice or Blackfyre.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'mg2',
        style: 'normal',
        children: [
          {
            _key: 'mgc2',
            _type: 'span',
            text: 'Valyrian steel possesses the lethal property of destroying the Others upon contact, shattering their icy crystal armor instantly.',
          },
        ],
      },
    ],
  },
  {
    _id: 'magic-dragons-blood',
    _type: 'magic',
    name: 'Dragon Bonding & Fire Sorcery',
    slug: { current: 'dragon-magic' },
    origin: 'The Fourteen Flames, Valyria',
    dangerLevel: 'Cataclysmic',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    quickSummary:
      'The metaphysical affinity binding Valyrian dragonlords to great winged fire-drakes, synchronizing their spirits and commanding living nuclear flame.',
    rulesAndArtifacts: [
      {
        _type: 'block',
        _key: 'mg3',
        style: 'normal',
        children: [
          {
            _key: 'mgc3',
            _type: 'span',
            text: 'Dragons are fire made flesh. When dragons thrive, spells across the Known World burn hotter and pyromancers produce volatile jars of wildfire with supernatural speed.',
          },
        ],
      },
    ],
  },
  {
    _id: 'magic-greensight',
    _type: 'magic',
    name: 'The Greensight & Warging',
    slug: { current: 'greensight-warging' },
    origin: 'Children of the Forest',
    dangerLevel: 'Subtle',
    image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=800&auto=format&fit=crop&q=80',
    quickSummary:
      'The mystical ability to project one\'s consciousness into animals (skinchanging) and view the tapestry of past, present, and future through the weeping eyes of weirwood trees.',
    rulesAndArtifacts: [
      {
        _type: 'block',
        _key: 'mg4',
        style: 'normal',
        children: [
          {
            _key: 'mgc4',
            _type: 'span',
            text: 'Greenseers perceive reality beyond mortal temporal constraints. Their spirits intertwine with the subterranean roots of the weirwoods, as mastered by the Three-Eyed Raven beneath the Haunted Forest.',
          },
        ],
      },
    ],
  },
];

// Species & Bestiary dataset
export const mockSpecies: SpeciesDoc[] = [
  {
    _id: 'species-dragons',
    _type: 'species',
    name: 'Dragons (Draco Valyrius)',
    slug: { current: 'dragons' },
    habitat: 'Valyrian Freehold, Dragonstone, Meereen',
    status: 'Endangered / Rare',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    quickSummary:
      'Gigantic, winged reptilian predators capable of breathing molten torrents of fire. Intelligent and bonded to Targaryen riders, they are the pinnacle of aerial apex beasts.',
    description: [
      {
        _type: 'block',
        _key: 'sp1',
        style: 'normal',
        children: [
          {
            _key: 'spc1',
            _type: 'span',
            text: 'Dragons possess scales as thick as iron plate, two forelegs with wings, and a razor tail. Notable historical individuals include Balerion the Black Dread, Vhagar, Drogon, Rhaegal, and Viserion.',
          },
        ],
      },
    ],
  },
  {
    _id: 'species-direwolves',
    _type: 'species',
    name: 'Direwolves (Canis Dirus)',
    slug: { current: 'direwolves' },
    habitat: 'The Haunted Forest Beyond the Wall',
    status: 'Endangered / Rare',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    quickSummary:
      'An ancient breed of gigantic wolves capable of growing as large as horses, fiercely loyal and spiritually linked to the children of House Stark.',
    description: [
      {
        _type: 'block',
        _key: 'sp2',
        style: 'normal',
        children: [
          {
            _key: 'spc2',
            _type: 'span',
            text: 'Long absent south of the Wall, a dying direwolf mother left six pups discovered by Eddard Stark\'s children: Ghost, Nymeria, Grey Wind, Summer, Shaggydog, and Lady.',
          },
        ],
      },
    ],
  },
  {
    _id: 'species-others',
    _type: 'species',
    name: 'The Others (White Walkers)',
    slug: { current: 'the-others' },
    habitat: 'The Land of Always Winter',
    status: 'Legendary / Mythical',
    image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=800&auto=format&fit=crop&q=80',
    quickSummary:
      'Inhuman, crystalline beings from the Land of Always Winter riding dead mounts, wielding swords of pale frost, and raising the fallen as undead wights.',
    description: [
      {
        _type: 'block',
        _key: 'sp3',
        style: 'normal',
        children: [
          {
            _key: 'spc3',
            _type: 'span',
            text: 'Tall and gaunt with flesh pale as milk and eyes burning with cold blue flame, the Others command devastating blizzards that sweep south during the Long Night.',
          },
        ],
      },
    ],
  },
  {
    _id: 'species-children-of-the-forest',
    _type: 'species',
    name: 'Children of the Forest',
    slug: { current: 'children-of-the-forest' },
    habitat: 'Deep ancient caves and subterranean hollows',
    status: 'Rare',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    quickSummary:
      'The diminutive, non-human original race of Antos who sang songs of earth and carved the watchful faces of the weirwoods.',
    description: [
      {
        _type: 'block',
        _key: 'sp4',
        style: 'normal',
        children: [
          {
            _key: 'spc4',
            _type: 'span',
            text: 'Known in the True Tongue as those who sing the song of earth. They wielded obsidian (dragonglass) weapons and bowed before no king.',
          },
        ],
      },
    ],
  },
];

// Books & Canonical Tomes dataset
export const mockBooks: BookDoc[] = [
  {
    _id: 'book-agot',
    _type: 'book',
    title: 'A Game of Thrones',
    name: 'A Game of Thrones',
    slug: { current: 'a-game-of-thrones' },
    releaseOrder: 1,
    publicationYear: '1996',
    pageCount: 694,
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80',
    quickSummary:
      'The foundational first novel of A Song of Ice and Fire, detailing the mysterious death of Jon Arryn, Eddard Stark’s journey south, and the gathering storm at the Wall.',
    synopsis: [
      {
        _type: 'block',
        _key: 'bk1',
        style: 'normal',
        children: [
          {
            _key: 'bkc1',
            _type: 'span',
            text: 'King Robert Baratheon visits Winterfell to name Lord Eddard Stark his Hand. Meanwhile across the Narrow Sea, the exiled princess Daenerys Targaryen weds the Dothraki warlord Khal Drogo.',
          },
        ],
      },
    ],
  },
  {
    _id: 'book-acok',
    _type: 'book',
    title: 'A Clash of Kings',
    name: 'A Clash of Kings',
    slug: { current: 'a-clash-of-kings' },
    releaseOrder: 2,
    publicationYear: '1998',
    pageCount: 768,
    coverImage: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800&auto=format&fit=crop&q=80',
    quickSummary:
      'The realm erupts in the War of the Five Kings as Stannis, Renly, Robb Stark, Balon Greyjoy, and Joffrey vie for supremacy under a bleeding crimson comet.',
    synopsis: [
      {
        _type: 'block',
        _key: 'bk2',
        style: 'normal',
        children: [
          {
            _key: 'bkc2',
            _type: 'span',
            text: 'Tyrion Lannister acts as Hand in King\'s Landing, defending the city from Stannis Baratheon\'s fleet in the fiery Battle of the Blackwater.',
          },
        ],
      },
    ],
  },
  {
    _id: 'book-asos',
    _type: 'book',
    title: 'A Storm of Swords',
    name: 'A Storm of Swords',
    slug: { current: 'a-storm-of-swords' },
    releaseOrder: 3,
    publicationYear: '2000',
    pageCount: 973,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    quickSummary:
      'The epic climax of the War of the Five Kings, featuring the treacherous Red Wedding, the Purple Wedding, and Jon Snow’s desperate defense of the Wall.',
    synopsis: [
      {
        _type: 'block',
        _key: 'bk3',
        style: 'normal',
        children: [
          {
            _key: 'bkc3',
            _type: 'span',
            text: 'Alliances crumble as House Frey and House Bolton betray King Robb Stark at the Twins. At the Wall, Jon Snow stands with the Night\'s Watch against Mance Rayder\'s wildling horde.',
          },
        ],
      },
    ],
  },
  {
    _id: 'book-affc',
    _type: 'book',
    title: 'A Feast for Crows',
    name: 'A Feast for Crows',
    slug: { current: 'a-feast-for-crows' },
    releaseOrder: 4,
    publicationYear: '2005',
    pageCount: 752,
    coverImage: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=800&auto=format&fit=crop&q=80',
    quickSummary:
      'The scavengers feast upon the carcass of Antos as Queen Cersei descends into paranoia, the Ironborn choose Euron Greyjoy, and Brienne searches the Riverlands.',
    synopsis: [
      {
        _type: 'block',
        _key: 'bk4',
        style: 'normal',
        children: [
          {
            _key: 'bkc4',
            _type: 'span',
            text: 'Focuses on the Iron Islands Kingsmoot, the scheming Martells in Dorne, and the rising power of the Faith Militant in King\'s Landing under the High Sparrow.',
          },
        ],
      },
    ],
  },
  {
    _id: 'book-adwd',
    _type: 'book',
    title: 'A Dance with Dragons',
    name: 'A Dance with Dragons',
    slug: { current: 'a-dance-with-dragons' },
    releaseOrder: 5,
    publicationYear: '2011',
    pageCount: 1040,
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    quickSummary:
      'Daenerys Targaryen struggles to maintain rule in Meereen, Jon Snow enacts radical reforms as Lord Commander, and Tyrion Lannister journeys to the dragon queen.',
    synopsis: [
      {
        _type: 'block',
        _key: 'bk5',
        style: 'normal',
        children: [
          {
            _key: 'bkc5',
            _type: 'span',
            text: 'Northern intrigue peaks at Winterfell where Stannis Baratheon marches through blinding snowdrifts to wrest the castle from Roose and Ramsay Bolton.',
          },
        ],
      },
    ],
  },
  {
    _id: 'book-fire-and-blood',
    _type: 'book',
    title: 'Fire & Blood',
    name: 'Fire & Blood',
    slug: { current: 'fire-and-blood' },
    releaseOrder: 6,
    publicationYear: '2018',
    pageCount: 736,
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    quickSummary:
      'The definitive historical chronicle of House Targaryen by Archmaester Gyldayn, from Aegon\'s Conquest through the regency of Aegon III.',
    synopsis: [
      {
        _type: 'block',
        _key: 'bk6',
        style: 'normal',
        children: [
          {
            _key: 'bkc6',
            _type: 'span',
            text: 'Details the unification of the Seven Kingdoms, the reign of King Jaehaerys the Conciliator, and the devastating civil war known as the Dance of the Dragons.',
          },
        ],
      },
    ],
  },
];

// Alias mockPlaces to mockLocations
export const mockPlaces = mockLocations;

// Custom wiki document persistence keys
export const CUSTOM_WIKI_STORAGE_KEY = 'winds_of_life_custom_documents';
export const DELETED_WIKI_STORAGE_KEY = 'winds_of_life_deleted_documents';
const SINGLE_SEED_RESET_KEY = 'winds_of_life_single_seed_v1';

function ensureSingleSeedData(): void {
  try {
    if (localStorage.getItem(SINGLE_SEED_RESET_KEY) !== 'ready') {
      localStorage.removeItem(CUSTOM_WIKI_STORAGE_KEY);
      localStorage.removeItem(DELETED_WIKI_STORAGE_KEY);
      localStorage.setItem(SINGLE_SEED_RESET_KEY, 'ready');
    }
  } catch (e) {
    console.error('Failed to reset wiki seed data', e);
  }
}

export function getDocSlug(doc: any): string {
  if (!doc) return 'unknown';
  if (typeof doc === 'string') return doc;
  if (doc.slug && typeof doc.slug === 'object' && typeof doc.slug.current === 'string' && doc.slug.current.trim()) {
    return doc.slug.current.trim();
  }
  if (typeof doc.slug === 'string' && doc.slug.trim()) {
    return doc.slug.trim();
  }
  const raw = doc.name || doc.title || doc._id || 'entry';
  return String(raw).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'entry';
}

export function normalizeWikiDocument(doc: any): any {
  if (!doc || typeof doc !== 'object') return null;
  const d = { ...doc };
  if (!d._id) {
    d._id = `${d._type || 'doc'}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  }
  const slugVal = getDocSlug(d);
  d.slug = { current: slugVal };

  // Safeguard nested reference objects so their .slug.current never throws
  if (d.house && typeof d.house === 'object') {
    d.house = { ...d.house, slug: { current: getDocSlug(d.house) } };
  }
  if (d.seat && typeof d.seat === 'object') {
    d.seat = { ...d.seat, slug: { current: getDocSlug(d.seat) } };
  }
  if (d.location && typeof d.location === 'object') {
    d.location = { ...d.location, slug: { current: getDocSlug(d.location) } };
  }
  if (d.ruler && typeof d.ruler === 'object') {
    d.ruler = { ...d.ruler, slug: { current: getDocSlug(d.ruler) } };
  }
  if (d.father && typeof d.father === 'object') {
    d.father = { ...d.father, slug: { current: getDocSlug(d.father) } };
  }
  if (d.mother && typeof d.mother === 'object') {
    d.mother = { ...d.mother, slug: { current: getDocSlug(d.mother) } };
  }
  if (d.spouse && typeof d.spouse === 'object') {
    d.spouse = { ...d.spouse, slug: { current: getDocSlug(d.spouse) } };
  }
  if (Array.isArray(d.children)) {
    d.children = d.children.map((ch: any) => ({ ...ch, slug: { current: getDocSlug(ch) } }));
  }
  if (Array.isArray(d.involvedParties)) {
    d.involvedParties = d.involvedParties.map((p: any) => ({ ...p, slug: { current: getDocSlug(p) } }));
  }
  if (Array.isArray(d.professions)) {
    d.professions = d.professions.map((p: any) => ({ ...p, slug: { current: getDocSlug(p) } }));
  }
  if (d._type === 'character') {
    d.sections = buildCharacterSections(d);
    if (!d.appearance && d.sections[0]?.content) {
      const first = d.sections[0]?.content || '';
      d.appearance = first;
    }
  }
  return d;
}

export function getCustomWikiDocs(): any[] {
  ensureSingleSeedData();
  try {
    const raw = localStorage.getItem(CUSTOM_WIKI_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeWikiDocument).filter(Boolean);
      }
    }
  } catch (e) {
    console.error('Failed to read custom documents from localStorage', e);
  }
  return [];
}

export function getDeletedDocIds(): string[] {
  ensureSingleSeedData();
  try {
    const raw = localStorage.getItem(DELETED_WIKI_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to read deleted doc ids', e);
  }
  return [];
}

export function saveWikiDocument(doc: any): void {
  try {
    const cleanDoc = normalizeWikiDocument(doc);
    if (!cleanDoc) return;

    // Normalize type if submitted as place
    if (cleanDoc._type === 'place') {
      cleanDoc._type = 'location';
    }

    const customDocs = getCustomWikiDocs();
    const deletedIds = getDeletedDocIds().filter((id) => id !== cleanDoc._id);
    localStorage.setItem(DELETED_WIKI_STORAGE_KEY, JSON.stringify(deletedIds));

    const existingIdx = customDocs.findIndex(
      (d) => d._id === cleanDoc._id || (d.slug?.current && d.slug.current === cleanDoc.slug?.current && d._type === cleanDoc._type)
    );
    if (existingIdx >= 0) {
      customDocs[existingIdx] = cleanDoc;
    } else {
      customDocs.unshift(cleanDoc);
    }
    localStorage.setItem(CUSTOM_WIKI_STORAGE_KEY, JSON.stringify(customDocs));

    // Also update in-memory arrays so immediate references reflect the new document
    const type = cleanDoc._type;
    if (type === 'location' || type === 'place') {
      const idx = mockLocations.findIndex((l) => l._id === cleanDoc._id);
      if (idx >= 0) mockLocations[idx] = cleanDoc;
      else mockLocations.unshift(cleanDoc);
    } else if (type === 'character') {
      const idx = mockCharacters.findIndex((c) => c._id === cleanDoc._id);
      if (idx >= 0) mockCharacters[idx] = cleanDoc;
      else mockCharacters.unshift(cleanDoc);
    } else if (type === 'house') {
      const idx = mockHouses.findIndex((h) => h._id === cleanDoc._id);
      if (idx >= 0) mockHouses[idx] = cleanDoc;
      else mockHouses.unshift(cleanDoc);
    } else if (type === 'event') {
      const idx = mockEvents.findIndex((e) => e._id === cleanDoc._id);
      if (idx >= 0) mockEvents[idx] = cleanDoc;
      else mockEvents.unshift(cleanDoc);
    } else if (type === 'culture') {
      const idx = mockCultures.findIndex((c) => c._id === cleanDoc._id);
      if (idx >= 0) mockCultures[idx] = cleanDoc;
      else mockCultures.unshift(cleanDoc);
    } else if (type === 'magic') {
      const idx = mockMagic.findIndex((m) => m._id === cleanDoc._id);
      if (idx >= 0) mockMagic[idx] = cleanDoc;
      else mockMagic.unshift(cleanDoc);
    } else if (type === 'species') {
      const idx = mockSpecies.findIndex((s) => s._id === cleanDoc._id);
      if (idx >= 0) mockSpecies[idx] = cleanDoc;
      else mockSpecies.unshift(cleanDoc);
    } else if (type === 'book') {
      const idx = mockBooks.findIndex((b) => b._id === cleanDoc._id);
      if (idx >= 0) mockBooks[idx] = cleanDoc;
      else mockBooks.unshift(cleanDoc);
    }

    const allIdx = allWikiDocuments.findIndex((d: any) => d._id === cleanDoc._id);
    if (allIdx >= 0) allWikiDocuments[allIdx] = cleanDoc;
    else allWikiDocuments.unshift(cleanDoc);

    window.dispatchEvent(new Event('droplet-spire-wiki-updated'));
  } catch (e) {
    console.error('Failed to save wiki document', e);
  }
}

export function deleteWikiDocument(docId: string): void {
  try {
    const deletedIds = getDeletedDocIds();
    if (!deletedIds.includes(docId)) {
      deletedIds.push(docId);
      localStorage.setItem(DELETED_WIKI_STORAGE_KEY, JSON.stringify(deletedIds));
    }
    const customDocs = getCustomWikiDocs().filter((d) => d._id !== docId);
    localStorage.setItem(CUSTOM_WIKI_STORAGE_KEY, JSON.stringify(customDocs));

    // Remove from in-memory arrays
    const locIdx = mockLocations.findIndex((l) => l._id === docId);
    if (locIdx >= 0) mockLocations.splice(locIdx, 1);
    const charIdx = mockCharacters.findIndex((c) => c._id === docId);
    if (charIdx >= 0) mockCharacters.splice(charIdx, 1);
    const houseIdx = mockHouses.findIndex((h) => h._id === docId);
    if (houseIdx >= 0) mockHouses.splice(houseIdx, 1);
    const evIdx = mockEvents.findIndex((e) => e._id === docId);
    if (evIdx >= 0) mockEvents.splice(evIdx, 1);

    const allIdx = allWikiDocuments.findIndex((d: any) => d._id === docId);
    if (allIdx >= 0) allWikiDocuments.splice(allIdx, 1);

    window.dispatchEvent(new Event('droplet-spire-wiki-updated'));
  } catch (e) {
    console.error('Failed to delete wiki document', e);
  }
}

export function getAllLocations(): LocationDoc[] {
  const deleted = new Set(getDeletedDocIds());
  const custom = getCustomWikiDocs().filter((d) => (d._type === 'location' || d._type === 'place') && !deleted.has(d._id));
  const base = mockLocations.filter((l) => !deleted.has(l._id) && !custom.some((c) => c._id === l._id));
  return [...custom, ...base].slice(0, 1);
}

export function getAllCharacters(): CharacterDoc[] {
  const deleted = new Set(getDeletedDocIds());
  const custom = getCustomWikiDocs().filter((d) => d._type === 'character' && !deleted.has(d._id));
  const base = mockCharacters.filter((c) => !deleted.has(c._id) && !custom.some((cus) => cus._id === c._id));
  return [...custom, ...base].slice(0, 1);
}

export function getAllHouses(): HouseDoc[] {
  const deleted = new Set(getDeletedDocIds());
  const custom = getCustomWikiDocs().filter((d) => d._type === 'house' && !deleted.has(d._id));
  const base = mockHouses.filter((h) => !deleted.has(h._id) && !custom.some((cus) => cus._id === h._id));
  return [...custom, ...base].slice(0, 1);
}

export function getAllEvents(): EventDoc[] {
  const deleted = new Set(getDeletedDocIds());
  const custom = getCustomWikiDocs().filter((d) => d._type === 'event' && !deleted.has(d._id));
  const base = mockEvents.filter((e) => !deleted.has(e._id) && !custom.some((cus) => cus._id === e._id));
  return [...custom, ...base].slice(0, 1);
}

export function getAllCultures(): CultureDoc[] {
  const deleted = new Set(getDeletedDocIds());
  const custom = getCustomWikiDocs().filter((d) => d._type === 'culture' && !deleted.has(d._id));
  const base = mockCultures.filter((c) => !deleted.has(c._id) && !custom.some((cus) => cus._id === c._id));
  return [...custom, ...base].slice(0, 1);
}

export function getAllMagic(): MagicDoc[] {
  const deleted = new Set(getDeletedDocIds());
  const custom = getCustomWikiDocs().filter((d) => d._type === 'magic' && !deleted.has(d._id));
  const base = mockMagic.filter((m) => !deleted.has(m._id) && !custom.some((cus) => cus._id === m._id));
  return [...custom, ...base].slice(0, 1);
}

export function getAllSpecies(): SpeciesDoc[] {
  const deleted = new Set(getDeletedDocIds());
  const custom = getCustomWikiDocs().filter((d) => d._type === 'species' && !deleted.has(d._id));
  const base = mockSpecies.filter((s) => !deleted.has(s._id) && !custom.some((cus) => cus._id === s._id));
  return [...custom, ...base].slice(0, 1);
}

export function getAllBooks(): BookDoc[] {
  const deleted = new Set(getDeletedDocIds());
  const custom = getCustomWikiDocs().filter((d) => d._type === 'book' && !deleted.has(d._id));
  const base = mockBooks.filter((b) => !deleted.has(b._id) && !custom.some((cus) => cus._id === b._id));
  return [...custom, ...base].slice(0, 1);
}

export function getAllProfessions(): ProfessionDoc[] {
  const deleted = new Set(getDeletedDocIds());
  const custom = getCustomWikiDocs().filter((d) => d._type === 'profession' && !deleted.has(d._id));
  const base = mockProfessions.filter((p) => !deleted.has(p._id) && !custom.some((cus) => cus._id === p._id));
  return [...custom, ...base].slice(0, 1);
}

export function getAllWikiDocuments(): any[] {
  return [
    ...getAllCharacters(),
    ...getAllHouses(),
    ...getAllLocations(),
    ...getAllEvents(),
    ...getAllCultures(),
    ...getAllMagic(),
    ...getAllSpecies(),
    ...getAllBooks(),
    ...getAllProfessions(),
  ];
}

// Canonical Timeline Events Registry for direct Article resolution
const CANONICAL_TIMELINE_DOCS: Record<string, EventDoc> = {
  'dawn-age': {
    _id: 'event-dawn-age',
    _type: 'event',
    name: 'The Dawn Age & Arrival of the First Men',
    slug: { current: 'dawn-age' },
    date: '12,000 BC',
    outcome: 'Pact of the Isle of Faces sealed between the First Men and the Children of the Forest.',
    quickSummary: 'The First Men cross the Arm of Dorne into Antos, waging war with bronze swords against the indigenous Children of the Forest until sealing eternal peace upon the Isle of Faces.',
    description: [
      {
        _type: 'block',
        _key: 'da1',
        style: 'normal',
        children: [
          {
            _key: 'dac1',
            _type: 'span',
            text: 'Twelve thousand years before the conquest, the First Men arrived in Antos over the broken land bridge known as the Arm of Dorne. Armed with bronze weapons and riding horses, they cut down the sacred weirwood groves of the indigenous Children of the Forest to clear lands for farmsteads and keeps.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'da2',
        style: 'normal',
        children: [
          {
            _key: 'dac2',
            _type: 'span',
            text: 'Desperate to halt the First Men, the greenseers shattered the Arm of Dorne using the Hammer of the Waters. Century-long warfare finally culminated in the sacred Pact of the Isle of Faces, where the Children gave the open lands to men while retaining the deep forests.',
          },
        ],
      },
    ],
  },
  'long-night': {
    _id: 'event-long-night',
    _type: 'event',
    name: 'The Long Night & Raising of the Wall',
    slug: { current: 'long-night' },
    date: '8,000 BC',
    outcome: 'The Others are driven back into the Far North. Brandon the Builder raises the Wall; the Night’s Watch is founded.',
    quickSummary: 'A generation-long winter of utter darkness blankets the Known World as the Others descend with spiders as big as hounds. The Last Hero and the Night’s Watch vanquish them in the Battle for the Dawn.',
    description: [
      {
        _type: 'block',
        _key: 'ln1',
        style: 'normal',
        children: [
          {
            _key: 'lnc1',
            _type: 'span',
            text: 'During the Long Night, the sun did not rise for an entire generation. From the frozen heart of the Lands of Always Winter swept the Others—demons of pale ice and slaughter wielding blades of razor crystal that shattered steel.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'ln2',
        style: 'normal',
        children: [
          {
            _key: 'lnc2',
            _type: 'span',
            text: 'Armed with dragonsteel blades provided by the Children of the Forest, the Last Hero united humanity to win the Battle for the Dawn. Brandon Stark—remembered forever as Brandon the Builder—raised the colossal 700-foot ice Wall with the aid of giants and spells.',
          },
        ],
      },
    ],
  },
  'andal-invasion': {
    _id: 'event-andal-invasion',
    _type: 'event',
    name: 'The Andal Invasion of Antos',
    slug: { current: 'andal-invasion' },
    date: '6,000 BC',
    outcome: 'Andal conquest of southern Antos. Establishment of the Faith of the Seven and chivalric knighthood.',
    quickSummary: 'Sailing across the Narrow Sea in longships with seven-pointed stars carved into their flesh, the Andals introduced iron and the Faith of the Seven across the south, thwarted only by the Kings of Winter at Moat Cailin.',
    description: [
      {
        _type: 'block',
        _key: 'ai1',
        style: 'normal',
        children: [
          {
            _key: 'aic1',
            _type: 'span',
            text: 'The Andals crossed the Narrow Sea from Eclind, landing upon the shores of the Vale. They slew the First Men kings, felled ancient weirwood groves, and instituted the holy rites of chivalry and the Faith of the Seven.',
          },
        ],
      },
    ],
  },
  'valyria-rise': {
    _id: 'event-valyria-rise',
    _type: 'event',
    name: 'Rise of the Valyrian Freehold',
    slug: { current: 'valyria-rise' },
    date: '5,000 BC',
    outcome: 'Discovery and taming of dragons; birth of the greatest sorcerous empire in history.',
    quickSummary: 'Valyrian sheep herders discover dragon lairs in the Fourteen Fires volcanoes. Taming the winged terrors through sorcery and horn magic, they forge an unstoppable continent-spanning civilization.',
    description: [
      {
        _type: 'block',
        _key: 'vr1',
        style: 'normal',
        children: [
          {
            _key: 'vrc1',
            _type: 'span',
            text: 'Deep within the smoking calderas of the Fourteen Fires, peaceful shepherds discovered ancient wyrms breathing fire. Using bloodmagic, sorcerous spells, and dragon horns, the early Valyrians bent the dragons to their will.',
          },
        ],
      },
    ],
  },
  'doom-valyria': {
    _id: 'event-doom-valyria',
    _type: 'event',
    name: 'The Doom of Valyria',
    slug: { current: 'doom-valyria' },
    date: '114 BC',
    outcome: 'Simultaneous eruption of the Fourteen Fires destroys the Freehold; House Targaryen survives on Dragonstone.',
    quickSummary: 'Every volcano in the Valyrian Peninsula erupts in a singular hour of apocalypse. Sorcerous towers collapse into boiling seas of ash. Daenys the Dreamer’s vision saves House Targaryen twelve years prior.',
    description: [
      {
        _type: 'block',
        _key: 'dv1',
        style: 'normal',
        children: [
          {
            _key: 'dvc1',
            _type: 'span',
            text: 'On a fateful day in 114 BC, mountains exploded, lakes boiled into acid, and the sky rained dragonglass and ash. The mighty dragonlords vanished in a breath, leaving only ruins across the Smoking Sea. House Targaryen alone had heeded the prophetic dream of Daenys, securing their seat at Dragonstone.',
          },
        ],
      },
    ],
  },
  'aegons-conquest': {
    _id: 'event-aegons-conquest',
    _type: 'event',
    name: "Aegon's Conquest of the Seven Kingdoms",
    slug: { current: 'aegons-conquest' },
    date: '2 BC – 1 AC',
    outcome: 'Six kingdoms united under the Iron Throne; Aegon I crowned King of the Andals and the First Men.',
    quickSummary: 'Aegon Targaryen lands at the Blackwater Rush with his sister-wives Visenya and Rhaenys and their three dragons Balerion, Vhagar, and Meraxes. The Field of Fire and the surrender of the North unify Antos.',
    description: [
      {
        _type: 'block',
        _key: 'ac1',
        style: 'normal',
        children: [
          {
            _key: 'acc1',
            _type: 'span',
            text: 'Landing at the mouth of the Blackwater Rush, Aegon raised a wooden redoubt where the colossal Red Keep would one day stand. With three dragons, the Targaryens crushed the royal armies of the Reach and Rock at the Field of Fire, while King Torrhen Stark knelt in peace to spare his people.',
          },
        ],
      },
    ],
  },
  'dance-dragons': {
    _id: 'event-dance-dragons',
    _type: 'event',
    name: 'The Dance of the Dragons',
    slug: { current: 'dance-dragons' },
    date: '129 – 131 AC',
    outcome: 'Near-total extinction of the Targaryen dragons; Aegon III ascends the throne.',
    quickSummary: 'The catastrophic war of succession between Princess Rhaenyra (the Blacks) and her half-brother King Aegon II (the Greens), turning dragon against dragon across the skies of Antos.',
    description: [
      {
        _type: 'block',
        _key: 'dd1',
        style: 'normal',
        children: [
          {
            _key: 'ddc1',
            _type: 'span',
            text: 'Following the death of King Viserys I, the Realm divided between the Green faction loyal to Queen Alicent and Aegon II, and the Black faction loyal to Princess Rhaenyra. The resulting civil war caused the death of nearly all living dragons.',
          },
        ],
      },
    ],
  },
  'blackfyre-rebellion': {
    _id: 'event-blackfyre-rebellion',
    _type: 'event',
    name: 'The First Blackfyre Rebellion',
    slug: { current: 'blackfyre-rebellion' },
    date: '196 AC',
    outcome: 'Rebel defeat at the Battle of the Redgrass Field. Bittersteel flees to Eclind to form the Golden Company.',
    quickSummary: 'Daemon Blackfyre raises rebellion against King Daeron II with the ancestral Valyrian sword Blackfyre. The conflict concludes in bloodshed at the Redgrass Field with the death of Daemon and his twin sons.',
    description: [
      {
        _type: 'block',
        _key: 'bf1',
        style: 'normal',
        children: [
          {
            _key: 'bfc1',
            _type: 'span',
            text: 'King Aegon IV legitimized all his bastard children on his deathbed, bestowing the conqueror’s sword Blackfyre upon the peerless warrior Daemon Waters instead of his scholar heir Daeron. The resulting rebellion culminated at the Redgrass Field where Bloodraven’s archers slew Daemon.',
          },
        ],
      },
    ],
  },
  'greyjoy-rebellion': {
    _id: 'event-greyjoy-rebellion',
    _type: 'event',
    name: 'The Greyjoy Rebellion',
    slug: { current: 'greyjoy-rebellion' },
    date: '289 AC',
    outcome: 'Royal victory; Siege of Pyke succeeds. Theon Greyjoy taken as ward/hostage by Eddard Stark.',
    quickSummary: 'Balon Greyjoy crowns himself King of the Iron Islands. King Robert Baratheon and Lord Eddard Stark breach the walls of Pyke, forcing Balon to bend the knee.',
    description: [
      {
        _type: 'block',
        _key: 'gr1',
        style: 'normal',
        children: [
          {
            _key: 'grc1',
            _type: 'span',
            text: 'Six years after ascending the Iron Throne, King Robert faced his first major uprising when Balon Greyjoy declared the Iron Islands an independent realm. Robert, accompanied by Lord Stark and Stannis Baratheon, crushed the Iron Fleet and stormed Pyke.',
          },
        ],
      },
    ],
  },
  'war-five-kings': {
    _id: 'event-war-five-kings',
    _type: 'event',
    name: 'The War of the Five Kings',
    slug: { current: 'war-five-kings' },
    date: '298 – 300 AC',
    outcome: 'Collapse of royal authority; devastating devastation across the Riverlands.',
    quickSummary: 'Triggered by the arrest and beheading of Lord Eddard Stark, five kings contend for dominion: Joffrey Baratheon, Robb Stark, Stannis Baratheon, Renly Baratheon, and Balon Greyjoy.',
    description: [
      {
        _type: 'block',
        _key: 'w5k1',
        style: 'normal',
        children: [
          {
            _key: 'w5kc1',
            _type: 'span',
            text: 'Following King Robert’s death and the execution of Eddard Stark, Robb Stark was crowned King in the North by his bannermen. Across Antos, claimants clashed in massive campaigns that laid waste to the Riverlands and Crownlands.',
          },
        ],
      },
    ],
  },
  'long-night-returns': {
    _id: 'event-long-night-returns',
    _type: 'event',
    name: 'The Second Long Night & Battle of Winterfell',
    slug: { current: 'long-night-returns' },
    date: '304 – 305 AC',
    outcome: 'The Night King is slain by Arya Stark with the Valyrian steel catspaw dagger; the army of the dead collapses.',
    quickSummary: 'The Army of the Dead breaches the ice Wall. Allied forces of Northmen, Free Folk, Unsullied, Dothraki, and two dragons fight a desperate last stand at Winterfell to protect the Three-Eyed Raven.',
    description: [
      {
        _type: 'block',
        _key: 'lnr1',
        style: 'normal',
        children: [
          {
            _key: 'lnrc1',
            _type: 'span',
            text: 'Mounted upon the undead dragon Viserion, the Night King brought down Eastwatch-by-the-Sea. Jon Snow and Queen Daenerys rallied the living at Winterfell. Amidst bitter blizzard and chaos, Arya Stark struck the death blow in the Godswood.',
          },
        ],
      },
    ],
  },
};

// Helper search index
export const allWikiDocuments = [
  ...getAllCharacters(),
  ...getAllHouses(),
  ...getAllLocations(),
  ...getAllEvents(),
  ...getAllCultures(),
  ...getAllMagic(),
  ...getAllSpecies(),
  ...getAllBooks(),
  ...getAllProfessions(),
];

export function findDocByTypeAndSlug(type: string, slug: string) {
  const norm = (type || '').toLowerCase();
  const allDocs = getAllWikiDocuments();

  if (norm === 'characters' || norm === 'character') {
    const found = allDocs.find((c) => (c._type === 'character') && c.slug?.current === slug);
    if (found) return found;
  }
  if (norm === 'houses' || norm === 'house') {
    const found = allDocs.find((h) => (h._type === 'house') && h.slug?.current === slug);
    if (found) return found;
  }
  if (norm === 'places' || norm === 'place' || norm === 'locations' || norm === 'location') {
    const found = allDocs.find((l) => (l._type === 'location' || l._type === 'place') && l.slug?.current === slug);
    if (found) return found;
  }
  if (norm === 'events' || norm === 'event' || norm === 'history') {
    const found = allDocs.find((e) => (e._type === 'event') && e.slug?.current === slug);
    if (found) return found;
    // Check canonical timeline docs
    const normalizedSlug = slug.replace(/^tl-/, '');
    if (CANONICAL_TIMELINE_DOCS[normalizedSlug]) {
      return CANONICAL_TIMELINE_DOCS[normalizedSlug];
    }
  }
  if (norm === 'cultures' || norm === 'culture') {
    const found = allDocs.find((c) => (c._type === 'culture') && c.slug?.current === slug);
    if (found) return found;
  }
  if (norm === 'magic' || norm === 'magic-artifacts' || norm === 'magics') {
    const found = allDocs.find((m) => (m._type === 'magic') && m.slug?.current === slug);
    if (found) return found;
  }
  if (norm === 'species' || norm === 'species-creatures') {
    const found = allDocs.find((s) => (s._type === 'species') && s.slug?.current === slug);
    if (found) return found;
  }
  if (norm === 'books' || norm === 'book') {
    const found = allDocs.find((b) => (b._type === 'book') && b.slug?.current === slug);
    if (found) return found;
  }

  // Generic fallback across all documents
  const generic = allDocs.find((d: any) => d.slug?.current === slug);
  if (generic) return generic;

  // Final check for timeline slug
  const cleanSlug = slug.replace(/^tl-/, '');
  if (CANONICAL_TIMELINE_DOCS[cleanSlug]) {
    return CANONICAL_TIMELINE_DOCS[cleanSlug];
  }

  // Dynamic resolution from central timeline store
  try {
    const allTimeline = getWorldTimeline();
    const tlEvent = allTimeline.find(
      (t) =>
        t.id === slug ||
        t.id.replace(/^tl-/, '') === slug ||
        t.id.replace(/^tl-/, '') === cleanSlug
    );
    if (tlEvent) {
      return {
        _id: `event-${tlEvent.id}`,
        _type: 'event',
        name: tlEvent.title,
        slug: { current: tlEvent.id.replace(/^tl-/, '') },
        date: tlEvent.year,
        outcome: `${tlEvent.type} chronicle of the ${tlEvent.era} era.${
          tlEvent.location ? ` Location: ${tlEvent.location}.` : ''
        }`,
        quickSummary: tlEvent.description,
        image:
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
        description: [
          {
            _type: 'block',
            _key: `blk-${tlEvent.id}`,
            style: 'normal',
            children: [
              {
                _key: `sp-${tlEvent.id}`,
                _type: 'span',
                text: tlEvent.description,
              },
            ],
          },
        ],
      };
    }
  } catch (e) {
    console.error('Failed to resolve dynamic timeline doc', e);
  }

  return undefined;
}

