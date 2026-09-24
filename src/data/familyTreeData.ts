import { Node, Edge } from '@xyflow/react';

export interface FamilyHouseOption {
  id: string;
  name: string;
  sigil: string;
  seat: string;
  motto: string;
  accentColor: string;
}

export const HOUSES_LIST: FamilyHouseOption[] = [
  {
    id: 'stark',
    name: 'House Stark',
    sigil: '🐺',
    seat: 'Winterfell',
    motto: 'Winter is Coming',
    accentColor: '#94a3b8',
  },
  {
    id: 'targaryen',
    name: 'House Targaryen',
    sigil: '🐉',
    seat: 'Dragonstone & King\'s Landing',
    motto: 'Fire and Blood',
    accentColor: '#ef4444',
  },
  {
    id: 'lannister',
    name: 'House Lannister',
    sigil: '🦁',
    seat: 'Casterly Rock',
    motto: 'Hear Me Roar!',
    accentColor: '#eab308',
  },
  {
    id: 'baratheon',
    name: 'House Baratheon',
    sigil: '🦌',
    seat: 'Storm\'s End',
    motto: 'Ours is the Fury',
    accentColor: '#f59e0b',
  },
  {
    id: 'greyjoy',
    name: 'House Greyjoy',
    sigil: '🦑',
    seat: 'Pyke',
    motto: 'We Do Not Sow',
    accentColor: '#0ea5e9',
  },
  {
    id: 'martell',
    name: 'House Martell',
    sigil: '☀️',
    seat: 'Sunspear',
    motto: 'Unbowed, Unbent, Unbroken',
    accentColor: '#f97316',
  },
  {
    id: 'tyrell',
    name: 'House Tyrell',
    sigil: '🌹',
    seat: 'Highgarden',
    motto: 'Growing Strong',
    accentColor: '#22c55e',
  },
  {
    id: 'arryn',
    name: 'House Arryn',
    sigil: '🦅',
    seat: 'The Eyrie',
    motto: 'As High as Honor',
    accentColor: '#38bdf8',
  },
];

// Initial Stark Nodes & Edges
export const INITIAL_STARK_NODES: Node[] = [
  {
    id: 'stark-rickard',
    type: 'characterNode',
    position: { x: 380, y: 30 },
    data: {
      id: 'rickard',
      name: 'Rickard Stark',
      slug: 'rickard-stark',
      role: 'Lord of Winterfell',
      house: 'House Stark',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
      born: '232 AC',
      died: '282 AC',
      spouseName: 'Lyarra Stark',
    },
  },
  {
    id: 'stark-brandon',
    type: 'characterNode',
    position: { x: 50, y: 220 },
    data: {
      id: 'brandon',
      name: 'Brandon Stark',
      slug: 'rickard-stark',
      role: 'The Wild Wolf / Heir',
      house: 'House Stark',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
      born: '262 AC',
      died: '282 AC',
    },
  },
  {
    id: 'stark-eddard',
    type: 'characterNode',
    position: { x: 350, y: 220 },
    data: {
      id: 'eddard',
      name: 'Eddard Stark',
      slug: 'eddard-stark',
      role: 'Warden of the North & Hand',
      house: 'House Stark',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      born: '263 AC',
      died: '298 AC',
      spouseName: 'Catelyn Tully',
    },
  },
  {
    id: 'stark-lyanna',
    type: 'characterNode',
    position: { x: 680, y: 220 },
    data: {
      id: 'lyanna',
      name: 'Lyanna Stark',
      slug: 'lyanna-stark',
      role: 'The She-Wolf & Secret Queen',
      house: 'House Stark',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
      born: '267 AC',
      died: '283 AC',
      spouseName: 'Rhaegar Targaryen',
    },
  },
  {
    id: 'stark-benjen',
    type: 'characterNode',
    position: { x: 980, y: 220 },
    data: {
      id: 'benjen',
      name: 'Benjen Stark',
      slug: 'benjen-stark',
      role: 'First Ranger of Night\'s Watch',
      house: 'House Stark',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
      born: '269 AC',
    },
  },
  {
    id: 'stark-robb',
    type: 'characterNode',
    position: { x: 40, y: 440 },
    data: {
      id: 'robb',
      name: 'Robb Stark',
      slug: 'robb-stark',
      role: 'The Young Wolf (King in North)',
      house: 'House Stark',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      born: '283 AC',
      died: '299 AC',
    },
  },
  {
    id: 'stark-sansa',
    type: 'characterNode',
    position: { x: 280, y: 440 },
    data: {
      id: 'sansa',
      name: 'Sansa Stark',
      slug: 'sansa-stark',
      role: 'Queen in the North',
      house: 'House Stark',
      status: 'Alive',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
      born: '286 AC',
    },
  },
  {
    id: 'stark-arya',
    type: 'characterNode',
    position: { x: 520, y: 440 },
    data: {
      id: 'arya',
      name: 'Arya Stark',
      slug: 'arya-stark',
      role: 'Hero of Winterfell',
      house: 'House Stark',
      status: 'Alive',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
      born: '289 AC',
    },
  },
  {
    id: 'stark-bran',
    type: 'characterNode',
    position: { x: 760, y: 440 },
    data: {
      id: 'bran',
      name: 'Bran Stark',
      slug: 'bran-stark',
      role: 'The Three-Eyed Raven / King',
      house: 'House Stark',
      status: 'Alive',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
      born: '290 AC',
    },
  },
  {
    id: 'stark-jon',
    type: 'characterNode',
    position: { x: 680, y: 640 },
    data: {
      id: 'jon',
      name: 'Jon Snow (Aegon Targaryen)',
      slug: 'jon-snow',
      role: '998th Lord Commander & True Heir',
      house: 'House Stark / Targaryen',
      status: 'Resurrected',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
      born: '283 AC',
    },
  },
];

