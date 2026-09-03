import type { LandmarkType, Locale } from './game/types'

const copy = {
  tr: {
    appName: 'Mahalle Ustası',
    tagline: 'Yolları çiz, komşuları buluştur, mahalleni canlandır.',
    start: 'Başla', continue: 'Devam Et', levels: 'Bölümler', settings: 'Ayarlar',
    close: 'Kapat', back: 'Geri', level: 'Bölüm', goals: 'Bugünün işi',
    undo: 'Geri Al', hint: 'İpucu', pause: 'Duraklat', restart: 'Baştan Kur',
    resume: 'Oyuna Dön', nextLevel: 'Sonraki Bölüm', home: 'Ana Sayfa',
    completeTitle: 'Mahalle canlandı!',
    completeBody: 'Herkesi kendi çizdiğin yol ağıyla buluşturdun.',
    allCompleteTitle: 'Gerçek bir Mahalle Ustası!',
    allCompleteBody: 'İlk beş mahalleyi ustalıkla canlandırdın. Yeni görevler yakında.',
    language: 'Dil', turkish: 'Türkçe', english: 'English', sound: 'Sesler',
    haptics: 'Dokunma hissi', largeText: 'Daha büyük yazı', highContrast: 'Yüksek kontrast',
    reducedMotion: 'Hareketleri azalt', accessibility: 'Görünüm ve rahatlık',
    progress: 'İlerlemeniz', completed: 'Tamamlandı', current: 'Sıradaki',
    locked: 'Önceki bölümü tamamlayın', chooseLevel: 'Bir bölüm seçin',
    privacyNote: 'İlerlemeniz yalnızca bu cihazda saklanır.', reset: 'İlerlemeyi Sıfırla',
    resetConfirm: 'Tüm ilerlemeyi silmek istediğinize emin misiniz?', cancel: 'Vazgeç',
    confirmReset: 'Evet, Sıfırla',
    drawCoach: 'Bir yerden başlayıp parmağını kaldırmadan diğerine yol çiz.',
    drawCoachShort: 'Yolu parmağınla çiz',
    connected: 'bağlandı',
    roadLength: 'Yol',
    roadBudget: 'Yol hakkı',
    efficientRoute: 'Usta işi güzergâh',
    efficientBody: 'Az yol kullanarak güçlü bir ağ kurdun.',
    gentleTryAgain: 'Yol çok kısa kaldı. Bir yapıdan ya da mevcut yoldan başlayabilirsin.',
    obstacleNotice: 'Bu alanı koruyoruz. Yolunu biraz çevresinden geçirelim.',
    budgetNotice: 'Her yer bağlandı; şimdi yolu kısaltmanın bir yolunu bulalım. Geri Al ile son sokağı değiştirebilirsin.',
    hintIntro: 'Ustanın önerisi',
    hintLevel1: 'Fırının önünden başla ve evin kapısına doğru tek hamlede çiz.',
    hintBranch: 'Her yer için ayrı yol gerekmez. Mevcut sokağa dokunup yeni bir kol çizebilirsin.',
    hintObstacle: 'Önce iki noktanın arasındaki açık koridoru bul. Yolun ortasını engelden uzağa kıvır.',
    hintNetwork: 'Ana bir omurga çiz, sonra yapıları bu omurgaya kısa sokaklarla bağla.',
    clearRoads: 'Yolları Temizle',
    neighbourhoodAlive: 'Mahalle hareketleniyor',
    drawing: 'Yol çiziliyor',
  },
  en: {
    appName: 'Neighbourhood Master',
    tagline: 'Draw the roads, bring neighbours together, make the town come alive.',
    start: 'Start', continue: 'Continue', levels: 'Levels', settings: 'Settings',
    close: 'Close', back: 'Back', level: 'Level', goals: "Today's job",
    undo: 'Undo', hint: 'Hint', pause: 'Pause', restart: 'Start Over',
    resume: 'Return to Game', nextLevel: 'Next Level', home: 'Home',
    completeTitle: 'The neighbourhood is alive!',
    completeBody: 'You brought everyone together with a road network of your own.',
    allCompleteTitle: 'A true Neighbourhood Master!',
    allCompleteBody: 'You brought the first five neighbourhoods to life. More jobs are coming soon.',
    language: 'Language', turkish: 'Türkçe', english: 'English', sound: 'Sounds',
    haptics: 'Touch feedback', largeText: 'Larger text', highContrast: 'High contrast',
    reducedMotion: 'Reduce motion', accessibility: 'Display and comfort',
    progress: 'Your progress', completed: 'Completed', current: 'Up next',
    locked: 'Complete the previous level first', chooseLevel: 'Choose a level',
    privacyNote: 'Your progress is stored only on this device.', reset: 'Reset Progress',
    resetConfirm: 'Are you sure you want to erase all progress?', cancel: 'Cancel',
    confirmReset: 'Yes, Reset',
    drawCoach: 'Start at one place and draw to another without lifting your finger.',
    drawCoachShort: 'Draw the road with your finger',
    connected: 'connected',
    roadLength: 'Road',
    roadBudget: 'Road allowance',
    efficientRoute: 'Masterful route',
    efficientBody: 'You built a strong network with less road.',
    gentleTryAgain: 'That road is a little short. Start from a place or an existing road.',
    obstacleNotice: 'We are protecting this spot. Let your road curve around it.',
    budgetNotice: 'Everything is connected; now find a shorter network. Use Undo to change the last street.',
    hintIntro: "The master's suggestion",
    hintLevel1: 'Start in front of the bakery and draw to the front door in one move.',
    hintBranch: 'You do not need a separate road for every place. Touch an existing street and draw a branch.',
    hintObstacle: 'Find the open corridor first, then curve the middle of the road away from the obstacle.',
    hintNetwork: 'Draw a main spine, then connect places to it with short side streets.',
    clearRoads: 'Clear Roads',
    neighbourhoodAlive: 'The neighbourhood is waking up',
    drawing: 'Drawing road',
  },
} as const

export type TranslationKey = keyof (typeof copy)['tr']

export function t(locale: Locale, key: TranslationKey): string {
  return copy[locale][key]
}

const landmarkNames: Record<Locale, Record<LandmarkType, string>> = {
  tr: { home: 'Ev', bakery: 'Fırın', clinic: 'Sağlık merkezi', busStop: 'Durak', entrance: 'Mahalle girişi', park: 'Park' },
  en: { home: 'Home', bakery: 'Bakery', clinic: 'Clinic', busStop: 'Bus stop', entrance: 'Neighbourhood entrance', park: 'Park' },
}

export function buildingName(locale: Locale, type: LandmarkType) {
  return landmarkNames[locale][type]
}
