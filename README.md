# OtoVizör Ekspertiz

Pilot Garage benzeri, bağımsız bir oto ekspertiz markası için hazırlanmış özgün web sitesi ve
içerik yönetim (admin) paneli. Next.js 16 (App Router) üzerinde, tek bir uygulama içinde hem
halka açık site hem de yönetim/backend tarafını barındırır.

## Öne Çıkan Özellikler

**Halka açık site**
- Anasayfa, Hizmetler, Paketler & Fiyatlar, Mobil Ekspertiz, Şubeler, Kampanyalar, S.S.S.,
  Hakkımızda, İletişim sayfaları
- Online randevu alma: şube/mobil seçimi, paket seçimi, tarih-saat müsaitlik kontrolü
- Randevu sorgulama: takip kodu + telefon ile durum sorgulama (Beklemede / Onaylandı / Tamamlandı / İptal)
- İletişim formu (mesajlar admin panelinde toplanır)
- WhatsApp hızlı iletişim butonu

**Yönetim paneli (`/admin`)**
- Giriş yapmış yönetici için: Panel (özet istatistikler), Randevular, Mesajlar, Hizmetler,
  Paketler, Şubeler, Kampanyalar, Yorumlar, S.S.S. ve Site Ayarları
- Tüm içerikler (hizmet, paket, şube, kampanya, yorum, S.S.S.) için ekle/düzenle/sil
- Randevu durumu güncelleme
- Site geneli ayarlar (marka adı, slogan, iletişim bilgileri, anasayfa metinleri, sosyal medya)

## Teknoloji

- **Next.js 16** (App Router, Server Actions/Functions, Turbopack)
- **React 19**, **TypeScript**, **Tailwind CSS v4**
- **Veritabanı:** [Turso](https://turso.tech) (hosted libSQL), `@libsql/client` ile — Vercel gibi
  sunucusuz ortamlarda kalıcı depolama sağlar. `TURSO_DATABASE_URL` tanımlı değilse yerel
  geliştirmede otomatik olarak `data/app.db` dosyası kullanılır, Turso hesabı gerekmez
- **Kimlik doğrulama:** `bcryptjs` ile parola hash'leme, `jose` ile imzalı JWT oturum çerezi
- **İkonlar:** `lucide-react`

## Kurulum

```bash
npm install
cp .env.example .env.local   # AUTH_SECRET değerini üretip ekleyin
npm run dev
```

`AUTH_SECRET` üretmek için:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Site `http://localhost:3000` adresinde, yönetim paneli `http://localhost:3000/admin` adresinde
açılır.

### Varsayılan yönetici girişi

Veritabanı ilk kez oluşturulduğunda otomatik olarak örnek içerikler (hizmetler, paketler,
şubeler, kampanyalar, yorumlar, S.S.S.) ve bir yönetici hesabı ile birlikte seed edilir:

- **E-posta:** `.env.local` içindeki `ADMIN_SEED_EMAIL` (varsayılan: `musttafaaktepe@gmail.com`)
- **Şifre:** `.env.local` içindeki `ADMIN_SEED_PASSWORD` (varsayılan: `Vezno2026!`)

**Üretime almadan önce mutlaka `/admin/settings` üzerinden ya da veritabanını sıfırlayıp
farklı `ADMIN_SEED_PASSWORD` ile yeniden oluşturarak şifreyi değiştirin.**

### Veritabanını sıfırlama

```bash
npm run db:reset
```

Bu komut `data/` klasörünü siler; bir sonraki `npm run dev` / `npm run build` çalıştığında
veritabanı boş bir şekilde yeniden oluşturulur ve örnek verilerle tekrar seed edilir.

## Komutlar

| Komut              | Açıklama                                  |
| ------------------ | ------------------------------------------ |
| `npm run dev`       | Geliştirme sunucusunu başlatır              |
| `npm run build`     | Üretim derlemesi oluşturur                  |
| `npm run start`     | Üretim derlemesini çalıştırır               |
| `npm run lint`      | ESLint kontrolü çalıştırır                  |
| `npm run db:reset`  | Yerel veritabanını siler (yeniden seed edilir) |

## Proje Yapısı

```
src/
  app/
    (site)/            Halka açık sayfalar (Header, Footer, WhatsApp butonu ile sarmalanır)
      randevu-al/       Randevu formu + server action
      randevu-sorgula/  Randevu durumu sorgulama
      iletisim/         İletişim formu + server action
      ...
    admin/
      login/            Giriş sayfası
      (protected)/      Oturum kontrolü yapılan tüm yönetim sayfaları
        appointments/   Randevu yönetimi
        services/       Hizmet CRUD
        packages/       Paket CRUD
        branches/       Şube CRUD
        campaigns/      Kampanya CRUD
        testimonials/   Yorum CRUD
        faqs/           S.S.S. CRUD
        messages/       İletişim formu mesajları
        settings/       Site ayarları
  lib/
    db.ts               Turso/libSQL bağlantısı + şema (tablolar `CREATE TABLE IF NOT EXISTS` ile)
    seed.ts              İlk kurulumda eklenen örnek veriler (tek transaction'da toplu ekleme)
    auth.ts / session.ts Parola hash'leme ve oturum (JWT çerez) yönetimi
    data/                Her tablo için async CRUD fonksiyonları (services, packages, branches, ...)
```

## Notlar

- Veritabanı Turso'da (hosted libSQL) tutulur; `TURSO_DATABASE_URL` tanımlı değilse yerel
  geliştirmede `data/app.db` dosyası kullanılır (`.gitignore` içinde, her klonlamada sıfırdan
  seed edilir).
- Statik olarak önbelleğe alınan sayfalar (anasayfa, hizmetler, paketler, şubeler vb.), admin
  panelinden yapılan her değişiklikte `revalidatePath` ile anında güncellenir — yeniden derleme
  gerekmez.
- Şube "Haritada Gör" linkleri, harici bir harita API anahtarı gerektirmeyen
  `google.com/maps/search` bağlantıları olarak otomatik oluşturulur; admin panelinden özel bir
  link de girilebilir.