export const INITIAL_STARK_EDGES: Edge[] = [
  { id: 'e-rickard-brandon', source: 'stark-rickard', target: 'stark-brandon', type: 'smoothstep', style: { stroke: '#737373', strokeWidth: 2 } },
  { id: 'e-rickard-eddard', source: 'stark-rickard', target: 'stark-eddard', type: 'smoothstep', style: { stroke: '#d4af37', strokeWidth: 2.5 } },
  { id: 'e-rickard-lyanna', source: 'stark-rickard', target: 'stark-lyanna', type: 'smoothstep', style: { stroke: '#737373', strokeWidth: 2 } },
  { id: 'e-rickard-benjen', source: 'stark-rickard', target: 'stark-benjen', type: 'smoothstep', style: { stroke: '#737373', strokeWidth: 2 } },
  { id: 'e-eddard-robb', source: 'stark-eddard', target: 'stark-robb', type: 'smoothstep', style: { stroke: '#d4af37', strokeWidth: 2 } },
  { id: 'e-eddard-sansa', source: 'stark-eddard', target: 'stark-sansa', type: 'smoothstep', style: { stroke: '#d4af37', strokeWidth: 2 } },
  { id: 'e-eddard-arya', source: 'stark-eddard', target: 'stark-arya', type: 'smoothstep', style: { stroke: '#d4af37', strokeWidth: 2 } },
  { id: 'e-eddard-bran', source: 'stark-eddard', target: 'stark-bran', type: 'smoothstep', style: { stroke: '#d4af37', strokeWidth: 2 } },
  { id: 'e-lyanna-jon', source: 'stark-lyanna', target: 'stark-jon', type: 'smoothstep', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } },
];

