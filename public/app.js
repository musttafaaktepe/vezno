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
const categorySelect = document.getElementById('category');
const customTagField = document.getElementById('custom-tag-field');
const customTagInput = document.getElementById('customTag');
const placeInput = document.getElementById('place');
const geocodeBtn = document.getElementById('geocode-btn');
const geocodeResults = document.getElementById('geocode-results');
const statusEl = document.getElementById('status');
const resultsHeader = document.getElementById('results-header');
const resultsList = document.getElementById('results-list');

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

categorySelect.addEventListener('change', () => {
  customTagField.hidden = categorySelect.value !== 'custom';
});

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

  resultsHeader.textContent = `${results.length} isletme bulundu`;
  resultsList.innerHTML = '';

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

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    setStatus('Lutfen gecerli enlem/boylam girin.', true);
    return;
  }

  const params = new URLSearchParams({ lat, lon, radius, category });
  if (category === 'custom') params.set('customTag', customTag);

  setStatus('Isletmeler taraniyor...');
  resultsList.innerHTML = '';
  resultsHeader.textContent = '';

  try {
    const res = await fetch(`/api/search?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Hata olustu');

    renderResults(lat, lon, radius, data.results);
    setStatus(`Tamamlandi: ${data.count} sonuc.`);
  } catch (err) {
    setStatus(err.message, true);
  }
});

loadCategories();
