import type { RoadLevel } from './types'

export const levels: RoadLevel[] = [
  {
    id: 1,
    name: { tr: 'Sıcak Ekmek Yolu', en: 'The Fresh Bread Road' },
    intro: {
      tr: 'Fırından eve uzanan ilk sokağı parmağınla çiz. Kusursuz çizmen gerekmiyor; yolu biz yumuşatırız.',
      en: 'Draw the first street from the bakery to the home. It need not be perfect; we will smooth it for you.',
    },
    objective: { tr: 'Fırını eve bağla', en: 'Connect the bakery to the home' },
    landmarks: [
      { id: 'bakery', type: 'bakery', position: { x: 24, y: 28 }, label: { tr: 'Fırın', en: 'Bakery' } },
      { id: 'home', type: 'home', position: { x: 76, y: 88 }, label: { tr: 'Nermin Hanımın evi', en: "Nermin's home" } },
    ],
    obstacles: [
      { id: 'tree', type: 'tree', position: { x: 73, y: 31 }, radius: 8, label: { tr: 'Ihlamur ağacı', en: 'Linden tree' } },
    ],
    goal: { kind: 'connectAll', landmarkIds: ['bakery', 'home'] },
    efficientLength: 88,
    tutorialPath: [{ x: 24, y: 28 }, { x: 32, y: 44 }, { x: 49, y: 57 }, { x: 64, y: 72 }, { x: 76, y: 88 }],
  },
  {
    id: 2,
    name: { tr: 'İki Kapı, Bir Sokak', en: 'Two Doors, One Street' },
    intro: {
      tr: 'Mahalle girişinden iki eve ulaş. İstersen önce ortak bir sokak çizip sonra yolu dallandır.',
      en: 'Reach two homes from the neighbourhood entrance. Try a shared street, then branch it.',
    },
    objective: { tr: 'Girişi iki eve bağla', en: 'Connect the entrance to both homes' },
    landmarks: [
      { id: 'entrance', type: 'entrance', position: { x: 12, y: 106 }, label: { tr: 'Mahalle girişi', en: 'Neighbourhood entrance' } },
      { id: 'home-a', type: 'home', position: { x: 37, y: 26 }, label: { tr: 'Mor kapılı ev', en: 'Purple-door home' } },
      { id: 'home-b', type: 'home', position: { x: 83, y: 52 }, label: { tr: 'Sarı ev', en: 'Yellow home' } },
    ],
    obstacles: [
      { id: 'garden', type: 'garden', position: { x: 38, y: 68 }, radius: 10, label: { tr: 'Çiçek bahçesi', en: 'Flower garden' } },
    ],
    goal: { kind: 'connectAll', landmarkIds: ['entrance', 'home-a', 'home-b'] },
    roadBudget: 165,
    efficientLength: 145,
  },
  {
    id: 3,
    name: { tr: 'Sağlık Yolu', en: 'The Health Route' },
    intro: {
      tr: 'İki evi sağlık merkezine bağla. Yaşlı çınarı ve göleti koruyacak bir yol ağı kur.',
      en: 'Connect both homes to the clinic while protecting the old plane tree and pond.',
    },
    objective: { tr: 'İki evden sağlık merkezine ulaş', en: 'Reach the clinic from both homes' },
    landmarks: [
      { id: 'clinic', type: 'clinic', position: { x: 79, y: 22 }, label: { tr: 'Sağlık merkezi', en: 'Clinic' } },
      { id: 'home-a', type: 'home', position: { x: 17, y: 29 }, label: { tr: 'Kuzey evi', en: 'North home' } },
      { id: 'home-b', type: 'home', position: { x: 25, y: 103 }, label: { tr: 'Bahçeli ev', en: 'Garden home' } },
    ],
    obstacles: [
      { id: 'tree', type: 'tree', position: { x: 49, y: 47 }, radius: 9, label: { tr: 'Yaşlı çınar', en: 'Old plane tree' } },
      { id: 'pond', type: 'pond', position: { x: 69, y: 78 }, radius: 11, label: { tr: 'Ördekli gölet', en: 'Duck pond' } },
    ],
    goal: { kind: 'connectAll', landmarkIds: ['clinic', 'home-a', 'home-b'] },
    roadBudget: 155,
    efficientLength: 140,
  },
  {
    id: 4,
    name: { tr: 'Durağa Giden Yollar', en: 'Roads to the Bus Stop' },
    intro: {
      tr: 'Üç evi durağa bağla. Ayrı ayrı uzun yollar yerine buluşan sokaklar tasarlayabilirsin.',
      en: 'Connect three homes to the bus stop. Streets that meet may be better than three long roads.',
    },
    objective: { tr: 'Durağı üç eve ulaştır', en: 'Connect the bus stop to three homes' },
    landmarks: [
      { id: 'stop', type: 'busStop', position: { x: 51, y: 107 }, label: { tr: 'Otobüs durağı', en: 'Bus stop' } },
      { id: 'home-a', type: 'home', position: { x: 15, y: 22 }, label: { tr: 'Mavi ev', en: 'Blue home' } },
      { id: 'home-b', type: 'home', position: { x: 51, y: 18 }, label: { tr: 'Kiremit ev', en: 'Terracotta home' } },
      { id: 'home-c', type: 'home', position: { x: 85, y: 42 }, label: { tr: 'Yeşil ev', en: 'Green home' } },
    ],
    obstacles: [
      { id: 'pond', type: 'pond', position: { x: 25, y: 67 }, radius: 10, label: { tr: 'Süs havuzu', en: 'Ornamental pond' } },
      { id: 'tree', type: 'tree', position: { x: 68, y: 69 }, radius: 8, label: { tr: 'Ceviz ağacı', en: 'Walnut tree' } },
    ],
    goal: { kind: 'coverage', sourceId: 'stop', targetIds: ['home-a', 'home-b', 'home-c'], count: 3 },
    roadBudget: 205,
    efficientLength: 178,
  },
  {
    id: 5,
    name: { tr: 'Mahallenin Kalbi', en: 'Heart of the Neighbourhood' },
    intro: {
      tr: 'Evleri, fırını ve sağlık merkezini girişe bağla. Merkezi parkla yağmur bahçesi yerinde kalmalı.',
      en: 'Connect the homes, bakery and clinic to the entrance while preserving the central park and rain garden.',
    },
    objective: { tr: 'Beş noktayı tek yol ağında buluştur', en: 'Bring five places into one road network' },
    landmarks: [
      { id: 'entrance', type: 'entrance', position: { x: 9, y: 108 }, label: { tr: 'Mahalle girişi', en: 'Neighbourhood entrance' } },
      { id: 'home-a', type: 'home', position: { x: 25, y: 74 }, label: { tr: 'Alt sokak evi', en: 'Lower-street home' } },
      { id: 'bakery', type: 'bakery', position: { x: 21, y: 24 }, label: { tr: 'Taş fırın', en: 'Stone bakery' } },
      { id: 'clinic', type: 'clinic', position: { x: 80, y: 22 }, label: { tr: 'Sağlık merkezi', en: 'Clinic' } },
      { id: 'home-b', type: 'home', position: { x: 81, y: 93 }, label: { tr: 'Park yanı evi', en: 'Parkside home' } },
    ],
    obstacles: [
      { id: 'park', type: 'garden', position: { x: 51, y: 51 }, radius: 12, label: { tr: 'Merkez parkı', en: 'Central park' } },
      { id: 'rain-garden', type: 'pond', position: { x: 51, y: 91 }, radius: 8, label: { tr: 'Yağmur bahçesi', en: 'Rain garden' } },
    ],
    goal: { kind: 'connectAll', landmarkIds: ['entrance', 'home-a', 'bakery', 'clinic', 'home-b'] },
    roadBudget: 255,
    efficientLength: 228,
  },
]