// Initial Targaryen Nodes & Edges
export const INITIAL_TARGARYEN_NODES: Node[] = [
  {
    id: 'targ-aerys',
    type: 'characterNode',
    position: { x: 420, y: 30 },
    data: {
      id: 'aerys',
      name: 'Aerys II Targaryen',
      slug: 'aerys-ii-targaryen',
      role: 'The Mad King',
      house: 'House Targaryen',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
      born: '244 AC',
      died: '283 AC',
      spouseName: 'Rhaella Targaryen',
    },
  },
  {
    id: 'targ-rhaegar',
    type: 'characterNode',
    position: { x: 150, y: 220 },
    data: {
      id: 'rhaegar',
      name: 'Rhaegar Targaryen',
      slug: 'rhaegar-targaryen',
      role: 'The Last Dragon & Crown Prince',
      house: 'House Targaryen',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      born: '259 AC',
      died: '283 AC',
      spouseName: 'Elia Martell & Lyanna Stark',
    },
  },
  {
    id: 'targ-viserys',
    type: 'characterNode',
    position: { x: 450, y: 220 },
    data: {
      id: 'viserys',
      name: 'Viserys Targaryen',
      slug: 'viserys-targaryen',
      role: 'The Beggar King',
      house: 'House Targaryen',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
      born: '276 AC',
      died: '298 AC',
    },
  },
  {
    id: 'targ-daenerys',
    type: 'characterNode',
    position: { x: 750, y: 220 },
    data: {
      id: 'daenerys',
      name: 'Daenerys Targaryen',
      slug: 'daenerys-targaryen',
      role: 'Mother of Dragons & Breaker of Chains',
      house: 'House Targaryen',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      born: '284 AC',
      died: '305 AC',
      spouseName: 'Khal Drogo',
    },
  },
  {
    id: 'targ-jon',
    type: 'characterNode',
    position: { x: 150, y: 440 },
    data: {
      id: 'jon-targ',
      name: 'Aegon Targaryen (Jon Snow)',
      slug: 'jon-snow',
      role: 'Rightful Heir to Iron Throne',
      house: 'House Targaryen',
      status: 'Alive',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
      born: '283 AC',
    },
  },
];

export const INITIAL_TARGARYEN_EDGES: Edge[] = [
  { id: 'e-aerys-rhaegar', source: 'targ-aerys', target: 'targ-rhaegar', type: 'smoothstep', style: { stroke: '#ef4444', strokeWidth: 2.5 } },
  { id: 'e-aerys-viserys', source: 'targ-aerys', target: 'targ-viserys', type: 'smoothstep', style: { stroke: '#737373', strokeWidth: 2 } },
  { id: 'e-aerys-daenerys', source: 'targ-aerys', target: 'targ-daenerys', type: 'smoothstep', style: { stroke: '#ef4444', strokeWidth: 2.5 } },
  { id: 'e-rhaegar-jon', source: 'targ-rhaegar', target: 'targ-jon', type: 'smoothstep', style: { stroke: '#ef4444', strokeWidth: 2 } },
];

// Initial Lannister Nodes & Edges
export const INITIAL_LANNISTER_NODES: Node[] = [
  {
    id: 'lann-tywin',
    type: 'characterNode',
    position: { x: 400, y: 30 },
    data: {
      id: 'tywin',
      name: 'Tywin Lannister',
      slug: 'tywin-lannister',
      role: 'Lord of Casterly Rock & Shield of Lannisport',
      house: 'House Lannister',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
      born: '242 AC',
      died: '300 AC',
      spouseName: 'Joanna Lannister',
    },
  },
  {
    id: 'lann-cersei',
    type: 'characterNode',
    position: { x: 120, y: 220 },
    data: {
      id: 'cersei',
      name: 'Cersei Lannister',
      slug: 'cersei-lannister',
      role: 'Queen of the Seven Kingdoms',
      house: 'House Lannister',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
      born: '266 AC',
      died: '305 AC',
      spouseName: 'Robert Baratheon',
    },
  },
  {
    id: 'lann-jaime',
    type: 'characterNode',
    position: { x: 420, y: 220 },
    data: {
      id: 'jaime',
      name: 'Jaime Lannister',
      slug: 'jaime-lannister',
      role: 'The Kingslayer / Lord Commander',
      house: 'House Lannister',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      born: '266 AC',
      died: '305 AC',
    },
  },
  {
    id: 'lann-tyrion',
    type: 'characterNode',
    position: { x: 720, y: 220 },
    data: {
      id: 'tyrion',
      name: 'Tyrion Lannister',
      slug: 'tyrion-lannister',
      role: 'The Imp / Hand of the King',
      house: 'House Lannister',
      status: 'Alive',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
      born: '273 AC',
    },
  },
  {
    id: 'lann-joffrey',
    type: 'characterNode',
    position: { x: 40, y: 440 },
    data: {
      id: 'joffrey',
      name: 'Joffrey Baratheon/Lannister',
      slug: 'joffrey-baratheon',
      role: 'King on the Iron Throne',
      house: 'House Lannister',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
      born: '286 AC',
      died: '300 AC',
    },
  },
  {
    id: 'lann-tommen',
    type: 'characterNode',
    position: { x: 280, y: 440 },
    data: {
      id: 'tommen',
      name: 'Tommen Baratheon/Lannister',
      slug: 'tommen-baratheon',
      role: 'King on the Iron Throne',
      house: 'House Lannister',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
      born: '291 AC',
      died: '303 AC',
    },
  },
];

