import type { MissionLevel } from './types'

export const levels: MissionLevel[] = [
  {
    id: 1,
    name: { tr: 'Sıcak Ekmek Sokağı', en: 'Fresh Bread Street' },
    intro: {
      tr: 'Fırından eve bir sokak çiz. Yaklaşınca yolun kapıya nasıl çekildiğini hissedeceksin.',
      en: 'Draw a street from the bakery to the home. As you approach, feel the road pull itself to the door.',
    },
    objective: { tr: 'Fırını eve bağla', en: 'Connect the bakery to the home' },
    tools: ['road'],
    landmarks: [
      { id: 'bakery', type: 'bakery', position: { x: 23, y: 27 }, label: { tr: 'Taş fırın', en: 'Stone bakery' } },
      { id: 'home', type: 'home', position: { x: 77, y: 91 }, label: { tr: 'Nermin Hanımın evi', en: "Nermin's home" } },
    ],
    placeables: [],
    obstacles: [{ id: 'tree', type: 'tree', position: { x: 74, y: 30 }, radius: 8, label: { tr: 'Ihlamur', en: 'Linden tree' } }],
    requirements: [{ id: 'connect', kind: 'connect', anchorIds: ['bakery', 'home'], text: { tr: 'Fırınla evi aynı sokakta buluştur', en: 'Bring the bakery and home onto the same street' } }],
    efficientLength: 92,
    tutorialPath: [{ x: 23, y: 27 }, { x: 35, y: 45 }, { x: 51, y: 59 }, { x: 66, y: 75 }, { x: 77, y: 91 }],
  },
  {
    id: 2,
    name: { tr: 'Durak Nerede Olsun?', en: 'Where Should the Stop Go?' },
    intro: {
      tr: 'Bu kez yol çizmiyoruz. Durağı tutup üç evin de yürüyebileceği, göletten uzak bir yere taşı.',
      en: 'No road drawing this time. Move the stop where all three homes can reach it, away from the pond.',
    },
    objective: { tr: 'En uygun durak yerini bul', en: 'Find the best place for the stop' },
    tools: ['move'],
    landmarks: [
      { id: 'home-a', type: 'home', position: { x: 18, y: 24 }, label: { tr: 'Leylak ev', en: 'Lilac home' } },
      { id: 'home-b', type: 'home', position: { x: 54, y: 18 }, label: { tr: 'Kiremit ev', en: 'Terracotta home' } },
      { id: 'home-c', type: 'home', position: { x: 84, y: 49 }, label: { tr: 'Yeşil ev', en: 'Green home' } },
    ],
    placeables: [{
      id: 'stop', type: 'busStop', position: { x: 50, y: 106 }, label: { tr: 'Otobüs durağı', en: 'Bus stop' },
      guide: {
        position: { x: 50, y: 35 }, radius: 12,
        reason: { tr: 'Üç eve yakın, göletten uzak', en: 'Near all three homes, away from the pond' },
      },
    }],
    obstacles: [{ id: 'pond', type: 'pond', position: { x: 49, y: 67 }, radius: 11, label: { tr: 'Mahalle göleti', en: 'Neighbourhood pond' } }],
    requirements: [
      { id: 'move-stop', kind: 'moved', itemIds: ['stop'], text: { tr: 'Durağı yeni yerine taşı', en: 'Move the stop to its new location' } },
      { id: 'cover-homes', kind: 'coverage', itemId: 'stop', targetIds: ['home-a', 'home-b', 'home-c'], radius: 43, count: 3, text: { tr: 'Üç ev de durağa yürüyebilsin', en: 'All three homes can walk to the stop' } },
      { id: 'protect-pond', kind: 'nearObstacle', itemId: 'stop', obstacleId: 'pond', min: 24, text: { tr: 'Durağı gölet kıyısından uzak tut', en: 'Keep the stop away from the pond edge' } },
    ],
    serviceRadius: { itemId: 'stop', radius: 43 },
  },
  {
    id: 3,
    name: { tr: 'Parkta Bir Mola', en: 'A Pause in the Park' },
    intro: {
      tr: 'Bankı, lambayı ve çiçekliği sürükleyerek huzurlu bir dinlenme köşesi tasarla. Her parçanın komşusuna ihtiyacı var.',
      en: 'Drag the bench, lamp and flower bed to create a peaceful corner. Each piece needs the right neighbour.',
    },
    objective: { tr: 'Dinlenme köşesini düzenle', en: 'Arrange the rest corner' },
    tools: ['move'],
    landmarks: [{ id: 'gate', type: 'entrance', position: { x: 51, y: 108 }, label: { tr: 'Park girişi', en: 'Park entrance' } }],
    placeables: [
      {
        id: 'bench', type: 'bench', position: { x: 16, y: 104 }, label: { tr: 'Bank', en: 'Bench' },
        guide: {
          position: { x: 52, y: 75 }, radius: 10,
          reason: { tr: 'Göleti gören güvenli mesafe', en: 'A safe spot with a pond view' },
        },
      },
      {
        id: 'lamp', type: 'lamp', position: { x: 33, y: 108 }, label: { tr: 'Park lambası', en: 'Park lamp' },
        guide: {
          position: { x: 35, y: 82 }, radius: 9,
          reason: { tr: 'Bankı aydınlatacak kadar yakın', en: 'Close enough to light the bench' },
        },
      },
      {
        id: 'flowers', type: 'flowerBed', position: { x: 83, y: 105 }, label: { tr: 'Çiçeklik', en: 'Flower bed' },
        guide: {
          position: { x: 70, y: 83 }, radius: 9,
          reason: { tr: 'Dinlenme köşesini tamamlar', en: 'Completes the rest corner' },
        },
      },
    ],
    obstacles: [
      { id: 'pond', type: 'pond', position: { x: 51, y: 48 }, radius: 12, label: { tr: 'Ördekli gölet', en: 'Duck pond' } },
      { id: 'tree', type: 'tree', position: { x: 18, y: 30 }, radius: 8, label: { tr: 'Yaşlı çınar', en: 'Old plane tree' } },
    ],
    requirements: [
      { id: 'move-furniture', kind: 'moved', itemIds: ['bench', 'lamp', 'flowers'], text: { tr: 'Üç parçayı da yerine taşı', en: 'Move all three pieces into place' } },
      { id: 'bench-view', kind: 'nearObstacle', itemId: 'bench', obstacleId: 'pond', min: 16, max: 30, text: { tr: 'Bank göleti görsün ama kıyıya dayanmasın', en: 'Give the bench a pond view without crowding the shore' } },
      { id: 'lamp-bench', kind: 'nearItem', itemId: 'lamp', targetItemId: 'bench', max: 22, text: { tr: 'Lamba bankı aydınlatsın', en: 'Let the lamp light the bench' } },
      { id: 'flowers-bench', kind: 'nearItem', itemId: 'flowers', targetItemId: 'bench', max: 31, text: { tr: 'Çiçeklik dinlenme köşesini tamamlasın', en: 'Let the flowers complete the rest corner' } },
    ],
  },
  {
    id: 4,
    name: { tr: 'Pazar Sabahı', en: 'Market Morning' },
    intro: {
      tr: 'Üç tezgâhı ana sokağa yerleştir. Aralarında dolaşma payı bırak ve sağlık merkezinin önünü açık tut.',
      en: 'Place three stalls along the main street. Leave room to walk and keep the clinic entrance clear.',
    },
    objective: { tr: 'Mahalle pazarını kur', en: 'Set up the neighbourhood market' },
    tools: ['move'],
    landmarks: [
      { id: 'clinic', type: 'clinic', position: { x: 86, y: 28 }, label: { tr: 'Sağlık merkezi', en: 'Clinic' } },
      { id: 'entrance', type: 'entrance', position: { x: 10, y: 102 }, label: { tr: 'Pazar girişi', en: 'Market entrance' } },
    ],
    placeables: [
      {
        id: 'stall-a', type: 'marketStall', position: { x: 27, y: 107 }, label: { tr: 'Meyve tezgâhı', en: 'Fruit stall' },
        guide: {
          position: { x: 20, y: 72 }, radius: 9,
          reason: { tr: 'Sokağa yakın, geçişe engel değil', en: 'Near the street without blocking passage' },
        },
      },
      {
        id: 'stall-b', type: 'marketStall', position: { x: 50, y: 107 }, label: { tr: 'Ekmek tezgâhı', en: 'Bread stall' },
        guide: {
          position: { x: 49, y: 75 }, radius: 9,
          reason: { tr: 'Diğer tezgâhtan güvenli aralıkta', en: 'A comfortable distance from the other stall' },
        },
      },
      {
        id: 'stall-c', type: 'marketStall', position: { x: 73, y: 107 }, label: { tr: 'Çiçek tezgâhı', en: 'Flower stall' },
        guide: {
          position: { x: 77, y: 70 }, radius: 9,
          reason: { tr: 'Sağlık merkezinin önü açık kalır', en: 'Keeps the clinic entrance clear' },
        },
      },
    ],
    obstacles: [{ id: 'garden', type: 'garden', position: { x: 18, y: 34 }, radius: 9, label: { tr: 'Topluluk bahçesi', en: 'Community garden' } }],
    baseRoads: [{ id: 'main-street', points: [{ x: 8, y: 68 }, { x: 30, y: 62 }, { x: 56, y: 66 }, { x: 92, y: 58 }] }],
    requirements: [
      { id: 'move-stalls', kind: 'moved', itemIds: ['stall-a', 'stall-b', 'stall-c'], text: { tr: 'Üç tezgâhı da sokağa taşı', en: 'Move all three stalls to the street' } },
      { id: 'street-side', kind: 'nearRoad', itemIds: ['stall-a', 'stall-b', 'stall-c'], max: 13, text: { tr: 'Tezgâhlar ana sokağın kenarında olsun', en: 'Keep the stalls beside the main street' } },
      { id: 'walking-room', kind: 'separated', itemIds: ['stall-a', 'stall-b', 'stall-c'], min: 19, text: { tr: 'Tezgâhlar arasında geçiş payı bırak', en: 'Leave walking room between stalls' } },
      { id: 'clinic-clear', kind: 'awayFromLandmark', itemIds: ['stall-a', 'stall-b', 'stall-c'], landmarkId: 'clinic', min: 28, text: { tr: 'Sağlık merkezinin önünü açık tut', en: 'Keep the clinic entrance clear' } },
    ],
  },
  {
    id: 5,
    name: { tr: 'Mahallenin Yeni Kalbi', en: 'A New Heart for the Neighbourhood' },
    intro: {
      tr: 'Önce sağlık merkezine iki evi de göreceği bir yer bul. Sonra giriş, fırın ve sağlık merkezini kısa bir yol ağıyla birleştir.',
      en: 'First place the clinic where it serves both homes. Then connect the entrance, bakery and clinic with a short road network.',
    },
    objective: { tr: 'Yerleştir ve yollarla canlandır', en: 'Place, connect and bring it to life' },
    tools: ['move', 'road'],
    landmarks: [
      { id: 'entrance', type: 'entrance', position: { x: 10, y: 108 }, label: { tr: 'Mahalle girişi', en: 'Neighbourhood entrance' } },
      { id: 'home-a', type: 'home', position: { x: 16, y: 23 }, label: { tr: 'Batı evi', en: 'West home' } },
      { id: 'home-b', type: 'home', position: { x: 84, y: 23 }, label: { tr: 'Doğu evi', en: 'East home' } },
      { id: 'bakery', type: 'bakery', position: { x: 83, y: 96 }, label: { tr: 'Mahalle fırını', en: 'Neighbourhood bakery' } },
    ],
    placeables: [{
      id: 'clinic', type: 'clinic', position: { x: 49, y: 108 }, label: { tr: 'Yeni sağlık merkezi', en: 'New clinic' },
      guide: {
        position: { x: 50, y: 38 }, radius: 11,
        reason: { tr: 'İki eve yakın, parkı koruyor', en: 'Near both homes while protecting the park' },
      },
    }],
    obstacles: [{ id: 'park', type: 'garden', position: { x: 50, y: 65 }, radius: 12, label: { tr: 'Merkez parkı', en: 'Central park' } }],
    requirements: [
      { id: 'move-clinic', kind: 'moved', itemIds: ['clinic'], text: { tr: 'Sağlık merkezine yeni yer bul', en: 'Find a new place for the clinic' } },
      { id: 'serve-homes', kind: 'coverage', itemId: 'clinic', targetIds: ['home-a', 'home-b'], radius: 45, count: 2, text: { tr: 'İki ev de sağlık merkezine ulaşabilsin', en: 'Let both homes reach the clinic' } },
      { id: 'protect-park', kind: 'nearObstacle', itemId: 'clinic', obstacleId: 'park', min: 25, text: { tr: 'Merkez parkını koru', en: 'Protect the central park' } },
      { id: 'connect-centre', kind: 'connect', anchorIds: ['entrance', 'bakery', 'clinic'], text: { tr: 'Giriş, fırın ve sağlık merkezini bağla', en: 'Connect the entrance, bakery and clinic' } },
    ],
    roadBudget: 178,
    efficientLength: 155,
    serviceRadius: { itemId: 'clinic', radius: 45 },
  },
]
