# Mahalle Ustası

Mahalle Ustası, oyuncunun parmağıyla organik sokaklar çizip mahalledeki yapıları birbirine bağladığı; sakin, neşeli ve yetişkinlere yönelik bir mobil düşünme oyunudur.

Oyunun ana dili Türkçedir. Ayarlardan İngilizceye geçilebilir.

## Ürün ilkeleri

- Birden fazla doğru çözüm
- Süre, can ve başarısızlık baskısı yok
- Sınırsız geri alma
- Her hamlede otomatik kayıt
- El titremelerini yumuşatan, geniş toleranslı parmak çizimi
- Binalara ve mevcut sokaklara manyetik bağlanma
- Izgara yerine organik arazi ve gerçek bir yol ağı
- 2. bölümden itibaren ortak yol ve yol bütçesi kararları
- 60+ kullanıcılar için büyük kontroller ve güçlü okunabilirlik
- Çevrimdışı çalışma
- Oyun tahtasında reklam yok

## Geliştirme

Gereksinimler: Node.js 22+

```bash
npm install
npm run dev
```

Kontroller:

```bash
npm run lint
npm test
npm run build
```

## Android

```bash
npm run android:sync
cd android
./gradlew assembleDebug
```

APK çıktısı `android/app/build/outputs/apk/debug/app-debug.apk` altında oluşur.

## Teknoloji

- React + TypeScript + Vite
- Capacitor Android
- Vitest + Testing Library
- Veri tabanlı bölüm ve yol-ağı graf motoru

## Durum

MVP-2 beş organik yol çizme bölümü, otomatik kavşaklar, korunan doğal alanlar, yol bütçeleri, Türkçe/İngilizce arayüz, yerel kayıt, erişilebilirlik ayarları ve Android paketleme altyapısını içerir.
