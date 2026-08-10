const map = L.map('map').setView([41.0082, 28.9784], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap katkida bulunanlar',
  maxZoom: 19,
}).addTo(map);

let centerMarker = null;
let radiusCircle = null;
let resultMarkers = [];

const form = document.getElementById('search-form');
const latInput = document.getElementById('lat');
const lonInput = document.getElementById('lon');
const radiusInput = document.getElementById('radius');
const radiusValue = document.getElementById('radius-value');
const sourceSelect = document.getElementById('source');
const categorySelect = document.getElementById('category');
const customTagField = document.getElementById('custom-tag-field');
const customTagInput = document.getElementById('customTag');
const customTagLabel = customTagField.querySelector('label');
const placeInput = document.getElementById('place');
const geocodeBtn = document.getElementById('geocode-btn');
const geocodeResults = document.getElementById('geocode-results');
const statusEl = document.getElementById('status');
const resultsCount = document.getElementById('results-count');
const resultsList = document.getElementById('results-list');
const exportExcelBtn = document.getElementById('export-excel');
const exportPdfBtn = document.getElementById('export-pdf');

let lastResults = [];
let lastSearchMeta = null;

function setStatus(message, isError = false) {
  statusEl.textContent = message || '';
  statusEl.classList.toggle('error', isError);
}

radiusInput.addEventListener('input', () => {
  radiusValue.textContent = radiusInput.value;
});

async function loadCategories() {
  const res = await fetch('/api/categories');
  const categories = await res.json();
  categorySelect.innerHTML = '';
  categories.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.label;
    categorySelect.appendChild(opt);
  });
  const customOpt = document.createElement('option');
  customOpt.value = 'custom';
  customOpt.textContent = 'Ozel etiket girecegim...';
  categorySelect.appendChild(customOpt);
}

function updateCustomTagField() {
  customTagField.hidden = categorySelect.value !== 'custom';
  if (sourceSelect.value === 'google') {
    customTagLabel.textContent = 'Ozel Anahtar Kelime (orn: veteriner)';
    customTagInput.placeholder = 'Orn: veteriner';
  } else {
    customTagLabel.textContent = 'Ozel OSM Etiketi (anahtar=deger)';
    customTagInput.placeholder = 'Orn: amenity=veterinary';
  }
}

categorySelect.addEventListener('change', updateCustomTagField);
sourceSelect.addEventListener('change', updateCustomTagField);

async function loadConfig() {
  try {
    const res = await fetch('/api/config');
    const data = await res.json();
    const googleOption = sourceSelect.querySelector('option[value="google"]');
    if (!data.googleAvailable) {
      googleOption.disabled = true;
      googleOption.textContent = 'Google Places (API anahtari tanimli degil)';
    }
  } catch {
    // config alinamazsa varsayilan (OSM) ile devam edilir
  }
}

geocodeBtn.addEventListener('click', async () => {
  const q = placeInput.value.trim();
  if (!q) {
    setStatus('Lutfen bir mahalle veya adres yazin.', true);
    return;
  }
  setStatus('Konum araniyor...');
  geocodeResults.innerHTML = '';
  try {
    const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Hata olustu');

    if (data.length === 0) {
      setStatus('Sonuc bulunamadi.', true);
      return;
    }

    setStatus('Bir sonuc secin.');
    data.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.textContent = item.display_name;
      div.addEventListener('click', () => {
        latInput.value = item.lat.toFixed(6);
        lonInput.value = item.lon.toFixed(6);
        map.setView([item.lat, item.lon], 15);
        geocodeResults.innerHTML = '';
        setStatus('Konum secildi. Simdi tarayabilirsiniz.');
      });
      geocodeResults.appendChild(div);
    });
  } catch (err) {
    setStatus(err.message, true);
  }
});

function clearMapLayers() {
  if (centerMarker) map.removeLayer(centerMarker);
  if (radiusCircle) map.removeLayer(radiusCircle);
  resultMarkers.forEach((m) => map.removeLayer(m));
  resultMarkers = [];
}

