import type { Level } from './types'

export const levels: Level[] = [
  {
    id: 1,
    name: { tr: 'Sıcak Ekmek', en: 'Fresh Bread' },
    intro: {
      tr: 'Fırını evlerden birinin yanına yerleştirelim.',
      en: 'Let’s place the bakery next to a home.',
    },
    size: 3,
    tutorial: 'firstPlacement',
    items: [
      { id: 'home-1', type: 'home', position: { row: 1, col: 1 }, fixed: true },
      { id: 'home-2', type: 'home', position: { row: 2, col: 2 }, fixed: true },
      { id: 'bakery-1', type: 'bakery' },
    ],
    rules: [{ id: 'bakery-home', kind: 'adjacent', subject: 'bakery', target: 'home' }],
  },
  {
    id: 2,
    name: { tr: 'Sessiz Park', en: 'Peaceful Park' },
    intro: {
      tr: 'Park için ana yoldan uzak, sakin bir yer bulalım.',
      en: 'Let’s find a peaceful spot away from the main road.',
    },
    size: 3,
    tutorial: 'distance',
    items: [
      { id: 'road-1', type: 'road', position: { row: 2, col: 0 }, fixed: true },
      { id: 'road-2', type: 'road', position: { row: 2, col: 1 }, fixed: true },
      { id: 'road-3', type: 'road', position: { row: 2, col: 2 }, fixed: true },
      { id: 'home-1', type: 'home', position: { row: 0, col: 2 }, fixed: true },
      { id: 'park-1', type: 'park' },
    ],
    rules: [{ id: 'park-road', kind: 'notAdjacent', subject: 'park', target: 'road' }],
  },
  {
    id: 3,
    name: { tr: 'Sağlık Köşesi', en: 'Health Corner' },
    intro: {
      tr: 'Eczane, sağlık merkezine yakın olursa herkes rahat eder.',
      en: 'Everyone benefits when the pharmacy is close to the clinic.',
    },
    size: 3,
    items: [
      { id: 'clinic-1', type: 'clinic', position: { row: 1, col: 1 }, fixed: true },
      { id: 'home-1', type: 'home', position: { row: 0, col: 0 }, fixed: true },
      { id: 'home-2', type: 'home', position: { row: 2, col: 2 }, fixed: true },
      { id: 'pharmacy-1', type: 'pharmacy' },
    ],
    rules: [{ id: 'pharmacy-clinic', kind: 'adjacent', subject: 'pharmacy', target: 'clinic' }],
  },
  {
    id: 4,
    name: { tr: 'İlk Durak', en: 'The First Stop' },
    intro: {
      tr: 'Durağı en az iki evin kolayca ulaşabileceği yere koyalım.',
      en: 'Place the stop where at least two homes can easily reach it.',
    },
    size: 3,
    items: [
      { id: 'home-1', type: 'home', position: { row: 0, col: 1 }, fixed: true },
      { id: 'home-2', type: 'home', position: { row: 1, col: 0 }, fixed: true },
      { id: 'home-3', type: 'home', position: { row: 2, col: 2 }, fixed: true },
      { id: 'bus-stop-1', type: 'busStop' },
    ],
    rules: [
      { id: 'stop-homes', kind: 'coverage', subject: 'busStop', target: 'home', count: 2 },
    ],
  },
  {
    id: 5,
    name: { tr: 'Küçük Mahalle', en: 'Little Neighbourhood' },
    intro: {
      tr: 'İki ihtiyacı birlikte düşünelim: sıcak ekmek ve sakin bir park.',
      en: 'Balance two needs: fresh bread and a peaceful park.',
    },
    size: 4,
    items: [
      { id: 'road-1', type: 'road', position: { row: 3, col: 0 }, fixed: true },
      { id: 'road-2', type: 'road', position: { row: 3, col: 1 }, fixed: true },
      { id: 'road-3', type: 'road', position: { row: 3, col: 2 }, fixed: true },
      { id: 'road-4', type: 'road', position: { row: 3, col: 3 }, fixed: true },
      { id: 'home-1', type: 'home', position: { row: 0, col: 1 }, fixed: true },
      { id: 'home-2', type: 'home', position: { row: 1, col: 2 }, fixed: true },
      { id: 'bakery-1', type: 'bakery' },
      { id: 'park-1', type: 'park' },
    ],
    rules: [
      { id: 'bakery-home', kind: 'adjacent', subject: 'bakery', target: 'home' },
      { id: 'park-road', kind: 'notAdjacent', subject: 'park', target: 'road' },
    ],
  },
]
