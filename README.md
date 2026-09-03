# Mahalle Ustası

Mahalle Ustası, oyuncunun yollar çizdiği, ortak alanları düzenlediği ve farklı ihtiyaçları uzlaştırdığı; sakin, neşeli ve yetişkinlere yönelik bir mobil düşünme oyunudur.

Oyunun ana dili Türkçedir. Ayarlardan İngilizceye geçilebilir.

## Ürün ilkeleri

- Birden fazla doğru çözüm
- Süre, can ve başarısızlık baskısı yok
- Sınırsız geri alma
- Her hamlede otomatik kayıt
- El titremelerini yumuşatan, geniş toleranslı parmak çizimi
- Binalara ve mevcut sokaklara geniş alanlı manyetik bağlanma, dokunsal geri bildirim ve görünür yakalama animasyonu
- Izgara yerine organik arazi ve gerçek bir yol ağı
- Sürükle-bırak ve dokun-yerleştir seçenekleri
- Canlı güncellenen, birden fazla koşullu görevler
- Yol çizme, hizmet alanı bulma, park düzenleme ve pazar kurma gibi farklı oyun kipleri
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

## İlk beş görev

1. **Sıcak Ekmek Sokağı:** Parmağınla ilk yolu çiz; yol yaklaşınca kapılara çekilir.
2. **Durak Nerede Olsun?:** Durağı üç eve hizmet veren, göletten güvenli bir noktaya taşı.
3. **Parkta Bir Mola:** Bank, lamba ve çiçeklikle ilişkisel bir dinlenme köşesi kur.
4. **Pazar Sabahı:** Üç tezgâhı sokağa yakın, birbirinden ferah ve klinikten uzak yerleştir.
5. **Mahallenin Yeni Kalbi:** Sağlık merkezini konumlandır; sonra onu giriş ve fırınla kısa bir yol ağı üzerinden bağla.

## Durum

MVP-3; çok araçlı görev motoru, kendiliğinden birleşen yol ve kavşaklar, serbest nesne yerleştirme, canlı koşul geri bildirimi, Türkçe/İngilizce arayüz, yerel kayıt, erişilebilirlik ayarları ve Android paketleme altyapısını içerir.