export const INITIAL_LANNISTER_EDGES: Edge[] = [
  { id: 'e-tywin-cersei', source: 'lann-tywin', target: 'lann-cersei', type: 'smoothstep', style: { stroke: '#eab308', strokeWidth: 2 } },
  { id: 'e-tywin-jaime', source: 'lann-tywin', target: 'lann-jaime', type: 'smoothstep', style: { stroke: '#eab308', strokeWidth: 2 } },
  { id: 'e-tywin-tyrion', source: 'lann-tywin', target: 'lann-tyrion', type: 'smoothstep', style: { stroke: '#eab308', strokeWidth: 2 } },
  { id: 'e-cersei-joffrey', source: 'lann-cersei', target: 'lann-joffrey', type: 'smoothstep', style: { stroke: '#d4af37', strokeWidth: 2 } },
  { id: 'e-cersei-tommen', source: 'lann-cersei', target: 'lann-tommen', type: 'smoothstep', style: { stroke: '#d4af37', strokeWidth: 2 } },
];

// Initial Baratheon Nodes & Edges
export const INITIAL_BARATHEON_NODES: Node[] = [
  {
    id: 'bara-steffon',
    type: 'characterNode',
    position: { x: 380, y: 30 },
    data: {
      id: 'steffon',
      name: 'Steffon Baratheon',
      slug: 'steffon-baratheon',
      role: 'Lord of Storm\'s End',
      house: 'House Baratheon',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
      born: '246 AC',
      died: '278 AC',
      spouseName: 'Cassana Estermont',
    },
  },
  {
    id: 'bara-robert',
    type: 'characterNode',
    position: { x: 80, y: 220 },
    data: {
      id: 'robert',
      name: 'Robert I Baratheon',
      slug: 'robert-baratheon',
      role: 'King of the Andals & First Men',
      house: 'House Baratheon',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      born: '262 AC',
      died: '298 AC',
      spouseName: 'Cersei Lannister',
    },
  },
  {
    id: 'bara-stannis',
    type: 'characterNode',
    position: { x: 380, y: 220 },
    data: {
      id: 'stannis',
      name: 'Stannis Baratheon',
      slug: 'stannis-baratheon',
      role: 'Lord of Dragonstone & Azor Ahai Claimant',
      house: 'House Baratheon',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
      born: '264 AC',
      died: '302 AC',
      spouseName: 'Selyse Florent',
    },
  },
  {
    id: 'bara-renly',
    type: 'characterNode',
    position: { x: 680, y: 220 },
    data: {
      id: 'renly',
      name: 'Renly Baratheon',
      slug: 'renly-baratheon',
      role: 'Lord of Storm\'s End & King in Highgarden',
      house: 'House Baratheon',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
      born: '277 AC',
      died: '299 AC',
      spouseName: 'Margaery Tyrell',
    },
  },
  {
    id: 'bara-gendry',
    type: 'characterNode',
    position: { x: 80, y: 440 },
    data: {
      id: 'gendry',
      name: 'Gendry Baratheon',
      slug: 'gendry-baratheon',
      role: 'Lord of Storm\'s End & Master Blacksmith',
      house: 'House Baratheon',
      status: 'Alive',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
      born: '284 AC',
    },
  },
];

