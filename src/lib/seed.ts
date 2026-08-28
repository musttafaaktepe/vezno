import type { InStatement } from "@libsql/client";
import { genId } from "./ids";
import { hashPassword } from "./auth";

export function seedStatements(): InStatement[] {
  const statements: InStatement[] = [];

  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "musttafaaktepe@gmail.com";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? "Vezno2026!";
  statements.push({
    sql: `INSERT INTO adminUsers (id, email, passwordHash, name) VALUES (?, ?, ?, ?)`,
    args: [genId(), adminEmail, hashPassword(adminPassword), "Yönetici"],
  });

  const services: [string, string, string, string, string][] = [
    [
      "motor-performans-analizi",
      "Motor Performans Analizi",
      "OBD taraması, kompresyon ve sıcaklık ölçümüyle motorun gerçek durumunu ortaya çıkarıyoruz.",
      "Aracın motoruna bilgisayarlı OBD taraması yapılır, arıza kodları ve silinmiş kayıtlar incelenir. Kompresyon, yağ kaçağı, egzoz emisyonu ve motor titreşimi ölçülerek gizli sorunlar tespit edilir.",
      "engine",
    ],
    [
      "boya-kaporta-kontrolu",
      "Boya & Kaporta Kontrolü",
      "Dijital boya kalınlığı ölçüm cihazıyla aracın tüm yüzeyi milim milim taranır.",
      "Her panel dijital boya kalınlığı ölçer ile taranır, orijinal boya ile sonradan yapılan işlemler ayrıştırılır. Çarpışma, boyalı, lokal boyalı ve değişen parçalar raporda ayrı ayrı işaretlenir.",
      "paint",
    ],
    [
      "sase-govde-kontrolu",
      "Şase & Gövde Kontrolü",
      "Kaporta ölçüm sistemi ile şasenin hasar görüp görmediğini milimetrik olarak belirliyoruz.",
      "Şase üzerindeki kaynak izleri, ezik, kırık ve düzeltme belirtileri incelenir. Yapısal parçalarda sapma olup olmadığı lazer destekli ölçüm ile kontrol edilir.",
      "frame",
    ],
    [
      "suspansiyon-direksiyon-testi",
      "Süspansiyon & Direksiyon Testi",
      "Amortisör, salıncak, rot ve rotil kontrolüyle sürüş güvenliğini test ediyoruz.",
      "Süspansiyon test cihazında her tekerlek ayrı ayrı ölçülür. Direksiyon kutusu, rot, rotil ve balans kontrolü yapılarak yol tutuşunu etkileyen tüm parçalar raporlanır.",
      "suspension",
    ],
    [
      "fren-sistemi-testi",
      "Fren Sistemi Testi",
      "Fren diski, balata aşınması ve fren performansı silindirli test cihazında ölçülür.",
      "Fren diski kalınlığı, balata aşınma payı ve fren dengesizliği silindirli fren test cihazında ölçülerek raporlanır. ABS ve EBS sistemlerinin çalışması da kontrol edilir.",
      "brake",
    ],
    [
      "yol-testi-suruş-analizi",
      "Yol Testi & Sürüş Analizi",
      "Gerçek trafik koşullarında şanzıman, debriyaj ve genel sürüş davranışı değerlendirilir.",
      "Uzman eksperimiz eşliğinde yapılan yol testinde şanzıman geçişleri, debriyaj temas noktası, gürültü ve titreşimler dinlenir; günlük kullanımda karşılaşabileceğiniz sorunlar önceden tespit edilir.",
      "road",
    ],
    [
      "ic-dis-donanim-kontrolu",
      "İç & Dış Donanım Kontrolü",
      "Elektronik, klima, multimedya ve güvenlik donanımlarının tamamı tek tek test edilir.",
      "Cam, ayna, klima, multimedya, park sensörü, geri görüş kamerası, hava yastığı ve tüm elektronik donanımların çalışır durumda olup olmadığı test edilir.",
      "cabin",
    ],
    [
      "detayli-ekspertiz-raporu",
      "Detaylı Ekspertiz Raporu",
      "Fotoğraflı, puanlı ve kolay okunur dijital rapor, kontrol biter bitmez elinizde.",
      "Tüm kontrol adımları fotoğraflarla belgelenir, 100 üzerinden puanlanır ve PDF olarak size e-posta ile iletilir. Rapor, alım-satım pazarlığında elinizi güçlendirir.",
      "report",
    ],
  ];
  services.forEach((s, i) =>
    statements.push({
      sql: `INSERT INTO services (id, slug, title, summary, description, icon, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [genId(), s[0], s[1], s[2], s[3], s[4], i],
    }),
  );

  const packages: [string, string, number, string, string, string[], boolean][] = [
    [
      "mini-kontrol",
      "Mini Kontrol",
      1500,
      "30 dakika",
      "Hızlı karar vermeniz gereken durumlar için temel boya ve şase kontrolü.",
      ["Boya kalınlığı ölçümü", "Görsel şase kontrolü", "10 dakikada ön bilgi"],
      false,
    ],
    [
      "standart-ekspertiz",
      "Standart Ekspertiz",
      3500,
      "60 dakika",
      "Motor, boya, şase, süspansiyon ve fren kontrollerini kapsayan dengeli paket.",
      [
        "Motor performans testi",
        "Boya & kaporta kontrolü",
        "Şase kontrolü",
        "Süspansiyon testi",
        "Fren testi",
        "PDF rapor",
      ],
      false,
    ],
    [
      "kapsamli-ekspertiz",
      "Kapsamlı Ekspertiz",
      5500,
      "90 dakika",
      "En çok tercih edilen paket. Standart pakete yol testi ve donanım kontrolü eklenir.",
      [
        "Standart paketteki tüm testler",
        "Yol testi & sürüş analizi",
        "İç-dış donanım kontrolü",
        "OBD arıza taraması",
        "Aynı gün PDF rapor",
      ],
      true,
    ],
    [
      "premium-ekspertiz",
      "Premium Ekspertiz",
      8900,
      "120 dakika",
      "Araç almadan önce hiçbir soru işareti bırakmak istemeyenler için tam kapsamlı inceleme.",
      [
        "Kapsamlı paketteki tüm testler",
        "Hasar & boya geçmişi sorgulama",
        "Öncelikli randevu",
        "Genişletilmiş garanti raporu",
        "Ekspertle birebir görüşme",
      ],
      false,
    ],
    [
      "mobil-ekspertiz-paketi",
      "Mobil Ekspertiz Paketi",
      6500,
      "90 dakika",
      "Şubeye gelmenize gerek yok, ekipmanlı ekibimiz aracın bulunduğu yere gelir.",
      [
        "Yerinde kapsamlı kontrol",
        "Taşınabilir ölçüm cihazları",
        "Aynı gün PDF rapor",
        "İstanbul, Ankara, İzmir içi ücretsiz ulaşım",
      ],
      false,
    ],
  ];
  packages.forEach((p, i) =>
    statements.push({
      sql: `INSERT INTO packages (id, slug, name, price, duration, description, features, highlighted, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [genId(), p[0], p[1], p[2], p[3], p[4], JSON.stringify(p[5]), p[6] ? 1 : 0, i],
    }),
  );

  const branches: [string, string, string, string, string, string, string][] = [
    [
      "istanbul-kadikoy",
      "İstanbul Kadıköy Şubesi",
      "İstanbul",
      "Kadıköy",
      "Caferağa Mah. Muayene Sok. No:14, Kadıköy/İstanbul",
      "0216 555 01 01",
      "Hafta içi 08:30-19:00, Cumartesi 09:00-17:00, Pazar kapalı",
    ],
    [
      "istanbul-umraniye",
      "İstanbul Ümraniye Şubesi",
      "İstanbul",
      "Ümraniye",
      "Atatürk Mah. Ekspertiz Cad. No:7, Ümraniye/İstanbul",
      "0216 555 02 02",
      "Hafta içi 08:30-19:00, Cumartesi 09:00-17:00, Pazar kapalı",
    ],
    [
      "ankara-cankaya",
      "Ankara Çankaya Şubesi",
      "Ankara",
      "Çankaya",
      "Kızılırmak Mah. Test Sok. No:22, Çankaya/Ankara",
      "0312 555 03 03",
      "Hafta içi 08:30-19:00, Cumartesi 09:00-17:00, Pazar kapalı",
    ],
    [
      "izmir-bornova",
      "İzmir Bornova Şubesi",
      "İzmir",
      "Bornova",
      "Erzene Mah. Kontrol Cad. No:5, Bornova/İzmir",
      "0232 555 04 04",
      "Hafta içi 08:30-19:00, Cumartesi 09:00-17:00, Pazar kapalı",
    ],
    [
      "bursa-nilufer",
      "Bursa Nilüfer Şubesi",
      "Bursa",
      "Nilüfer",
      "Konak Mah. Analiz Sok. No:9, Nilüfer/Bursa",
      "0224 555 05 05",
      "Hafta içi 08:30-19:00, Cumartesi 09:00-17:00, Pazar kapalı",
    ],
    [
      "antalya-muratpasa",
      "Antalya Muratpaşa Şubesi",
      "Antalya",
      "Muratpaşa",
      "Fener Mah. Rapor Cad. No:18, Muratpaşa/Antalya",
      "0242 555 06 06",
      "Hafta içi 08:30-19:00, Cumartesi 09:00-17:00, Pazar kapalı",
    ],
  ];
  branches.forEach((b, i) => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b[4])}`;
    statements.push({
      sql: `INSERT INTO branches (id, slug, name, city, district, address, phone, workingHours, mapUrl, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [genId(), b[0], b[1], b[2], b[3], b[4], b[5], b[6], mapUrl, i],
    });
  });

  const campaigns: [string, string, string, string][] = [
    [
      "ilk-randevu-indirimi",
      "İlk Randevuya Özel %15 İndirim",
      "Bizi ilk kez tercih eden müşterilerimize tüm paketlerde geçerli %15 indirim fırsatı.",
      "Yeni Üye",
    ],
    [
      "kapsamli-pakette-yol-testi-hediye",
      "Kapsamlı Pakette Yol Testi Hediye",
      "Kapsamlı Ekspertiz paketini seçenlere yol testi ve sürüş analizi ücretsiz.",
      "Sınırlı Süre",
    ],
    [
      "arkadasini-getir-kazan",
      "Arkadaşını Getir, 500 TL Kazan",
      "Yönlendirdiğiniz her yeni müşteri için bir sonraki ekspertizinizde 500 TL indirim kazanın.",
      "Referans",
    ],
  ];
  campaigns.forEach((c, i) =>
    statements.push({
      sql: `INSERT INTO campaigns (id, slug, title, description, badge, sortOrder) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [genId(), c[0], c[1], c[2], c[3], i],
    }),
  );

  const testimonials: [string, string, string, number, string][] = [
    [
      "Emre K.",
      "İstanbul",
      "2019 Model Sedan",
      5,
      "Almadan önce kontrol ettirdiğim için boyalı kapıyı fark ettim ve pazarlıkta işime yaradı. Rapor gerçekten detaylıydı.",
    ],
    [
      "Sena T.",
      "Ankara",
      "2021 Model SUV",
      5,
      "Randevu almak çok kolaydı, tam saatinde başladılar. 90 dakikada aracımın tüm geçmişini öğrendim.",
    ],
    [
      "Murat A.",
      "İzmir",
      "2017 Model Hatchback",
      4,
      "Mobil ekspertiz hizmetini kullandım, ekip zamanında geldi. Fiyatı da şubeye gitmekten çok farklı değildi.",
    ],
    [
      "Deniz Y.",
      "Bursa",
      "2022 Model Sedan",
      5,
      "Şase kontrolünde küçük bir onarım izi bulundu, satıcı bundan hiç bahsetmemişti. Kesinlikle tavsiye ederim.",
    ],
    [
      "Ayşe B.",
      "Antalya",
      "2018 Model SUV",
      5,
      "Raporu PDF olarak e-postama gönderdiler, satıcıyla paylaşıp fiyatı 15 bin TL aşağı çektim.",
    ],
  ];
  testimonials.forEach((t, i) =>
    statements.push({
      sql: `INSERT INTO testimonials (id, name, city, vehicle, rating, comment, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [genId(), t[0], t[1], t[2], t[3], t[4], i],
    }),
  );

  const faqs: [string, string][] = [
    [
      "Ekspertiz işlemi ne kadar sürer?",
      "Seçtiğiniz pakete göre değişmekle birlikte ortalama süre 30 ile 120 dakika arasındadır. Kapsamlı ve premium paketlerde yol testi de bulunduğu için süre biraz daha uzundur.",
    ],
    [
      "Randevusuz gelebilir miyim?",
      "Şubelerimize randevusuz da gelebilirsiniz, ancak yoğunluk nedeniyle bekleme süresi oluşabilir. En hızlı hizmet için online randevu almanızı öneririz.",
    ],
    [
      "Rapor ne zaman elime ulaşır?",
      "Kontrol tamamlandıktan sonra raporunuz aynı gün içinde PDF formatında e-posta adresinize gönderilir, isteğe bağlı olarak yazılı çıktı da alabilirsiniz.",
    ],
    [
      "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
      "Nakit, kredi kartı ve banka kartı ile ödeme kabul edilmektedir. Kurumsal müşterilerimiz için fatura kesilebilmektedir.",
    ],
    [
      "Mobil ekspertiz hangi bölgelerde hizmet veriyor?",
      "Mobil ekspertiz ekibimiz şu an İstanbul, Ankara ve İzmir il sınırları içinde hizmet vermektedir, diğer şehirler için şubemizi arayarak bilgi alabilirsiniz.",
    ],
    [
      "Randevumu nasıl iptal edebilir veya değiştirebilirim?",
      "Randevu sorgulama sayfasından takip kodunuz ve telefon numaranızla randevunuzu görüntüleyebilir, şubemizi arayarak değişiklik talep edebilirsiniz.",
    ],
  ];
  faqs.forEach((f, i) =>
    statements.push({
      sql: `INSERT INTO faqs (id, question, answer, sortOrder) VALUES (?, ?, ?, ?)`,
      args: [genId(), f[0], f[1], i],
    }),
  );

  statements.push({
    sql: `INSERT INTO siteSettings (id, brandName, tagline, phone, whatsapp, email, address, heroTitle, heroSubtitle, aboutText, workingHours) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      "main",
      "Cesa Oto Ekspertiz",
      "Aracınızı almadan önce gerçeği görün.",
      "+90 533 517 23 75",
      "905335172375",
      "info@cesaotoekspertiz.com",
      "Karlıktepe Mahallesi, Spor Caddesi No: 33/B, 34870 Kartal / İstanbul",
      "Araç Almadan Önce, Gerçeği Görün",
      "Bağımsız ve tarafsız oto ekspertiz hizmeti. Şubelerimizde ya da bulunduğunuz yerde, 120'den fazla noktadan detaylı kontrol ile aracın gerçek durumunu öğrenin.",
      "Cesa Oto Ekspertiz, ikinci el araç alım-satımında güvenilir karar verebilmeniz için 2011'den bu yana bağımsız ekspertiz hizmeti sunuyor. Alanında uzman eksperlerimiz ve son teknoloji ölçüm cihazlarımızla, her aracı 120'den fazla kontrol noktasından geçiriyor, sonucu tarafsız ve anlaşılır bir raporla elinize ulaştırıyoruz. Amacımız; sizi yalnızca bir rapor değil, doğru bir karar ile baş başa bırakmak.",
      "Hafta içi 08:30-19:00, Cumartesi 09:00-17:00, Pazar kapalı",
    ],
  });

  return statements;
}