function renderResults(lat, lon, radius, results) {
  clearMapLayers();

  centerMarker = L.marker([lat, lon]).addTo(map).bindPopup('Arama merkezi');
  radiusCircle = L.circle([lat, lon], { radius, color: '#4f9dfb', fillOpacity: 0.05 }).addTo(map);
  map.fitBounds(radiusCircle.getBounds());

  resultsCount.textContent = `${results.length} isletme bulundu`;
  resultsList.innerHTML = '';

  lastResults = results;
  exportExcelBtn.disabled = results.length === 0;
  exportPdfBtn.disabled = results.length === 0;

  results.forEach((biz) => {
    const marker = L.marker([biz.lat, biz.lon]).addTo(map).bindPopup(`<b>${biz.name}</b><br>${biz.address || ''}`);
    resultMarkers.push(marker);

    const li = document.createElement('li');
    li.className = 'result-item';
    li.innerHTML = `
      <div class="name">${biz.name}</div>
      <div class="meta">${biz.address ? biz.address + ' &middot; ' : ''}${biz.distance} m uzaklikta</div>
      ${biz.phone ? `<div class="meta">Tel: ${biz.phone}</div>` : ''}
      ${biz.opening_hours ? `<div class="meta">Saatler: ${biz.opening_hours}</div>` : ''}
      ${biz.rating ? `<div class="meta">Puan: ${biz.rating} / 5${biz.ratingCount ? ` (${biz.ratingCount} yorum)` : ''}</div>` : ''}
    `;
    li.addEventListener('click', () => {
      map.setView([biz.lat, biz.lon], 17);
      marker.openPopup();
    });
    resultsList.appendChild(li);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const lat = parseFloat(latInput.value);
  const lon = parseFloat(lonInput.value);
  const radius = parseInt(radiusInput.value, 10);
  const category = categorySelect.value;
  const customTag = customTagInput.value.trim();
  const source = sourceSelect.value;

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    setStatus('Lutfen gecerli enlem/boylam girin.', true);
    return;
  }

  const params = new URLSearchParams({ lat, lon, radius, category, source });
  if (category === 'custom') params.set('customTag', customTag);

  setStatus('Isletmeler taraniyor...');
  resultsList.innerHTML = '';
  resultsCount.textContent = '';
  exportExcelBtn.disabled = true;
  exportPdfBtn.disabled = true;

  try {
    const res = await fetch(`/api/search?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Hata olustu');

    renderResults(lat, lon, radius, data.results);
    lastSearchMeta = {
      lat,
      lon,
      radius,
      category: categorySelect.selectedOptions[0]?.text || category,
      source: sourceSelect.selectedOptions[0]?.text || source,
    };
    setStatus(`Tamamlandi: ${data.count} sonuc.`);
  } catch (err) {
    setStatus(err.message, true);
  }
});

const TR_MAP = { ş: 's', Ş: 'S', ğ: 'g', Ğ: 'G', ı: 'i', İ: 'I', ö: 'o', Ö: 'O', ü: 'u', Ü: 'U', ç: 'c', Ç: 'C' };
function stripTr(str) {
  return String(str || '').replace(/[şŞğĞıİöÖüÜçÇ]/g, (ch) => TR_MAP[ch]);
}

exportExcelBtn.addEventListener('click', () => {
  if (lastResults.length === 0) return;

  const rows = lastResults.map((biz) => ({
    'Isim': biz.name,
    'Adres': biz.address || '',
    'Mesafe (m)': biz.distance,
    'Telefon': biz.phone || '',
    'Puan': biz.rating ?? '',
    'Yorum Sayisi': biz.ratingCount ?? '',
    'Calisma Saatleri': biz.opening_hours || '',
    'Enlem': biz.lat,
    'Boylam': biz.lon,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Isletmeler');
  XLSX.writeFile(workbook, `isletmeler-${Date.now()}.xlsx`);
});

exportPdfBtn.addEventListener('click', () => {
  if (lastResults.length === 0) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text('Isletme Tarama Sonuclari', 14, 16);
  doc.setFontSize(9);
  if (lastSearchMeta) {
    doc.text(
      stripTr(
        `Tur: ${lastSearchMeta.category} | Kaynak: ${lastSearchMeta.source} | Yaricap: ${lastSearchMeta.radius} m | Merkez: ${lastSearchMeta.lat.toFixed(5)}, ${lastSearchMeta.lon.toFixed(5)}`
      ),
      14,
      22
    );
  }

  doc.autoTable({
    startY: 27,
    head: [['Isim', 'Adres', 'Mesafe (m)', 'Telefon', 'Puan (Yorum)']],
    body: lastResults.map((biz) => [
      stripTr(biz.name),
      stripTr(biz.address || ''),
      String(biz.distance),
      biz.phone || '',
      biz.rating ? `${biz.rating}${biz.ratingCount ? ` (${biz.ratingCount})` : ''}` : '',
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [79, 157, 251] },
  });

  doc.save(`isletmeler-${Date.now()}.pdf`);
});

loadCategories();
loadConfig();
updateCustomTagField();