export const INITIAL_BARATHEON_EDGES: Edge[] = [
  { id: 'e-steffon-robert', source: 'bara-steffon', target: 'bara-robert', type: 'smoothstep', style: { stroke: '#f59e0b', strokeWidth: 2.5 } },
  { id: 'e-steffon-stannis', source: 'bara-steffon', target: 'bara-stannis', type: 'smoothstep', style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-steffon-renly', source: 'bara-steffon', target: 'bara-renly', type: 'smoothstep', style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-robert-gendry', source: 'bara-robert', target: 'bara-gendry', type: 'smoothstep', style: { stroke: '#f59e0b', strokeWidth: 2 } },
];

const FAMILY_TREE_STORAGE_KEY = 'droplet-spire_family_trees';

// Initial Greyjoy Nodes & Edges
export const INITIAL_GREYJOY_NODES: Node[] = [
  {
    id: 'greyjoy-balon',
    type: 'characterNode',
    position: { x: 380, y: 50 },
    data: {
      id: 'balon',
      name: 'Balon Greyjoy',
      slug: 'balon-greyjoy',
      role: 'Lord of the Iron Islands & Salt King',
      house: 'House Greyjoy',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      born: '241 AC',
      died: '299 AC',
      spouseName: 'Alannys Harlaw',
    },
  },
  {
    id: 'greyjoy-euron',
    type: 'characterNode',
    position: { x: 120, y: 50 },
    data: {
      id: 'euron',
      name: 'Euron Greyjoy (Crow’s Eye)',
      slug: 'euron-greyjoy',
      role: 'King of the Iron Islands & Sorcerer-Captain',
      house: 'House Greyjoy',
      status: 'Alive',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
      born: '245 AC',
    },
  },
  {
    id: 'greyjoy-yara',
    type: 'characterNode',
    position: { x: 260, y: 250 },
    data: {
      id: 'yara',
      name: 'Yara (Asha) Greyjoy',
      slug: 'yara-greyjoy',
      role: 'Lady of Pyke & Sea Captain',
      house: 'House Greyjoy',
      status: 'Alive',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
      born: '276 AC',
    },
  },
  {
    id: 'greyjoy-theon',
    type: 'characterNode',
    position: { x: 500, y: 250 },
    data: {
      id: 'theon',
      name: 'Theon Greyjoy (Prince of Winterfell)',
      slug: 'theon-greyjoy',
      role: 'Heir to Pyke & Stark Ward',
      house: 'House Greyjoy',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
      born: '278 AC',
      died: '305 AC',
    },
  },
];

export const INITIAL_GREYJOY_EDGES: Edge[] = [
  {
    id: 'e-balon-yara',
    source: 'greyjoy-balon',
    target: 'greyjoy-yara',
    type: 'smoothstep',
    style: { stroke: '#0ea5e9', strokeWidth: 2 },
  },
  {
    id: 'e-balon-theon',
    source: 'greyjoy-balon',
    target: 'greyjoy-theon',
    type: 'smoothstep',
    style: { stroke: '#0ea5e9', strokeWidth: 2 },
  },
];

// Initial Martell Nodes & Edges
export const INITIAL_MARTELL_NODES: Node[] = [
  {
    id: 'martell-doran',
    type: 'characterNode',
    position: { x: 380, y: 50 },
    data: {
      id: 'doran',
      name: 'Doran Martell',
      slug: 'doran-martell',
      role: 'Prince of Dorne & Lord of Sunspear',
      house: 'House Martell',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      born: '248 AC',
      died: '300 AC',
      spouseName: 'Mellario of Norvos',
    },
  },
  {
    id: 'martell-oberyn',
    type: 'characterNode',
    position: { x: 120, y: 50 },
    data: {
      id: 'oberyn',
      name: 'Oberyn Martell (The Red Viper)',
      slug: 'oberyn-martell',
      role: 'Prince of Dorne & Master of Poisons',
      house: 'House Martell',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
      born: '258 AC',
      died: '299 AC',
      spouseName: 'Ellaria Sand',
    },
  },
  {
    id: 'martell-arianne',
    type: 'characterNode',
    position: { x: 380, y: 250 },
    data: {
      id: 'arianne',
      name: 'Arianne Martell',
      slug: 'arianne-martell',
      role: 'Princess of Dorne & Heiress of Sunspear',
      house: 'House Martell',
      status: 'Alive',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      born: '276 AC',
    },
  },
];

