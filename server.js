const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const USER_AGENT = 'vezno-isletme-tarayici/1.0 (iletisim: musttafaaktepe@gmail.com)';

// Sik kullanilan isletme turleri -> OSM etiketleri. "custom" secilirse kullanicinin
// girdigi key=value dogrudan kullanilir, boylece cesit serbestce ayarlanabilir.
const CATEGORIES = [
  { id: 'restaurant', label: 'Restoran', tag: 'amenity=restaurant' },
  { id: 'cafe', label: 'Kafe', tag: 'amenity=cafe' },
  { id: 'fast_food', label: 'Fast Food', tag: 'amenity=fast_food' },
  { id: 'bar', label: 'Bar', tag: 'amenity=bar' },
  { id: 'pub', label: 'Pub', tag: 'amenity=pub' },
  { id: 'bakery', label: 'Firin / Pastane', tag: 'shop=bakery' },
  { id: 'supermarket', label: 'Market / Supermarket', tag: 'shop=supermarket' },
  { id: 'pharmacy', label: 'Eczane', tag: 'amenity=pharmacy' },
  { id: 'hairdresser', label: 'Kuafor / Berber', tag: 'shop=hairdresser' },
  { id: 'clothes', label: 'Giyim Magazasi', tag: 'shop=clothes' },
  { id: 'bank', label: 'Banka', tag: 'amenity=bank' },
  { id: 'atm', label: 'ATM', tag: 'amenity=atm' },
  { id: 'fuel', label: 'Benzin Istasyonu', tag: 'amenity=fuel' },
  { id: 'hotel', label: 'Otel', tag: 'tourism=hotel' },
  { id: 'hospital', label: 'Hastane', tag: 'amenity=hospital' },
  { id: 'gym', label: 'Spor Salonu', tag: 'leisure=fitness_centre' },
];

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/categories', (req, res) => {
  res.json(CATEGORIES);
});

// Mahalle / adres adini koordinata cevirir.
app.get('/api/geocode', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) {
    return res.status(400).json({ error: 'Arama metni (q) gerekli.' });
  }

  try {
    const url = new URL(NOMINATIM_URL);
    url.searchParams.set('q', q);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '5');
    url.searchParams.set('addressdetails', '1');

    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Nominatim hata dondu: ${response.status}`);
    }

    const results = await response.json();
    res.json(
      results.map((r) => ({
        display_name: r.display_name,
        lat: parseFloat(r.lat),
        lon: parseFloat(r.lon),
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Konum aranirken bir hata olustu.' });
  }
});

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildAddress(tags) {
  if (!tags) return '';
  const parts = [
    tags['addr:neighbourhood'],
    tags['addr:street'],
    tags['addr:housenumber'],
    tags['addr:district'],
  ].filter(Boolean);
  return parts.join(' ');
}

const TAG_PATTERN = /^[a-zA-Z_:]+=[^=]+$/;

app.get('/api/search', async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);
  const radius = parseInt(req.query.radius, 10);
  const categoryId = req.query.category;
  const customTag = (req.query.customTag || '').trim();

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return res.status(400).json({ error: 'Gecerli bir koordinat girin.' });
  }
  if (Number.isNaN(radius) || radius <= 0 || radius > 20000) {
    return res.status(400).json({ error: 'Yaricap 1 - 20000 metre arasinda olmalidir.' });
  }

  let tag;
  if (categoryId === 'custom') {
    if (!TAG_PATTERN.test(customTag)) {
      return res.status(400).json({ error: 'Ozel etiket "anahtar=deger" formatinda olmalidir (orn: amenity=veterinary).' });
    }
    tag = customTag;
  } else {
    const category = CATEGORIES.find((c) => c.id === categoryId);
    if (!category) {
      return res.status(400).json({ error: 'Gecersiz isletme turu.' });
    }
    tag = category.tag;
  }

  const [key, value] = tag.split('=');
  const filter = `["${key}"="${value}"]`;

  const query = `
    [out:json][timeout:25];
    (
      node${filter}(around:${radius},${lat},${lon});
      way${filter}(around:${radius},${lat},${lon});
      relation${filter}(around:${radius},${lat},${lon});
    );
    out center tags;
  `;

  try {
    const response = await fetch(OVERPASS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': USER_AGENT,
      },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      throw new Error(`Overpass hata dondu: ${response.status}`);
    }

    const data = await response.json();

    const results = (data.elements || [])
      .map((el) => {
        const elLat = el.lat ?? el.center?.lat;
        const elLon = el.lon ?? el.center?.lon;
        if (elLat == null || elLon == null) return null;

        return {
          id: `${el.type}/${el.id}`,
          name: el.tags?.name || 'Isimsiz isletme',
          lat: elLat,
          lon: elLon,
          address: buildAddress(el.tags),
          phone: el.tags?.phone || el.tags?.['contact:phone'] || '',
          opening_hours: el.tags?.opening_hours || '',
          distance: Math.round(haversineMeters(lat, lon, elLat, elLon)),
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.distance - b.distance);

    res.json({ count: results.length, results });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Isletmeler taranirken bir hata olustu.' });
  }
});

app.listen(PORT, () => {
  console.log(`Vezno isletme tarayici http://localhost:${PORT} adresinde calisiyor`);
});
