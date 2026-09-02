# Mahalle Ustası

Mahalle Ustası, oyuncunun mahalle yapılarını komşuluk ihtiyaçlarına göre yerleştirdiği; sakin, neşeli ve yetişkinlere yönelik bir mobil düşünme oyunudur.

Oyunun ana dili Türkçedir. Ayarlardan İngilizceye geçilebilir.

## Ürün ilkeleri

- Birden fazla doğru çözüm
- Süre, can ve başarısızlık baskısı yok
- Sınırsız geri alma
- Her hamlede otomatik kayıt
- Dokun–seç, dokun–yerleştir kontrolü
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
- Veri tabanlı bölüm ve kural motoru

## Durum

MVP-1 beş oynanabilir bölüm, Türkçe/İngilizce arayüz, öğretici, yerel kayıt, erişilebilirlik ayarları ve Android paketleme altyapısını içerir.