export const INITIAL_MARTELL_EDGES: Edge[] = [
  {
    id: 'e-doran-arianne',
    source: 'martell-doran',
    target: 'martell-arianne',
    type: 'smoothstep',
    style: { stroke: '#f97316', strokeWidth: 2 },
  },
];

// Initial Tyrell Nodes & Edges
export const INITIAL_TYRELL_NODES: Node[] = [
  {
    id: 'tyrell-olenna',
    type: 'characterNode',
    position: { x: 380, y: 30 },
    data: {
      id: 'olenna',
      name: 'Olenna Tyrell (Queen of Thorns)',
      slug: 'olenna-tyrell',
      role: 'Dowager Lady of Highgarden',
      house: 'House Tyrell',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
      born: '228 AC',
      died: '304 AC',
      spouseName: 'Luthor Tyrell',
    },
  },
  {
    id: 'tyrell-mace',
    type: 'characterNode',
    position: { x: 380, y: 200 },
    data: {
      id: 'mace',
      name: 'Mace Tyrell',
      slug: 'mace-tyrell',
      role: 'Lord of Highgarden & Warden of South',
      house: 'House Tyrell',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      born: '256 AC',
      died: '303 AC',
      spouseName: 'Alerie Hightower',
    },
  },
  {
    id: 'tyrell-loras',
    type: 'characterNode',
    position: { x: 220, y: 380 },
    data: {
      id: 'loras',
      name: 'Loras Tyrell (Knight of Flowers)',
      slug: 'loras-tyrell',
      role: 'Lord Commander / Knight of Kingsguard',
      house: 'House Tyrell',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
      born: '282 AC',
      died: '303 AC',
    },
  },
  {
    id: 'tyrell-margaery',
    type: 'characterNode',
    position: { x: 540, y: 380 },
    data: {
      id: 'margaery',
      name: 'Margaery Tyrell',
      slug: 'margaery-tyrell',
      role: 'Queen of the Seven Kingdoms',
      house: 'House Tyrell',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      born: '283 AC',
      died: '303 AC',
    },
  },
];

export const INITIAL_TYRELL_EDGES: Edge[] = [
  {
    id: 'e-olenna-mace',
    source: 'tyrell-olenna',
    target: 'tyrell-mace',
    type: 'smoothstep',
    style: { stroke: '#22c55e', strokeWidth: 2 },
  },
  {
    id: 'e-mace-loras',
    source: 'tyrell-mace',
    target: 'tyrell-loras',
    type: 'smoothstep',
    style: { stroke: '#22c55e', strokeWidth: 2 },
  },
  {
    id: 'e-mace-margaery',
    source: 'tyrell-mace',
    target: 'tyrell-margaery',
    type: 'smoothstep',
    style: { stroke: '#22c55e', strokeWidth: 2 },
  },
];

// Initial Arryn Nodes & Edges
export const INITIAL_ARRYN_NODES: Node[] = [
  {
    id: 'arryn-jon',
    type: 'characterNode',
    position: { x: 380, y: 50 },
    data: {
      id: 'jon-arryn',
      name: 'Jon Arryn',
      slug: 'jon-arryn',
      role: 'Lord of the Eyrie & Hand of the King',
      house: 'House Arryn',
      status: 'Deceased',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
      born: '220 AC',
      died: '298 AC',
      spouseName: 'Lysa Tully',
    },
  },
  {
    id: 'arryn-robin',
    type: 'characterNode',
    position: { x: 380, y: 250 },
    data: {
      id: 'robin-arryn',
      name: 'Robert (Sweetrobin) Arryn',
      slug: 'robin-arryn',
      role: 'Lord of the Eyrie & Defender of the Vale',
      house: 'House Arryn',
      status: 'Alive',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
      born: '292 AC',
    },
  },
];

