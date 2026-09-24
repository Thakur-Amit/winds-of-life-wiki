export interface TimelineEvent {
  id: string;
  year: string; // e.g. "12,000 BC", "282 AC"
  numericYear: number; // For sorting: BC as negative (e.g. -12000), AC as positive (e.g. 282)
  era: 'Dawn & Ancient' | 'Valyrian & Targaryen' | 'Rebellion & Modern';
  title: string;
  description: string;
  location?: string;
  houses?: string[];
  characters?: string[];
  type: 'War' | 'Treaty' | 'Cataclysm' | 'Dynasty' | 'Discovery';
  isCanon?: boolean;
}

export const INITIAL_WORLD_TIMELINE: TimelineEvent[] = [
  {
    id: 'tl-dawn-age',
    year: '12,000 BC',
    numericYear: -12000,
    era: 'Dawn & Ancient',
    title: 'The Dawn Age & Arrival of the First Men',
    description:
      'The First Men cross the Arm of Dorne into Antos, clashing with the indigenous Children of the Forest until the sacred Pact of the Isle of Faces is sealed.',
    location: 'Isle of Faces, God\'s Eye',
    houses: ['First Men', 'Children of the Forest'],
    characters: ['Garth Greenhand', 'Bran the Builder'],
    type: 'Treaty',
    isCanon: true,
  },
  {
    id: 'tl-long-night',
    year: '8,000 BC',
    numericYear: -8000,
    era: 'Dawn & Ancient',
    title: 'The Long Night & Raising of the Wall',
    description:
      'A winter of relentless darkness blankets the world as the Others emerge from the Lands of Always Winter. The Last Hero and the Night\'s Watch defeat them at the Battle for the Dawn. Brandon the Builder raises the 700-foot ice Wall.',
    location: 'The Far North & The Wall',
    houses: ['House Stark', 'Night\'s Watch'],
    characters: ['The Last Hero', 'Brandon the Builder', 'Night\'s King'],
    type: 'War',
    isCanon: true,
  },
  {
    id: 'tl-andal-invasion',
    year: '6,000 BC',
    numericYear: -6000,
    era: 'Dawn & Ancient',
    title: 'The Andal Invasion of Antos',
    description:
      'The Andals sail from Eclind bearing steel weapons and carving seven-pointed stars into their flesh, conquering the First Men kingdoms and bringing the Faith of the Seven, except in the stubborn North.',
    location: 'The Vale & Antos',
    houses: ['House Arryn', 'Andal Chieftains'],
    characters: ['Artys Arryn', 'The Falcon Knight'],
    type: 'War',
    isCanon: true,
  },
  {
    id: 'tl-valyria-rise',
    year: '5,000 BC',
    numericYear: -5000,
    era: 'Valyrian & Targaryen',
    title: 'Rise of the Valyrian Freehold',
    description:
      'Valyrian sheep herders discover dragons in the Fourteen Fires volcanoes and tame them with sorcery, building the greatest empire in the Known World.',
    location: 'Valyrian Peninsula, Eclind',
    houses: ['House Targaryen', 'House Belaerys', 'Valyrian Dragonlords'],
    characters: ['Valyrian Archmages'],
    type: 'Discovery',
    isCanon: true,
  },
  {
    id: 'tl-doom-valyria',
    year: '114 BC',
    numericYear: -114,
    era: 'Valyrian & Targaryen',
    title: 'The Doom of Valyria',
    description:
      'Every volcano in the Fourteen Fires erupts simultaneously, shattering the Valyrian Freehold into boiling seas of ash. Twelve years earlier, Daenys the Dreamer foresaw the cataclysm, allowing House Targaryen to escape to Dragonstone.',
    location: 'Valyria, The Smoking Sea',
    houses: ['House Targaryen', 'House Velaryon'],
    characters: ['Daenys the Dreamer', 'Aenar Targaryen'],
    type: 'Cataclysm',
    isCanon: true,
  },
  {
    id: 'tl-aegons-conquest',
    year: '2 BC – 1 AC',
    numericYear: 1,
    era: 'Valyrian & Targaryen',
    title: 'Aegon\'s Conquest of the Seven Kingdoms',
    description:
      'Aegon Targaryen and his sister-wives Visenya and Rhaenys land at the Blackwater Rush with their three dragons (Balerion, Vhagar, Meraxes). Following the Field of Fire and the Burning of Harrenhal, six kingdoms bend the knee and the Iron Throne is forged.',
    location: 'Antos, King\'s Landing',
    houses: ['House Targaryen', 'House Stark', 'House Lannister', 'House Gardener'],
    characters: ['Aegon I Targaryen', 'Visenya Targaryen', 'Rhaenys Targaryen', 'Torrhen Stark'],
    type: 'Dynasty',
    isCanon: true,
  },
  {
    id: 'tl-dance-dragons',
    year: '129 – 131 AC',
    numericYear: 129,
    era: 'Valyrian & Targaryen',
    title: 'The Dance of the Dragons',
    description:
      'A devastating civil war between Princess Rhaenyra (the Blacks) and her half-brother King Aegon II (the Greens) tears the realm apart, leading to the near-extinction of dragons.',
    location: 'Dragonstone, King\'s Landing, God\'s Eye',
    houses: ['House Targaryen', 'House Velaryon', 'House Hightower'],
    characters: ['Rhaenyra Targaryen', 'Daemon Targaryen', 'Aemond Targaryen', 'Aegon II Targaryen'],
    type: 'War',
    isCanon: true,
  },
  {
    id: 'tl-blackfyre-rebellion',
    year: '196 AC',
    numericYear: 196,
    era: 'Valyrian & Targaryen',
    title: 'The First Blackfyre Rebellion',
    description:
      'Daemon Blackfyre, legitimized bastard son of Aegon IV, wields the ancestral sword Blackfyre and rebels against King Daeron II. The rebellion collapses at the bloody Battle of the Redgrass Field.',
    location: 'The Redgrass Field, The Reach',
    houses: ['House Targaryen', 'House Blackfyre'],
    characters: ['Daemon Blackfyre', 'Daeron II Targaryen', 'Brynden Rivers (Bloodraven)', 'Aegor Rivers (Bittersteel)'],
    type: 'War',
    isCanon: true,
  },
  {
    id: 'tl-harrenhal-tourney',
    year: '281 AC',
    numericYear: 281,
    era: 'Rebellion & Modern',
    title: 'The Tourney at Harrenhal (The Year of the False Spring)',
    description:
      'Lord Walter Whent hosts the greatest tourney of the era. Crown Prince Rhaegar Targaryen wins the joust and shocks the realm by placing the blue rose crown of the Queen of Love and Beauty in the lap of Lyanna Stark.',
    location: 'Harrenhal, Riverlands',
    houses: ['House Targaryen', 'House Stark', 'House Baratheon', 'House Whent'],
    characters: ['Rhaegar Targaryen', 'Lyanna Stark', 'Eddard Stark', 'Robert Baratheon', 'Aerys II Targaryen'],
    type: 'Treaty',
    isCanon: true,
  },
  {
    id: 'tl-roberts-rebellion',
    year: '282 – 283 AC',
    numericYear: 282,
    era: 'Rebellion & Modern',
    title: 'Robert\'s Rebellion (War of the Usurper)',
    description:
      'Following King Aerys II executing Rickard and Brandon Stark and demanding the heads of Robert Baratheon and Ned Stark, the rebel houses rise. Robert slays Prince Rhaegar at the Trident, the Lannisters sack King\'s Landing, and Robert claims the Iron Throne.',
    location: 'The Trident, King\'s Landing, Tower of Joy',
    houses: ['House Baratheon', 'House Stark', 'House Arryn', 'House Tully', 'House Targaryen', 'House Lannister'],
    characters: ['Robert Baratheon', 'Eddard Stark', 'Rhaegar Targaryen', 'Jaime Lannister', 'Aerys II Targaryen'],
    type: 'War',
    isCanon: true,
  },
  {
    id: 'tl-greyjoy-rebellion',
    year: '289 AC',
    numericYear: 289,
    era: 'Rebellion & Modern',
    title: 'The Greyjoy Rebellion',
    description:
      'Balon Greyjoy crowns himself King of the Iron Islands and burns the Lannister fleet. King Robert and Lord Eddard besiege Pyke, forcing Balon to bend the knee and surrender his son Theon as a hostage.',
    location: 'Pyke, Iron Islands',
    houses: ['House Greyjoy', 'House Baratheon', 'House Stark'],
    characters: ['Balon Greyjoy', 'Robert Baratheon', 'Eddard Stark', 'Theon Greyjoy', 'Thoros of Myr'],
    type: 'War',
    isCanon: true,
  },
  {
    id: 'tl-war-five-kings',
    year: '298 – 300 AC',
    numericYear: 298,
    era: 'Rebellion & Modern',
    title: 'The War of the Five Kings',
    description:
      'Following the execution of Lord Eddard Stark, five claimants contend for sovereignty: Joffrey Baratheon, Robb Stark, Stannis Baratheon, Renly Baratheon, and Balon Greyjoy, bringing ruin to the Riverlands.',
    location: 'Riverlands, King\'s Landing, Winterfell',
    houses: ['House Stark', 'House Lannister', 'House Baratheon', 'House Greyjoy'],
    characters: ['Robb Stark', 'Joffrey Baratheon', 'Stannis Baratheon', 'Renly Baratheon', 'Tywin Lannister'],
    type: 'War',
    isCanon: true,
  },
  {
    id: 'tl-long-night-returns',
    year: '304 – 305 AC',
    numericYear: 304,
    era: 'Rebellion & Modern',
    title: 'The Second Long Night & The Battle of Winterfell',
    description:
      'The Night King breaches the Wall with an undead dragon. The living unite at Winterfell under Jon Snow and Daenerys Targaryen, where Arya Stark slays the Night King.',
    location: 'Winterfell, King\'s Landing',
    houses: ['House Stark', 'House Targaryen', 'Night\'s Watch'],
    characters: ['Jon Snow', 'Daenerys Targaryen', 'Arya Stark', 'Bran Stark', 'The Night King'],
    type: 'War',
    isCanon: true,
  },
];

