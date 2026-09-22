/**
 * Production-Ready GROQ Queries for Worldbuilding Wiki
 * Handles deep dereferencing of Portable Text internal links, hover card payloads, and family trees.
 */

// Portable Text MarkDefs dereferencing projection for hover cards
const PORTABLE_TEXT_PROJECTION = `
  ...,
  markDefs[]{
    ...,
    _type == "internalLink" => {
      ...,
      reference->{
        _id,
        _type,
        name,
        slug,
        quickSummary,
        "image": image.asset->url,
        "sigil": sigil.asset->url,
        "mapImage": mapImage.asset->url,
        status,
        date,
        region,
        motto,
        "houseName": house->name
      }
    }
  }
`;

/**
 * Fetch Character Document by Slug with all Infobox relations and Portable Text links
 */
export const CHARACTER_BY_SLUG_QUERY = `
  *[_type == "character" && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    titles,
    aliases,
    age,
    status,
    culture,
    born,
    died,
    "image": image.asset->url,
    quickSummary,
    house->{
      _id,
      _type,
      name,
      slug,
      "sigil": sigil.asset->url,
      motto
    },
    father->{
      _id,
      _type,
      name,
      slug
    },
    mother->{
      _id,
      _type,
      name,
      slug
    },
    spouse->{
      _id,
      _type,
      name,
      slug
    },
    children[]->{
      _id,
      _type,
      name,
      slug
    },
    biography[]{
      ${PORTABLE_TEXT_PROJECTION}
    }
  }
`;

/**
 * Fetch House Document by Slug
 */
export const HOUSE_BY_SLUG_QUERY = `
  *[_type == "house" && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    "sigil": sigil.asset->url,
    motto,
    region,
    ancestralWeapon,
    founder,
    quickSummary,
    seat->{
      _id,
      _type,
      name,
      slug,
      region
    },
    currentLord->{
      _id,
      _type,
      name,
      slug,
      "image": image.asset->url,
      status
    },
    history[]{
      ${PORTABLE_TEXT_PROJECTION}
    }
  }
`;

/**
 * Fetch Location Document by Slug
 */
export const LOCATION_BY_SLUG_QUERY = `
  *[_type == "location" && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    region,
    locationType,
    "mapImage": mapImage.asset->url,
    quickSummary,
    notableLocations,
    ruler->{
      _id,
      _type,
      name,
      slug
    },
    details[]{
      ${PORTABLE_TEXT_PROJECTION}
    }
  }
`;

/**
 * Fetch Event Document by Slug
 */
export const EVENT_BY_SLUG_QUERY = `
  *[_type == "event" && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    date,
    outcome,
    quickSummary,
    "image": image.asset->url,
    location->{
      _id,
      _type,
      name,
      slug,
      region
    },
    involvedParties[]->{
      _id,
      _type,
      name,
      slug,
      "image": image.asset->url,
      "sigil": sigil.asset->url
    },
    description[]{
      ${PORTABLE_TEXT_PROJECTION}
    }
  }
`;

/**
 * Universal Hover Card Query (used when fetching dynamic card data on-demand if not pre-fetched)
 */
export const HOVER_PREVIEW_QUERY = `
  *[_id == $id][0]{
    _id,
    _type,
    name,
    "slug": slug.current,
    quickSummary,
    "image": coalesce(image.asset->url, sigil.asset->url, mapImage.asset->url),
    status,
    motto,
    region,
    date,
    "houseName": house->name
  }
`;

/**
 * Family Tree GROQ Query:
 * Fetches all characters of a given house (or lineage) with their parent/spouse/child relationships
 */
export const FAMILY_TREE_QUERY = `
  *[_type == "character" && (house->slug.current == $houseSlug || references(*[_type=="house" && slug.current == $houseSlug]._id))]{
    _id,
    name,
    "slug": slug.current,
    status,
    "avatar": image.asset->url,
    born,
    died,
    titles,
    "house": house->name,
    "fatherId": father._ref,
    "motherId": mother._ref,
    "spouseId": spouse._ref,
    "spouseName": spouse->name,
    "childrenIds": children[]._ref
  }
`;

/**
 * Wiki Global Directory Query (for Navigation & Instant Fuzzy Search)
 */
export const ALL_WIKI_DOCUMENTS_QUERY = `
  {
    "characters": *[_type == "character"] | order(name asc) {
      _id,
      _type,
      name,
      "slug": slug.current,
      titles,
      status,
      "houseName": house->name,
      quickSummary,
      "image": image.asset->url
    },
    "houses": *[_type == "house"] | order(name asc) {
      _id,
      _type,
      name,
      "slug": slug.current,
      motto,
      region,
      quickSummary,
      "sigil": sigil.asset->url
    },
    "locations": *[_type == "location"] | order(name asc) {
      _id,
      _type,
      name,
      "slug": slug.current,
      region,
      locationType,
      quickSummary,
      "mapImage": mapImage.asset->url
    },
    "events": *[_type == "event"] | order(date asc) {
      _id,
      _type,
      name,
      "slug": slug.current,
      date,
      outcome,
      quickSummary
    }
  }
`;
