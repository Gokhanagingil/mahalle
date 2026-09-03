import type { Chapter, MissionLevel } from './types'

export const chapters: Chapter[] = [
  { id: 1, startLevel: 1, endLevel: 5, name: { tr: 'İlk Sokak', en: 'First Street' } },
  { id: 2, startLevel: 6, endLevel: 10, name: { tr: 'Meydan Çevresi', en: 'Around the Square' } },
  { id: 3, startLevel: 11, endLevel: 15, name: { tr: 'Yeşil Mahalle', en: 'Green Neighbourhood' } },
  { id: 4, startLevel: 16, endLevel: 20, name: { tr: 'Birlikte Yaşam', en: 'Living Together' } },
]

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
  {
    id: 6,
    name: { tr: 'Meydanda Oturalım', en: 'A Seat by the Square' },
    intro: {
      tr: 'İki bankı meydanın çevresine yerleştir. İnsanların rahatça geçebilmesi için aralarında boşluk bırak.',
      en: 'Place two benches around the square. Leave enough room between them for people to pass.',
    },
    objective: { tr: 'Meydanın dinlenme yerlerini kur', en: 'Create resting spots by the square' },
    tools: ['move'],
    landmarks: [
      { id: 'square', type: 'square', position: { x: 50, y: 45 }, label: { tr: 'Mahalle meydanı', en: 'Neighbourhood square' } },
      { id: 'entrance', type: 'entrance', position: { x: 50, y: 108 }, label: { tr: 'Meydan girişi', en: 'Square entrance' } },
    ],
    placeables: [
      {
        id: 'bench-a', type: 'bench', position: { x: 18, y: 106 }, label: { tr: 'Sol bank', en: 'Left bench' },
        guide: { position: { x: 31, y: 69 }, radius: 10, reason: { tr: 'Meydana yakın, geçişten uzak', en: 'Near the square, clear of the entrance' } },
      },
      {
        id: 'bench-b', type: 'bench', position: { x: 82, y: 106 }, label: { tr: 'Sağ bank', en: 'Right bench' },
        guide: { position: { x: 69, y: 69 }, radius: 10, reason: { tr: 'Diğer bankla rahat aralıklı', en: 'Comfortably spaced from the other bench' } },
      },
    ],
    obstacles: [{ id: 'tree', type: 'tree', position: { x: 50, y: 88 }, radius: 7, label: { tr: 'Meydan ağacı', en: 'Square tree' } }],
    requirements: [
      { id: 'move-benches', kind: 'moved', itemIds: ['bench-a', 'bench-b'], text: { tr: 'İki bankı da meydana taşı', en: 'Move both benches to the square' } },
      { id: 'face-square', kind: 'nearLandmark', itemIds: ['bench-a', 'bench-b'], landmarkId: 'square', max: 32, text: { tr: 'Banklar meydana yakın olsun', en: 'Keep the benches near the square' } },
      { id: 'bench-gap', kind: 'separated', itemIds: ['bench-a', 'bench-b'], min: 25, text: { tr: 'Bankların arasında geçiş bırak', en: 'Leave a passage between the benches' } },
    ],
  },
  {
    id: 7,
    name: { tr: 'Mahallenin Eczanesi', en: 'The Neighbourhood Pharmacy' },
    intro: {
      tr: 'Eczaneyi üç evin de ulaşabileceği bir yere taşı. Topluluk bahçesinin çevresini açık bırak.',
      en: 'Move the pharmacy where all three homes can reach it. Keep the community garden clear.',
    },
    objective: { tr: 'Eczaneye uygun yeri bul', en: 'Find the right place for the pharmacy' },
    tools: ['move'],
    landmarks: [
      { id: 'home-a', type: 'home', position: { x: 18, y: 24 }, label: { tr: 'Batı evi', en: 'West home' } },
      { id: 'home-b', type: 'home', position: { x: 82, y: 24 }, label: { tr: 'Doğu evi', en: 'East home' } },
      { id: 'home-c', type: 'home', position: { x: 50, y: 91 }, label: { tr: 'Güney evi', en: 'South home' } },
    ],
    placeables: [{
      id: 'pharmacy', type: 'pharmacy', position: { x: 50, y: 108 }, label: { tr: 'Yeni eczane', en: 'New pharmacy' },
      guide: { position: { x: 50, y: 38 }, radius: 11, reason: { tr: 'Üç eve yakın, bahçeden uzak', en: 'Near all three homes, away from the garden' } },
    }],
    obstacles: [{ id: 'garden', type: 'garden', position: { x: 50, y: 65 }, radius: 10, label: { tr: 'Topluluk bahçesi', en: 'Community garden' } }],
    requirements: [
      { id: 'move-pharmacy', kind: 'moved', itemIds: ['pharmacy'], text: { tr: 'Eczaneyi yeni yerine taşı', en: 'Move the pharmacy to its new place' } },
      { id: 'serve-homes', kind: 'coverage', itemId: 'pharmacy', targetIds: ['home-a', 'home-b', 'home-c'], radius: 54, count: 3, text: { tr: 'Üç ev de eczaneye ulaşabilsin', en: 'Let all three homes reach the pharmacy' } },
      { id: 'protect-garden', kind: 'nearObstacle', itemId: 'pharmacy', obstacleId: 'garden', min: 22, text: { tr: 'Topluluk bahçesini koru', en: 'Protect the community garden' } },
    ],
    serviceRadius: { itemId: 'pharmacy', radius: 54 },
  },
  {
    id: 8,
    name: { tr: 'Akşam Işıkları', en: 'Evening Lights' },
    intro: {
      tr: 'Üç lambayı sokağın farklı bölümlerine koy. Yol aydınlansın, lambalar birbirine yığılmasın.',
      en: 'Place three lamps along different parts of the street. Light the road without crowding the lamps.',
    },
    objective: { tr: 'Sokağı baştan sona aydınlat', en: 'Light the street from end to end' },
    tools: ['move'],
    landmarks: [],
    placeables: [
      { id: 'lamp-a', type: 'lamp', position: { x: 18, y: 108 }, label: { tr: 'Sol lamba', en: 'Left lamp' }, guide: { position: { x: 20, y: 66 }, radius: 9, reason: { tr: 'Sokağın solunu aydınlatır', en: 'Lights the left side of the street' } } },
      { id: 'lamp-b', type: 'lamp', position: { x: 50, y: 108 }, label: { tr: 'Orta lamba', en: 'Middle lamp' }, guide: { position: { x: 50, y: 67 }, radius: 9, reason: { tr: 'Sokağın ortasını aydınlatır', en: 'Lights the middle of the street' } } },
      { id: 'lamp-c', type: 'lamp', position: { x: 82, y: 108 }, label: { tr: 'Sağ lamba', en: 'Right lamp' }, guide: { position: { x: 80, y: 62 }, radius: 9, reason: { tr: 'Sokağın sağını aydınlatır', en: 'Lights the right side of the street' } } },
    ],
    obstacles: [{ id: 'pond', type: 'pond', position: { x: 50, y: 96 }, radius: 9, label: { tr: 'Küçük gölet', en: 'Small pond' } }],
    baseRoads: [{ id: 'evening-street', points: [{ x: 8, y: 57 }, { x: 35, y: 53 }, { x: 62, y: 58 }, { x: 92, y: 51 }] }],
    requirements: [
      { id: 'move-lamps', kind: 'moved', itemIds: ['lamp-a', 'lamp-b', 'lamp-c'], text: { tr: 'Üç lambayı da sokağa taşı', en: 'Move all three lamps to the street' } },
      { id: 'light-road', kind: 'nearRoad', itemIds: ['lamp-a', 'lamp-b', 'lamp-c'], max: 14, text: { tr: 'Lambaları yol kenarına yerleştir', en: 'Place the lamps beside the road' } },
      { id: 'spread-light', kind: 'separated', itemIds: ['lamp-a', 'lamp-b', 'lamp-c'], min: 24, text: { tr: 'Işığı sokağa eşit yay', en: 'Spread the light along the street' } },
    ],
  },
  {
    id: 9,
    name: { tr: 'Çiçekli Meydan', en: 'A Square in Bloom' },
    intro: {
      tr: 'İki çiçekliği meydanın çevresine yerleştir. Sağlık merkezinin girişi ve meydan ağacı açık kalsın.',
      en: 'Place two flower beds around the square. Keep the clinic entrance and square tree clear.',
    },
    objective: { tr: 'Meydanı çiçeklerle canlandır', en: 'Bring the square to life with flowers' },
    tools: ['move'],
    landmarks: [
      { id: 'square', type: 'square', position: { x: 50, y: 45 }, label: { tr: 'Mahalle meydanı', en: 'Neighbourhood square' } },
      { id: 'clinic', type: 'clinic', position: { x: 87, y: 23 }, label: { tr: 'Sağlık merkezi', en: 'Clinic' } },
    ],
    placeables: [
      { id: 'flowers-a', type: 'flowerBed', position: { x: 23, y: 108 }, label: { tr: 'Papatyalar', en: 'Daisies' }, guide: { position: { x: 26, y: 65 }, radius: 9, reason: { tr: 'Meydanın solunu canlandırır', en: 'Brightens the left side of the square' } } },
      { id: 'flowers-b', type: 'flowerBed', position: { x: 75, y: 108 }, label: { tr: 'Menekşeler', en: 'Violets' }, guide: { position: { x: 69, y: 70 }, radius: 9, reason: { tr: 'Girişi kapatmadan meydana yakın', en: 'Near the square without blocking the entrance' } } },
    ],
    obstacles: [{ id: 'tree', type: 'tree', position: { x: 50, y: 91 }, radius: 7, label: { tr: 'Meydan ağacı', en: 'Square tree' } }],
    requirements: [
      { id: 'move-flowers', kind: 'moved', itemIds: ['flowers-a', 'flowers-b'], text: { tr: 'İki çiçekliği meydana taşı', en: 'Move both flower beds to the square' } },
      { id: 'decorate-square', kind: 'nearLandmark', itemIds: ['flowers-a', 'flowers-b'], landmarkId: 'square', max: 33, text: { tr: 'Çiçeklikler meydanın çevresinde olsun', en: 'Keep the flower beds around the square' } },
      { id: 'flower-gap', kind: 'separated', itemIds: ['flowers-a', 'flowers-b'], min: 25, text: { tr: 'Aralarında yürüyüş alanı bırak', en: 'Leave walking room between them' } },
      { id: 'clinic-clear', kind: 'awayFromLandmark', itemIds: ['flowers-a', 'flowers-b'], landmarkId: 'clinic', min: 30, text: { tr: 'Sağlık merkezinin önünü açık tut', en: 'Keep the clinic entrance clear' } },
    ],
  },
  {
    id: 10,
    name: { tr: 'Meydanın Halkası', en: 'The Square Loop' },
    intro: {
      tr: 'Giriş, fırın, eczane ve meydanı kısa bir yol ağıyla birbirine bağla. Göletin çevresinden geç.',
      en: 'Connect the entrance, bakery, pharmacy and square with a short road network. Go around the pond.',
    },
    objective: { tr: 'Meydan çevresindeki ağı tamamla', en: 'Complete the network around the square' },
    tools: ['road'],
    landmarks: [
      { id: 'entrance', type: 'entrance', position: { x: 10, y: 106 }, label: { tr: 'Mahalle girişi', en: 'Neighbourhood entrance' } },
      { id: 'bakery', type: 'bakery', position: { x: 19, y: 23 }, label: { tr: 'Taş fırın', en: 'Stone bakery' } },
      { id: 'pharmacy', type: 'pharmacy', position: { x: 81, y: 23 }, label: { tr: 'Mahalle eczanesi', en: 'Neighbourhood pharmacy' } },
      { id: 'square', type: 'square', position: { x: 50, y: 76 }, label: { tr: 'Mahalle meydanı', en: 'Neighbourhood square' } },
    ],
    placeables: [],
    obstacles: [{ id: 'pond', type: 'pond', position: { x: 50, y: 47 }, radius: 10, label: { tr: 'Meydan göleti', en: 'Square pond' } }],
    requirements: [{ id: 'connect-square', kind: 'connect', anchorIds: ['entrance', 'bakery', 'pharmacy', 'square'], text: { tr: 'Dört yeri aynı yol ağında buluştur', en: 'Bring all four places onto one road network' } }],
    roadBudget: 235,
    efficientLength: 205,
  },
  {
    id: 11,
    name: { tr: 'İki Durak', en: 'Two Stops' },
    intro: {
      tr: 'İki durağı evlerin arasına paylaştır. Her durak iki eve yakın olsun ve duraklar aynı yerde toplanmasın.',
      en: 'Share two stops between the homes. Keep each stop near two homes without clustering them together.',
    },
    objective: { tr: 'Evleri iki durağa paylaştır', en: 'Share the homes between two stops' },
    tools: ['move'],
    landmarks: [
      { id: 'home-a', type: 'home', position: { x: 16, y: 22 }, label: { tr: 'Birinci ev', en: 'First home' } },
      { id: 'home-b', type: 'home', position: { x: 40, y: 30 }, label: { tr: 'İkinci ev', en: 'Second home' } },
      { id: 'home-c', type: 'home', position: { x: 62, y: 30 }, label: { tr: 'Üçüncü ev', en: 'Third home' } },
      { id: 'home-d', type: 'home', position: { x: 86, y: 22 }, label: { tr: 'Dördüncü ev', en: 'Fourth home' } },
    ],
    placeables: [
      { id: 'stop-a', type: 'busStop', position: { x: 27, y: 108 }, label: { tr: 'Batı durağı', en: 'West stop' }, guide: { position: { x: 27, y: 53 }, radius: 10, reason: { tr: 'Batıdaki iki eve yakın', en: 'Near the two western homes' } } },
      { id: 'stop-b', type: 'busStop', position: { x: 73, y: 108 }, label: { tr: 'Doğu durağı', en: 'East stop' }, guide: { position: { x: 73, y: 53 }, radius: 10, reason: { tr: 'Doğudaki iki eve yakın', en: 'Near the two eastern homes' } } },
    ],
    obstacles: [{ id: 'pond', type: 'pond', position: { x: 50, y: 85 }, radius: 9, label: { tr: 'Mahalle göleti', en: 'Neighbourhood pond' } }],
    requirements: [
      { id: 'move-stops', kind: 'moved', itemIds: ['stop-a', 'stop-b'], text: { tr: 'İki durağı da yerleştir', en: 'Place both stops' } },
      { id: 'west-homes', kind: 'coverage', itemId: 'stop-a', targetIds: ['home-a', 'home-b'], radius: 34, count: 2, text: { tr: 'Batı durağı iki eve hizmet etsin', en: 'Let the west stop serve two homes' } },
      { id: 'east-homes', kind: 'coverage', itemId: 'stop-b', targetIds: ['home-c', 'home-d'], radius: 34, count: 2, text: { tr: 'Doğu durağı iki eve hizmet etsin', en: 'Let the east stop serve two homes' } },
      { id: 'stop-gap', kind: 'separated', itemIds: ['stop-a', 'stop-b'], min: 32, text: { tr: 'Durakları mahalleye yay', en: 'Spread the stops across the neighbourhood' } },
      { id: 'pond-clear-a', kind: 'nearObstacle', itemId: 'stop-a', obstacleId: 'pond', min: 27, text: { tr: 'Batı durağını göletten uzak tut', en: 'Keep the west stop away from the pond' } },
      { id: 'pond-clear-b', kind: 'nearObstacle', itemId: 'stop-b', obstacleId: 'pond', min: 27, text: { tr: 'Doğu durağını göletten uzak tut', en: 'Keep the east stop away from the pond' } },
    ],
  },
  {
    id: 12,
    name: { tr: 'Göl Kenarı Yolu', en: 'The Lakeside Road' },
    intro: {
      tr: 'Giriş, ev, sağlık merkezi ve fırını birbirine bağla. Göleti ve yaşlı ağacı koruyarak yolunu kıvır.',
      en: 'Connect the entrance, home, clinic and bakery. Curve the road while protecting the pond and old tree.',
    },
    objective: { tr: 'Doğayı koruyan yolu çiz', en: 'Draw a road that protects nature' },
    tools: ['road'],
    landmarks: [
      { id: 'entrance', type: 'entrance', position: { x: 10, y: 106 }, label: { tr: 'Mahalle girişi', en: 'Neighbourhood entrance' } },
      { id: 'home', type: 'home', position: { x: 18, y: 22 }, label: { tr: 'Göl evi', en: 'Lake house' } },
      { id: 'clinic', type: 'clinic', position: { x: 84, y: 23 }, label: { tr: 'Sağlık merkezi', en: 'Clinic' } },
      { id: 'bakery', type: 'bakery', position: { x: 84, y: 99 }, label: { tr: 'Mahalle fırını', en: 'Neighbourhood bakery' } },
    ],
    placeables: [],
    obstacles: [
      { id: 'pond', type: 'pond', position: { x: 50, y: 62 }, radius: 12, label: { tr: 'Büyük gölet', en: 'Large pond' } },
      { id: 'tree', type: 'tree', position: { x: 48, y: 24 }, radius: 7, label: { tr: 'Yaşlı çınar', en: 'Old plane tree' } },
    ],
    requirements: [{ id: 'connect-lake', kind: 'connect', anchorIds: ['entrance', 'home', 'clinic', 'bakery'], text: { tr: 'Dört yeri korunan alanların çevresinden bağla', en: 'Connect all four places around the protected areas' } }],
    roadBudget: 255,
    efficientLength: 225,
  },
  {
    id: 13,
    name: { tr: 'Yeşil Dinlenme Alanı', en: 'A Green Rest Area' },
    intro: {
      tr: 'Bankı parka yakın koy. Lambayı bankın yanına, çiçekliği de dinlenme köşesini tamamlayacak yere taşı.',
      en: 'Place the bench near the park. Put the lamp beside it and move the flowers to complete the rest area.',
    },
    objective: { tr: 'Parkın dinlenme köşesini kur', en: 'Build the park rest area' },
    tools: ['move'],
    landmarks: [
      { id: 'park', type: 'park', position: { x: 50, y: 34 }, label: { tr: 'Yeşil park', en: 'Green park' } },
      { id: 'entrance', type: 'entrance', position: { x: 50, y: 108 }, label: { tr: 'Park girişi', en: 'Park entrance' } },
    ],
    placeables: [
      { id: 'bench', type: 'bench', position: { x: 18, y: 104 }, label: { tr: 'Park bankı', en: 'Park bench' }, guide: { position: { x: 40, y: 61 }, radius: 9, reason: { tr: 'Parka yakın, giriş yolundan uzak', en: 'Near the park, clear of the entrance' } } },
      { id: 'lamp', type: 'lamp', position: { x: 39, y: 108 }, label: { tr: 'Park lambası', en: 'Park lamp' }, guide: { position: { x: 23, y: 70 }, radius: 9, reason: { tr: 'Bankı aydınlatacak kadar yakın', en: 'Close enough to light the bench' } } },
      { id: 'flowers', type: 'flowerBed', position: { x: 81, y: 105 }, label: { tr: 'Çiçeklik', en: 'Flower bed' }, guide: { position: { x: 66, y: 73 }, radius: 9, reason: { tr: 'Dinlenme köşesini tamamlar', en: 'Completes the rest area' } } },
    ],
    obstacles: [{ id: 'tree', type: 'tree', position: { x: 83, y: 48 }, radius: 7, label: { tr: 'Korunan ağaç', en: 'Protected tree' } }],
    requirements: [
      { id: 'move-rest-area', kind: 'moved', itemIds: ['bench', 'lamp', 'flowers'], text: { tr: 'Üç parçayı da parka taşı', en: 'Move all three pieces to the park' } },
      { id: 'bench-near-park', kind: 'nearLandmark', itemIds: ['bench'], landmarkId: 'park', max: 30, text: { tr: 'Bank parka yakın olsun', en: 'Keep the bench near the park' } },
      { id: 'lamp-near-bench', kind: 'nearItem', itemId: 'lamp', targetItemId: 'bench', max: 22, text: { tr: 'Lamba bankı aydınlatsın', en: 'Let the lamp light the bench' } },
      { id: 'flowers-near-bench', kind: 'nearItem', itemId: 'flowers', targetItemId: 'bench', max: 32, text: { tr: 'Çiçeklik bankın çevresinde olsun', en: 'Keep the flowers near the bench' } },
      { id: 'entrance-clear', kind: 'awayFromLandmark', itemIds: ['bench', 'lamp', 'flowers'], landmarkId: 'entrance', min: 30, text: { tr: 'Park girişini açık tut', en: 'Keep the park entrance clear' } },
    ],
  },
  {
    id: 14,
    name: { tr: 'İki Hizmet Noktası', en: 'Two Service Points' },
    intro: {
      tr: 'Eczane ve sağlık merkezini evlere paylaştır. İki yapıyı birbirinden ayır ve bahçeyi koru.',
      en: 'Share the pharmacy and clinic between the homes. Separate the buildings and protect the garden.',
    },
    objective: { tr: 'Sağlık hizmetlerini mahalleye yay', en: 'Spread health services across the neighbourhood' },
    tools: ['move'],
    landmarks: [
      { id: 'home-a', type: 'home', position: { x: 14, y: 20 }, label: { tr: 'Birinci ev', en: 'First home' } },
      { id: 'home-b', type: 'home', position: { x: 38, y: 30 }, label: { tr: 'İkinci ev', en: 'Second home' } },
      { id: 'home-c', type: 'home', position: { x: 62, y: 30 }, label: { tr: 'Üçüncü ev', en: 'Third home' } },
      { id: 'home-d', type: 'home', position: { x: 86, y: 20 }, label: { tr: 'Dördüncü ev', en: 'Fourth home' } },
    ],
    placeables: [
      { id: 'pharmacy', type: 'pharmacy', position: { x: 27, y: 108 }, label: { tr: 'Eczane', en: 'Pharmacy' }, guide: { position: { x: 27, y: 53 }, radius: 10, reason: { tr: 'Batıdaki evlere yakın', en: 'Near the western homes' } } },
      { id: 'clinic', type: 'clinic', position: { x: 73, y: 108 }, label: { tr: 'Sağlık merkezi', en: 'Clinic' }, guide: { position: { x: 73, y: 53 }, radius: 10, reason: { tr: 'Doğudaki evlere yakın', en: 'Near the eastern homes' } } },
    ],
    obstacles: [{ id: 'garden', type: 'garden', position: { x: 50, y: 82 }, radius: 10, label: { tr: 'Şifa bahçesi', en: 'Healing garden' } }],
    requirements: [
      { id: 'move-services', kind: 'moved', itemIds: ['pharmacy', 'clinic'], text: { tr: 'İki hizmet noktasını da yerleştir', en: 'Place both service points' } },
      { id: 'pharmacy-homes', kind: 'coverage', itemId: 'pharmacy', targetIds: ['home-a', 'home-b'], radius: 36, count: 2, text: { tr: 'Eczane batıdaki iki eve ulaşsın', en: 'Let the pharmacy reach the two western homes' } },
      { id: 'clinic-homes', kind: 'coverage', itemId: 'clinic', targetIds: ['home-c', 'home-d'], radius: 36, count: 2, text: { tr: 'Sağlık merkezi doğudaki iki eve ulaşsın', en: 'Let the clinic reach the two eastern homes' } },
      { id: 'service-gap', kind: 'separated', itemIds: ['pharmacy', 'clinic'], min: 36, text: { tr: 'Hizmetleri mahalleye yay', en: 'Spread the services across the neighbourhood' } },
      { id: 'garden-clear-a', kind: 'nearObstacle', itemId: 'pharmacy', obstacleId: 'garden', min: 27, text: { tr: 'Eczaneyi bahçeden uzak tut', en: 'Keep the pharmacy away from the garden' } },
      { id: 'garden-clear-b', kind: 'nearObstacle', itemId: 'clinic', obstacleId: 'garden', min: 27, text: { tr: 'Sağlık merkezini bahçeden uzak tut', en: 'Keep the clinic away from the garden' } },
    ],
  },
  {
    id: 15,
    name: { tr: 'Yeşil Mahalle Ağı', en: 'The Green Neighbourhood Network' },
    intro: {
      tr: 'Önce parkı iki evin arasına, bahçeden uzak bir yere koy. Sonra giriş, fırın ve parkı yollarla bağla.',
      en: 'First place the park between the homes, away from the garden. Then connect the entrance, bakery and park.',
    },
    objective: { tr: 'Parkı yerleştir ve mahalleyi bağla', en: 'Place the park and connect the neighbourhood' },
    tools: ['move', 'road'],
    landmarks: [
      { id: 'entrance', type: 'entrance', position: { x: 10, y: 106 }, label: { tr: 'Mahalle girişi', en: 'Neighbourhood entrance' } },
      { id: 'home-a', type: 'home', position: { x: 16, y: 21 }, label: { tr: 'Batı evi', en: 'West home' } },
      { id: 'home-b', type: 'home', position: { x: 84, y: 21 }, label: { tr: 'Doğu evi', en: 'East home' } },
      { id: 'bakery', type: 'bakery', position: { x: 84, y: 100 }, label: { tr: 'Mahalle fırını', en: 'Neighbourhood bakery' } },
    ],
    placeables: [{
      id: 'park', type: 'park', position: { x: 49, y: 108 }, label: { tr: 'Yeni park', en: 'New park' },
      guide: { position: { x: 50, y: 40 }, radius: 10, reason: { tr: 'İki eve yakın, bahçeden uzak', en: 'Near both homes, away from the garden' } },
    }],
    obstacles: [{ id: 'garden', type: 'garden', position: { x: 50, y: 72 }, radius: 10, label: { tr: 'Topluluk bahçesi', en: 'Community garden' } }],
    requirements: [
      { id: 'move-park', kind: 'moved', itemIds: ['park'], text: { tr: 'Parkı yeni yerine taşı', en: 'Move the park to its new place' } },
      { id: 'park-homes', kind: 'coverage', itemId: 'park', targetIds: ['home-a', 'home-b'], radius: 40, count: 2, text: { tr: 'İki ev de parka yürüyebilsin', en: 'Let both homes walk to the park' } },
      { id: 'protect-garden', kind: 'nearObstacle', itemId: 'park', obstacleId: 'garden', min: 28, text: { tr: 'Topluluk bahçesini koru', en: 'Protect the community garden' } },
      { id: 'connect-green', kind: 'connect', anchorIds: ['entrance', 'bakery', 'park'], text: { tr: 'Giriş, fırın ve parkı aynı yol ağına bağla', en: 'Connect the entrance, bakery and park to one network' } },
    ],
    roadBudget: 190,
    efficientLength: 168,
    serviceRadius: { itemId: 'park', radius: 40 },
  },
  {
    id: 16,
    name: { tr: 'Sessiz Pazar', en: 'The Quiet Market' },
    intro: {
      tr: 'Üç tezgâhı yol kenarına yay. Evlerin ve sağlık merkezinin önünde sessiz, açık bir alan bırak.',
      en: 'Spread three stalls along the road. Leave a quiet, open area in front of the homes and clinic.',
    },
    objective: { tr: 'Geçişi açık bir pazar kur', en: 'Build a market with clear access' },
    tools: ['move'],
    landmarks: [
      { id: 'home', type: 'home', position: { x: 14, y: 24 }, label: { tr: 'Sokak evi', en: 'Street home' } },
      { id: 'clinic', type: 'clinic', position: { x: 86, y: 23 }, label: { tr: 'Sağlık merkezi', en: 'Clinic' } },
    ],
    placeables: [
      { id: 'stall-a', type: 'marketStall', position: { x: 22, y: 108 }, label: { tr: 'Meyve tezgâhı', en: 'Fruit stall' }, guide: { position: { x: 20, y: 70 }, radius: 8, reason: { tr: 'Yola yakın, evden uzak', en: 'Near the road, away from the home' } } },
      { id: 'stall-b', type: 'marketStall', position: { x: 50, y: 108 }, label: { tr: 'Ekmek tezgâhı', en: 'Bread stall' }, guide: { position: { x: 49, y: 72 }, radius: 8, reason: { tr: 'Pazarın ortasında açık geçiş', en: 'An open passage through the market' } } },
      { id: 'stall-c', type: 'marketStall', position: { x: 78, y: 108 }, label: { tr: 'Çiçek tezgâhı', en: 'Flower stall' }, guide: { position: { x: 78, y: 68 }, radius: 8, reason: { tr: 'Yola yakın, sağlık merkezinden uzak', en: 'Near the road, away from the clinic' } } },
    ],
    obstacles: [{ id: 'garden', type: 'garden', position: { x: 50, y: 99 }, radius: 8, label: { tr: 'Pazar bahçesi', en: 'Market garden' } }],
    baseRoads: [{ id: 'market-street', points: [{ x: 8, y: 59 }, { x: 34, y: 57 }, { x: 62, y: 61 }, { x: 92, y: 55 }] }],
    requirements: [
      { id: 'move-stalls', kind: 'moved', itemIds: ['stall-a', 'stall-b', 'stall-c'], text: { tr: 'Üç tezgâhı da yerleştir', en: 'Place all three stalls' } },
      { id: 'near-street', kind: 'nearRoad', itemIds: ['stall-a', 'stall-b', 'stall-c'], max: 14, text: { tr: 'Tezgâhları yol kenarında tut', en: 'Keep the stalls beside the road' } },
      { id: 'market-gap', kind: 'separated', itemIds: ['stall-a', 'stall-b', 'stall-c'], min: 24, text: { tr: 'Tezgâhların arasını açık bırak', en: 'Leave room between the stalls' } },
      { id: 'home-clear', kind: 'awayFromLandmark', itemIds: ['stall-a', 'stall-b', 'stall-c'], landmarkId: 'home', min: 34, text: { tr: 'Evin önünü açık tut', en: 'Keep the home entrance clear' } },
      { id: 'clinic-clear', kind: 'awayFromLandmark', itemIds: ['stall-a', 'stall-b', 'stall-c'], landmarkId: 'clinic', min: 34, text: { tr: 'Sağlık merkezinin önünü açık tut', en: 'Keep the clinic entrance clear' } },
    ],
  },
  {
    id: 17,
    name: { tr: 'Parktan Eczaneye', en: 'From Park to Pharmacy' },
    intro: {
      tr: 'Eczaneyi iki eve yakın ve göletten uzak bir yere koy. Ardından giriş, fırın ve eczaneyi bağla.',
      en: 'Place the pharmacy near both homes and away from the pond. Then connect the entrance, bakery and pharmacy.',
    },
    objective: { tr: 'Eczaneyi yerleştir ve yolu tamamla', en: 'Place the pharmacy and complete the road' },
    tools: ['move', 'road'],
    landmarks: [
      { id: 'entrance', type: 'entrance', position: { x: 10, y: 106 }, label: { tr: 'Mahalle girişi', en: 'Neighbourhood entrance' } },
      { id: 'home-a', type: 'home', position: { x: 18, y: 22 }, label: { tr: 'Batı evi', en: 'West home' } },
      { id: 'home-b', type: 'home', position: { x: 82, y: 22 }, label: { tr: 'Doğu evi', en: 'East home' } },
      { id: 'bakery', type: 'bakery', position: { x: 87, y: 100 }, label: { tr: 'Mahalle fırını', en: 'Neighbourhood bakery' } },
    ],
    placeables: [{
      id: 'pharmacy', type: 'pharmacy', position: { x: 49, y: 108 }, label: { tr: 'Yeni eczane', en: 'New pharmacy' },
      guide: { position: { x: 50, y: 39 }, radius: 10, reason: { tr: 'İki eve yakın, göletten uzak', en: 'Near both homes, away from the pond' } },
    }],
    obstacles: [{ id: 'pond', type: 'pond', position: { x: 50, y: 75 }, radius: 11, label: { tr: 'Park göleti', en: 'Park pond' } }],
    requirements: [
      { id: 'move-pharmacy', kind: 'moved', itemIds: ['pharmacy'], text: { tr: 'Eczaneyi yeni yerine taşı', en: 'Move the pharmacy to its new place' } },
      { id: 'reach-homes', kind: 'coverage', itemId: 'pharmacy', targetIds: ['home-a', 'home-b'], radius: 40, count: 2, text: { tr: 'İki ev de eczaneye yürüyebilsin', en: 'Let both homes walk to the pharmacy' } },
      { id: 'protect-pond', kind: 'nearObstacle', itemId: 'pharmacy', obstacleId: 'pond', min: 29, text: { tr: 'Park göletini koru', en: 'Protect the park pond' } },
      { id: 'connect-pharmacy', kind: 'connect', anchorIds: ['entrance', 'bakery', 'pharmacy'], text: { tr: 'Giriş, fırın ve eczaneyi bağla', en: 'Connect the entrance, bakery and pharmacy' } },
    ],
    roadBudget: 192,
    efficientLength: 170,
    serviceRadius: { itemId: 'pharmacy', radius: 40 },
  },
  {
    id: 18,
    name: { tr: 'Üç Komşunun Parkı', en: 'A Park for Three Neighbours' },
    intro: {
      tr: 'Parkı üç evin de yürüyebileceği ortak bir noktaya taşı. Gölet kıyısındaki doğal alanı koru.',
      en: 'Move the park to a shared spot all three homes can reach. Protect the natural area by the pond.',
    },
    objective: { tr: 'Üç eve ortak park yeri bul', en: 'Find a shared park for three homes' },
    tools: ['move'],
    landmarks: [
      { id: 'home-a', type: 'home', position: { x: 16, y: 22 }, label: { tr: 'Batı evi', en: 'West home' } },
      { id: 'home-b', type: 'home', position: { x: 50, y: 18 }, label: { tr: 'Orta ev', en: 'Middle home' } },
      { id: 'home-c', type: 'home', position: { x: 84, y: 22 }, label: { tr: 'Doğu evi', en: 'East home' } },
    ],
    placeables: [{
      id: 'park', type: 'park', position: { x: 50, y: 108 }, label: { tr: 'Yeni mahalle parkı', en: 'New neighbourhood park' },
      guide: { position: { x: 50, y: 50 }, radius: 11, reason: { tr: 'Üç eve yakın, göletten uzak', en: 'Near all three homes, away from the pond' } },
    }],
    obstacles: [{ id: 'pond', type: 'pond', position: { x: 50, y: 85 }, radius: 10, label: { tr: 'Doğal gölet', en: 'Natural pond' } }],
    requirements: [
      { id: 'move-park', kind: 'moved', itemIds: ['park'], text: { tr: 'Parkı ortak noktaya taşı', en: 'Move the park to the shared spot' } },
      { id: 'three-homes', kind: 'coverage', itemId: 'park', targetIds: ['home-a', 'home-b', 'home-c'], radius: 45, count: 3, text: { tr: 'Üç ev de parka yürüyebilsin', en: 'Let all three homes walk to the park' } },
      { id: 'pond-clear', kind: 'nearObstacle', itemId: 'park', obstacleId: 'pond', min: 29, text: { tr: 'Gölet kıyısını koru', en: 'Protect the pond shore' } },
    ],
    serviceRadius: { itemId: 'park', radius: 45 },
  },
  {
    id: 19,
    name: { tr: 'Mahalle Şenliği', en: 'Neighbourhood Festival' },
    intro: {
      tr: 'Üç tezgâhı meydanın çevresine yerleştir. Aralarında dolaşma payı bırak ve sağlık merkezini açık tut.',
      en: 'Place three stalls around the square. Leave room to walk and keep the clinic clear.',
    },
    objective: { tr: 'Meydan şenliğini düzenle', en: 'Arrange the square festival' },
    tools: ['move'],
    landmarks: [
      { id: 'square', type: 'square', position: { x: 50, y: 43 }, label: { tr: 'Şenlik meydanı', en: 'Festival square' } },
      { id: 'clinic', type: 'clinic', position: { x: 87, y: 20 }, label: { tr: 'Sağlık merkezi', en: 'Clinic' } },
      { id: 'entrance', type: 'entrance', position: { x: 10, y: 106 }, label: { tr: 'Şenlik girişi', en: 'Festival entrance' } },
    ],
    placeables: [
      { id: 'stall-a', type: 'marketStall', position: { x: 25, y: 108 }, label: { tr: 'Yiyecek tezgâhı', en: 'Food stall' }, guide: { position: { x: 22, y: 64 }, radius: 8, reason: { tr: 'Meydanın solunda açık alan', en: 'Open space left of the square' } } },
      { id: 'stall-b', type: 'marketStall', position: { x: 50, y: 108 }, label: { tr: 'El işi tezgâhı', en: 'Craft stall' }, guide: { position: { x: 50, y: 74 }, radius: 8, reason: { tr: 'Meydana yakın ortak alan', en: 'A shared spot near the square' } } },
      { id: 'stall-c', type: 'marketStall', position: { x: 75, y: 108 }, label: { tr: 'Çiçek tezgâhı', en: 'Flower stall' }, guide: { position: { x: 78, y: 64 }, radius: 8, reason: { tr: 'Sağlık merkezinin girişinden uzak', en: 'Away from the clinic entrance' } } },
    ],
    obstacles: [{ id: 'tree', type: 'tree', position: { x: 50, y: 101 }, radius: 7, label: { tr: 'Şenlik ağacı', en: 'Festival tree' } }],
    requirements: [
      { id: 'move-festival', kind: 'moved', itemIds: ['stall-a', 'stall-b', 'stall-c'], text: { tr: 'Üç tezgâhı da meydana taşı', en: 'Move all three stalls to the square' } },
      { id: 'around-square', kind: 'nearLandmark', itemIds: ['stall-a', 'stall-b', 'stall-c'], landmarkId: 'square', max: 36, text: { tr: 'Tezgâhlar meydanın çevresinde olsun', en: 'Keep the stalls around the square' } },
      { id: 'festival-gap', kind: 'separated', itemIds: ['stall-a', 'stall-b', 'stall-c'], min: 25, text: { tr: 'Aralarında dolaşma payı bırak', en: 'Leave room to move between them' } },
      { id: 'clinic-clear', kind: 'awayFromLandmark', itemIds: ['stall-a', 'stall-b', 'stall-c'], landmarkId: 'clinic', min: 34, text: { tr: 'Sağlık merkezinin önünü açık tut', en: 'Keep the clinic entrance clear' } },
    ],
  },
  {
    id: 20,
    name: { tr: 'Ustalık Mahallesi', en: 'Master Neighbourhood' },
    intro: {
      tr: 'Sağlık merkeziyle durağı mahalleye paylaştır. Sonra bütün önemli yerleri kısa ve birleşen yollarla buluştur.',
      en: 'Share the clinic and stop across the neighbourhood. Then join every important place with short connected roads.',
    },
    objective: { tr: 'Son mahalle planını tamamla', en: 'Complete the final neighbourhood plan' },
    tools: ['move', 'road'],
    landmarks: [
      { id: 'entrance', type: 'entrance', position: { x: 9, y: 108 }, label: { tr: 'Mahalle girişi', en: 'Neighbourhood entrance' } },
      { id: 'home-a', type: 'home', position: { x: 16, y: 20 }, label: { tr: 'Batı evi', en: 'West home' } },
      { id: 'home-b', type: 'home', position: { x: 84, y: 20 }, label: { tr: 'Doğu evi', en: 'East home' } },
      { id: 'bakery', type: 'bakery', position: { x: 88, y: 100 }, label: { tr: 'Mahalle fırını', en: 'Neighbourhood bakery' } },
      { id: 'square', type: 'square', position: { x: 50, y: 70 }, label: { tr: 'Mahalle meydanı', en: 'Neighbourhood square' } },
    ],
    placeables: [
      { id: 'clinic', type: 'clinic', position: { x: 34, y: 108 }, label: { tr: 'Yeni sağlık merkezi', en: 'New clinic' }, guide: { position: { x: 33, y: 44 }, radius: 9, reason: { tr: 'İki eve de yakın hizmet noktası', en: 'A service point near both homes' } } },
      { id: 'stop', type: 'busStop', position: { x: 66, y: 108 }, label: { tr: 'Yeni durak', en: 'New bus stop' }, guide: { position: { x: 67, y: 44 }, radius: 9, reason: { tr: 'Meydanla fırına ulaşan durak', en: 'A stop serving the square and bakery' } } },
    ],
    obstacles: [
      { id: 'pond', type: 'pond', position: { x: 50, y: 28 }, radius: 8, label: { tr: 'Küçük gölet', en: 'Small pond' } },
      { id: 'garden', type: 'garden', position: { x: 50, y: 92 }, radius: 9, label: { tr: 'Topluluk bahçesi', en: 'Community garden' } },
    ],
    requirements: [
      { id: 'move-services', kind: 'moved', itemIds: ['clinic', 'stop'], text: { tr: 'İki hizmet noktasını da yerleştir', en: 'Place both service points' } },
      { id: 'clinic-homes', kind: 'coverage', itemId: 'clinic', targetIds: ['home-a', 'home-b'], radius: 57, count: 2, text: { tr: 'Sağlık merkezi iki eve de ulaşsın', en: 'Let the clinic reach both homes' } },
      { id: 'stop-centre', kind: 'coverage', itemId: 'stop', targetIds: ['square', 'bakery'], radius: 61, count: 2, text: { tr: 'Durak meydanla fırına hizmet etsin', en: 'Let the stop serve the square and bakery' } },
      { id: 'service-gap', kind: 'separated', itemIds: ['clinic', 'stop'], min: 28, text: { tr: 'Hizmetleri mahalleye yay', en: 'Spread the services across the neighbourhood' } },
      { id: 'protect-pond', kind: 'nearObstacle', itemId: 'clinic', obstacleId: 'pond', min: 21, text: { tr: 'Sağlık merkezini göletten uzak tut', en: 'Keep the clinic away from the pond' } },
      { id: 'connect-all', kind: 'connect', anchorIds: ['entrance', 'bakery', 'square', 'clinic', 'stop'], text: { tr: 'Beş önemli yeri tek yol ağında buluştur', en: 'Bring all five important places onto one road network' } },
    ],
    roadBudget: 255,
    efficientLength: 225,
    serviceRadius: { itemId: 'clinic', radius: 57 },
  },
]
