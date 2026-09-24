/**
 * TypeScript interfaces for Sanity.io Worldbuilding Wiki Architecture
 */

export type WikiDocType =
  | 'character'
  | 'house'
  | 'location'
  | 'place'
  | 'culture'
  | 'event'
  | 'magic'
  | 'species'
  | 'book'
  | 'profession';

export type CharacterStatus = 'Alive' | 'Deceased' | 'Unknown' | 'Resurrected';

export interface SanityImageReference {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
    url?: string;
  };
  alt?: string;
  caption?: string;
}

export interface InternalLinkMark {
  _type: 'internalLink';
  _key: string;
  reference: {
    _ref: string;
    _type: WikiDocType;
    // dereferenced fields via GROQ or mock joins
    name?: string;
    title?: string;
    slug?: { current: string } | string;
    image?: string;
    sigil?: string;
    mapImage?: string;
    coverImage?: string;
    quickSummary?: string;
    status?: CharacterStatus;
    houseName?: string;
    region?: string;
    date?: string;
    motto?: string;
    category?: string;
  };
}

export interface PortableTextBlock {
  _type: 'block' | string;
  _key: string;
  style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote';
  children: Array<{
    _key: string;
    _type: 'span';
    text: string;
    marks?: string[]; // strings or keys referencing markDefs
  }>;
  markDefs?: InternalLinkMark[];
  listItem?: 'bullet' | 'number';
  level?: number;
}

export interface ProfessionDoc {
  _id: string;
  _type: 'profession';
  name: string;
  slug: { current: string };
  image: string;
  description: string;
  count?: number;
}

export interface CharacterSection {
  _key?: string;
  title: string;
  content: string;
}

export interface CharacterDoc {
  _id: string;
  _type: 'character';
  name: string;
  slug: { current: string };
  titles?: string[];
  professions?: ProfessionDoc[];
  house?: {
    _id: string;
    _type: 'house';
    name: string;
    slug: { current: string };
    sigil?: string;
  };
  location?: {
    _id: string;
    _type: 'place' | 'location';
    name: string;
    slug: { current: string };
  };
  image?: string;
  age?: string;
  status: CharacterStatus;
  aliases?: string[];
  culture?: string;
  born?: string;
  died?: string;
  father?: { _id: string; name: string; slug: { current: string } };
  mother?: { _id: string; name: string; slug: { current: string } };
  spouse?: { _id: string; name: string; slug: { current: string } };
  children?: Array<{ _id: string; name: string; slug: { current: string } }>;
  allegiance?: string;
  appearance?: string;
  character?: string;
  history?: string;
  recentEvents?: string;
  sections?: CharacterSection[];
  quickSummary: string;
  biography: PortableTextBlock[];
}

export interface HouseDoc {
  _id: string;
  _type: 'house';
  name: string;
  slug: { current: string };
  sigil: string;
  motto: string;
  seat?: {
    _id: string;
    _type: 'location' | 'place';
    name: string;
    slug: { current: string };
  };
  region: string;
  currentLord?: {
    _id: string;
    _type: 'character';
    name: string;
    slug: { current: string };
  };
  heir?: string;
  overlord?: string;
  ancestralWeapon?: string;
  founder?: string;
  quickSummary: string;
  history: PortableTextBlock[];
}

export interface PlaceDoc {
  _id: string;
  _type: 'place';
  name: string;
  slug: { current: string };
  region: string;
  locationType: string;
  image: string;
  ruler?: {
    _id: string;
    _type: 'house' | 'character';
    name: string;
    slug: { current: string };
  };
  quickSummary: string;
  notableLandmarks?: string[];
  details: PortableTextBlock[];
}

export interface LocationDoc {
  _id: string;
  _type: 'location';
  name: string;
  slug: { current: string };
  region: string;
  locationType: string;
  ruler?: {
    _id: string;
    _type: 'house' | 'character';
    name: string;
    slug: { current: string };
  };
  mapImage: string;
  quickSummary: string;
  details: PortableTextBlock[];
  notableLocations?: string[];
}

export interface CultureDoc {
  _id: string;
  _type: 'culture';
  name: string;
  slug: { current: string };
  image: string;
  region?: string;
  religion?: string;
  quickSummary: string;
  traditions: PortableTextBlock[];
}

export interface EventDoc {
  _id: string;
  _type: 'event';
  name: string;
  slug: { current: string };
  date: string;
  location?: {
    _id: string;
    _type: 'location' | 'place';
    name: string;
    slug: { current: string };
  };
  involvedParties?: Array<{
    _id: string;
    _type: 'character' | 'house';
    name: string;
    slug: { current: string };
    side?: string;
  }>;
  outcome: string;
  image?: string;
  quickSummary: string;
  description: PortableTextBlock[];
}

export interface MagicDoc {
  _id: string;
  _type: 'magic';
  name: string;
  slug: { current: string };
  image: string;
  origin?: string;
  dangerLevel?: string;
  quickSummary: string;
  rulesAndArtifacts: PortableTextBlock[];
}

export interface SpeciesDoc {
  _id: string;
  _type: 'species';
  name: string;
  slug: { current: string };
  image: string;
  habitat?: string;
  status?: string;
  quickSummary: string;
  description: PortableTextBlock[];
}

export interface BookDoc {
  _id: string;
  _type: 'book';
  title: string;
  name?: string;
  slug: { current: string };
  coverImage: string;
  releaseOrder: number;
  publicationYear?: string;
  pageCount?: number;
  quickSummary: string;
  synopsis: PortableTextBlock[];
}

export type WikiDoc =
  | CharacterDoc
  | HouseDoc
  | LocationDoc
  | PlaceDoc
  | CultureDoc
  | EventDoc
  | MagicDoc
  | SpeciesDoc
  | BookDoc
  | ProfessionDoc;

// Hover preview payload contract
export interface HoverPreviewData {
  _id: string;
  _type: WikiDocType;
  name: string;
  slug: string;
  image?: string;
  quickSummary: string;
  badge?: string;
  secondaryInfo?: string;
  status?: CharacterStatus;
}

// Tree node definition for React Flow
export interface FamilyTreeNodeData {
  id: string;
  name: string;
  slug: string;
  role?: string;
  house: string;
  status: CharacterStatus;
  avatar: string;
  born?: string;
  died?: string;
  titles?: string[];
  spouseName?: string;
}
