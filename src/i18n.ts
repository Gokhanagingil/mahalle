import type { BuildingType, Locale, Rule } from './game/types'

const copy = {
  tr: {
    appName: 'Mahalle Ustası',
    tagline: 'Düşün, yerleştir, mahalleni canlandır.',
    start: 'Başla',
    continue: 'Devam Et',
    levels: 'Bölümler',
    settings: 'Ayarlar',
    close: 'Kapat',
    back: 'Geri',
    level: 'Bölüm',
    goals: 'Mahallenin ihtiyaçları',
    placeThese: 'Yerleştirilecekler',
    undo: 'Geri Al',
    hint: 'İpucu',
    pause: 'Duraklat',
    restart: 'Yeniden Başlat',
    resume: 'Oyuna Dön',
    nextLevel: 'Sonraki Bölüm',
    home: 'Ana Sayfa',
    completeTitle: 'Mahalle canlandı!',
    completeBody: 'Koşulları kendi planınızla tamamladınız.',
    allCompleteTitle: 'İlk mahalle hazır!',
    allCompleteBody: 'Beş sokağı da ustalıkla planladınız. Yeni bölümler yakında.',
    selected: 'Seçildi',
    fixed: 'Sabit',
    emptyCell: 'Boş alan',
    selectPrompt: 'Önce alttaki yapılardan birini seçin.',
    movePrompt: 'Şimdi haritada boş bir alana dokunun.',
    tutorialSelect: 'Önce fırına dokunun.',
    tutorialPlace: 'Şimdi evin yanındaki parlayan alana dokunun.',
    tutorialDistanceSelect: 'Parkı seçerek başlayın.',
    tutorialDistancePlace: 'Parkı yoldan uzak, sakin bir alana yerleştirin.',
    hintIntro: 'Birlikte bakalım',
    hintGeneric: 'Koşullardaki iki yapı arasındaki ilişkiye bakın. Parlayan alanlar iyi bir başlangıç olabilir.',
    hintPark: 'Parkın yolun hemen yanında olmaması gerekiyor. Üst sıradaki sakin alanları deneyebilirsiniz.',
    hintBakery: 'Fırın, bir evle kenar komşusu olmalı. Evin üst, alt, sağ veya solundaki alanlara bakın.',
    hintPharmacy: 'Eczaneyi sağlık merkezinin üst, alt, sağ veya soluna yerleştirin.',
    hintStop: 'İki eve birden kenar komşusu olan ortak alanı bulun.',
    language: 'Dil',
    turkish: 'Türkçe',
    english: 'English',
    sound: 'Sesler',
    haptics: 'Dokunma hissi',
    largeText: 'Daha büyük yazı',
    highContrast: 'Yüksek kontrast',
    reducedMotion: 'Hareketleri azalt',
    accessibility: 'Görünüm ve rahatlık',
    progress: 'İlerlemeniz',
    completed: 'Tamamlandı',
    current: 'Sıradaki',
    locked: 'Önceki bölümü tamamlayın',
    chooseLevel: 'Bir bölüm seçin',
    privacyNote: 'İlerlemeniz yalnızca bu cihazda saklanır.',
    reset: 'İlerlemeyi Sıfırla',
    resetConfirm: 'Tüm ilerlemeyi silmek istediğinize emin misiniz?',
    cancel: 'Vazgeç',
    confirmReset: 'Evet, Sıfırla',
  },
  en: {
    appName: 'Neighbourhood Master',
    tagline: 'Think, place, bring your neighbourhood to life.',
    start: 'Start',
    continue: 'Continue',
    levels: 'Levels',
    settings: 'Settings',
    close: 'Close',
    back: 'Back',
    level: 'Level',
    goals: 'Neighbourhood needs',
    placeThese: 'Place these',
    undo: 'Undo',
    hint: 'Hint',
    pause: 'Pause',
    restart: 'Restart',
    resume: 'Return to Game',
    nextLevel: 'Next Level',
    home: 'Home',
    completeTitle: 'The neighbourhood is alive!',
    completeBody: 'You fulfilled every need with your own plan.',
    allCompleteTitle: 'Your first neighbourhood is ready!',
    allCompleteBody: 'You planned all five streets with care. More levels are coming soon.',
    selected: 'Selected',
    fixed: 'Fixed',
    emptyCell: 'Empty space',
    selectPrompt: 'First choose one of the buildings below.',
    movePrompt: 'Now tap an empty space on the map.',
    tutorialSelect: 'Start by tapping the bakery.',
    tutorialPlace: 'Now tap a glowing space next to a home.',
    tutorialDistanceSelect: 'Start by selecting the park.',
    tutorialDistancePlace: 'Place the park in a peaceful spot away from the road.',
    hintIntro: 'Let’s look together',
    hintGeneric: 'Look at the relationship between the two places. The glowing spaces are a good start.',
    hintPark: 'The park should not be right next to the road. Try a peaceful space in the top row.',
    hintBakery: 'The bakery should share an edge with a home. Look above, below, left or right of a home.',
    hintPharmacy: 'Place the pharmacy directly above, below, left or right of the clinic.',
    hintStop: 'Find a shared space that touches two homes.',
    language: 'Language',
    turkish: 'Türkçe',
    english: 'English',
    sound: 'Sounds',
    haptics: 'Touch feedback',
    largeText: 'Larger text',
    highContrast: 'High contrast',
    reducedMotion: 'Reduce motion',
    accessibility: 'Display and comfort',
    progress: 'Your progress',
    completed: 'Completed',
    current: 'Up next',
    locked: 'Complete the previous level first',
    chooseLevel: 'Choose a level',
    privacyNote: 'Your progress is stored only on this device.',
    reset: 'Reset Progress',
    resetConfirm: 'Are you sure you want to erase all progress?',
    cancel: 'Cancel',
    confirmReset: 'Yes, Reset',
  },
} as const

