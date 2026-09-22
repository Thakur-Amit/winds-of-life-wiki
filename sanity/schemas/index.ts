import { character } from './character';
import { house } from './house';
import { place } from './place';
import { location } from './location';
import { culture } from './culture';
import { event } from './event';
import { magic } from './magic';
import { species } from './species';
import { book } from './book';
import { profession } from './profession';
import { internalLink } from './objects/internalLink';
import { portableText } from './objects/portableText';

export const schemaTypes = [
  // Object Types & Annotations
  internalLink,
  portableText,

  // Document Types
  character,
  house,
  place,
  location,
  culture,
  event,
  magic,
  species,
  book,
  profession,
];

export {
  character,
  house,
  place,
  location,
  culture,
  event,
  magic,
  species,
  book,
  profession,
  internalLink,
  portableText,
};