const TIMELINE_STORAGE_KEY = 'droplet-spire_world_timeline';

export function getWorldTimeline(): TimelineEvent[] {
  try {
    const raw = localStorage.getItem(TIMELINE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => a.numericYear - b.numericYear);
      }
    }
  } catch (e) {
    console.error('Failed to read world timeline from localStorage', e);
  }
  return [...INITIAL_WORLD_TIMELINE].sort((a, b) => a.numericYear - b.numericYear);
}

export function saveWorldTimeline(events: TimelineEvent[]): void {
  try {
    localStorage.setItem(TIMELINE_STORAGE_KEY, JSON.stringify(events));
    // Dispatch custom event so all active views update immediately
    window.dispatchEvent(new Event('droplet-spire-timeline-updated'));
  } catch (e) {
    console.error('Failed to save world timeline', e);
  }
}

export function addTimelineEvent(newEvent: Omit<TimelineEvent, 'id'>): TimelineEvent {
  const current = getWorldTimeline();
  const id = 'tl-' + Date.now();
  const eventWithId: TimelineEvent = { ...newEvent, id };
  const updated = [...current, eventWithId].sort((a, b) => a.numericYear - b.numericYear);
  saveWorldTimeline(updated);
  return eventWithId;
}

export function updateTimelineEvent(id: string, updates: Partial<TimelineEvent>): TimelineEvent[] {
  const current = getWorldTimeline();
  const updated = current.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev));
  updated.sort((a, b) => a.numericYear - b.numericYear);
  saveWorldTimeline(updated);
  return updated;
}

export function deleteTimelineEvent(id: string): TimelineEvent[] {
  const current = getWorldTimeline();
  const updated = current.filter((ev) => ev.id !== id);
  saveWorldTimeline(updated);
  return updated;
}

export function resetWorldTimeline(): TimelineEvent[] {
  saveWorldTimeline([...INITIAL_WORLD_TIMELINE]);
  return [...INITIAL_WORLD_TIMELINE];
}