export const INITIAL_ARRYN_EDGES: Edge[] = [
  {
    id: 'e-jon-robin',
    source: 'arryn-jon',
    target: 'arryn-robin',
    type: 'smoothstep',
    style: { stroke: '#38bdf8', strokeWidth: 2 },
  },
];

export interface HouseTreeData {
  nodes: Node[];
  edges: Edge[];
}

export function getHouseTree(houseId: string): HouseTreeData {
  try {
    const raw = localStorage.getItem(FAMILY_TREE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed[houseId] && Array.isArray(parsed[houseId].nodes) && parsed[houseId].nodes.length > 0) {
        return parsed[houseId];
      }
    }
  } catch (e) {
    console.error('Failed to get house tree from localStorage', e);
  }

  // Fallbacks
  switch (houseId) {
    case 'targaryen':
      return { nodes: INITIAL_TARGARYEN_NODES, edges: INITIAL_TARGARYEN_EDGES };
    case 'lannister':
      return { nodes: INITIAL_LANNISTER_NODES, edges: INITIAL_LANNISTER_EDGES };
    case 'baratheon':
      return { nodes: INITIAL_BARATHEON_NODES, edges: INITIAL_BARATHEON_EDGES };
    case 'greyjoy':
      return { nodes: INITIAL_GREYJOY_NODES, edges: INITIAL_GREYJOY_EDGES };
    case 'martell':
      return { nodes: INITIAL_MARTELL_NODES, edges: INITIAL_MARTELL_EDGES };
    case 'tyrell':
      return { nodes: INITIAL_TYRELL_NODES, edges: INITIAL_TYRELL_EDGES };
    case 'arryn':
      return { nodes: INITIAL_ARRYN_NODES, edges: INITIAL_ARRYN_EDGES };
    case 'stark':
    default:
      return { nodes: INITIAL_STARK_NODES, edges: INITIAL_STARK_EDGES };
  }
}

export function saveHouseTree(houseId: string, tree: HouseTreeData): void {
  try {
    let allTrees: Record<string, HouseTreeData> = {};
    const raw = localStorage.getItem(FAMILY_TREE_STORAGE_KEY);
    if (raw) {
      allTrees = JSON.parse(raw);
    }
    allTrees[houseId] = tree;
    localStorage.setItem(FAMILY_TREE_STORAGE_KEY, JSON.stringify(allTrees));
    window.dispatchEvent(new Event('droplet-spire-family-tree-updated'));
  } catch (e) {
    console.error('Failed to save house tree', e);
  }
}

export function resetHouseTree(houseId: string): HouseTreeData {
  let defaultTree: HouseTreeData;
  switch (houseId) {
    case 'targaryen':
      defaultTree = { nodes: INITIAL_TARGARYEN_NODES, edges: INITIAL_TARGARYEN_EDGES };
      break;
    case 'lannister':
      defaultTree = { nodes: INITIAL_LANNISTER_NODES, edges: INITIAL_LANNISTER_EDGES };
      break;
    case 'baratheon':
      defaultTree = { nodes: INITIAL_BARATHEON_NODES, edges: INITIAL_BARATHEON_EDGES };
      break;
    case 'greyjoy':
      defaultTree = { nodes: INITIAL_GREYJOY_NODES, edges: INITIAL_GREYJOY_EDGES };
      break;
    case 'martell':
      defaultTree = { nodes: INITIAL_MARTELL_NODES, edges: INITIAL_MARTELL_EDGES };
      break;
    case 'tyrell':
      defaultTree = { nodes: INITIAL_TYRELL_NODES, edges: INITIAL_TYRELL_EDGES };
      break;
    case 'arryn':
      defaultTree = { nodes: INITIAL_ARRYN_NODES, edges: INITIAL_ARRYN_EDGES };
      break;
    case 'stark':
    default:
      defaultTree = { nodes: INITIAL_STARK_NODES, edges: INITIAL_STARK_EDGES };
      break;
  }
  saveHouseTree(houseId, defaultTree);
  return defaultTree;
}