export type TranslationKey = keyof (typeof copy)['tr']

export function t(locale: Locale, key: TranslationKey): string {
  return copy[locale][key]
}

const buildingNames: Record<Locale, Record<BuildingType, string>> = {
  tr: {
    home: 'Ev',
    bakery: 'Fırın',
    park: 'Park',
    road: 'Ana yol',
    pharmacy: 'Eczane',
    clinic: 'Sağlık merkezi',
    busStop: 'Durak',
    square: 'Meydan',
  },
  en: {
    home: 'Home',
    bakery: 'Bakery',
    park: 'Park',
    road: 'Main road',
    pharmacy: 'Pharmacy',
    clinic: 'Clinic',
    busStop: 'Bus stop',
    square: 'Square',
  },
}

export function buildingName(locale: Locale, type: BuildingType) {
  return buildingNames[locale][type]
}

export function ruleText(locale: Locale, rule: Rule): string {
  const subject = buildingName(locale, rule.subject)
  const target = buildingName(locale, rule.target)

  if (locale === 'tr') {
    if (rule.kind === 'adjacent') return `${subject}, ${target.toLocaleLowerCase('tr-TR')} yanında olsun.`
    if (rule.kind === 'notAdjacent') return `${subject}, ${target.toLocaleLowerCase('tr-TR')} yanında olmasın.`
    return `${subject}, en az ${rule.count} ${target.toLocaleLowerCase('tr-TR')} yakınına ulaşsın.`
  }

  if (rule.kind === 'adjacent') return `Place the ${subject.toLowerCase()} next to the ${target.toLowerCase()}.`
  if (rule.kind === 'notAdjacent') return `Keep the ${subject.toLowerCase()} away from the ${target.toLowerCase()}.`
  return `Let the ${subject.toLowerCase()} reach at least ${rule.count} ${target.toLowerCase()}s.`
}
