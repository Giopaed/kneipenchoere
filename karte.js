const pinImages = {
  1: 'pins/pin_01.png',
  2: 'pins/pin_02.png',
  3: 'pins/pin_03.png',
  4: 'pins/pin_04.png',
  5: 'pins/pin_05.png'
};

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function initKneipenchorMap(chorDaten) {
  const mapElement = document.getElementById('map');
  if (!mapElement || typeof L === 'undefined') return;

  const map = L.map('map').setView([51, 10.5], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap-Mitwirkende'
  }).addTo(map);

  (chorDaten.features || []).forEach((feature) => {
    const props = feature.properties || {};
    const coords = feature.geometry?.coordinates || [0, 0];

    if (!Array.isArray(coords) || coords.length < 2) return;

    const lng = Number(coords[0]);
    const lat = Number(coords[1]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const randomPinType = Math.floor(Math.random() * 5) + 1;
    const icon = L.icon({
      iconUrl: pinImages[randomPinType],
      iconSize: [40, 52],
      iconAnchor: [20, 52],
      popupAnchor: [0, -52]
    });

    const safeName = escapeHtml(props.name);
    const safeBeschreibung = escapeHtml(props.beschreibung);
    const safeLeitung = escapeHtml(props.leitung);
    const safeSaenger = escapeHtml(props.saenger);
    const safeBild = escapeHtml(props.bild);
    const safeLink = escapeHtml(props.link || '#');
    const safeKontakt = escapeHtml(props.kontakt);

    const html = `
      <div class="chor-popup">
        <div class="chor-popup-facts">
          <img class="chor-popup-img" src="${safeBild}" alt="${safeName}">
          <div class="chor-popup-text">
            <div class="chor-popup-title">${safeName}</div>
            <div class="chor-popup-desc">${safeBeschreibung}</div>
          </div>
        </div>
        <hr class="chor-popup-line">
        <div class="chor-popup-leitung">Leitung: ${safeLeitung}</div>
        <div class="chor-popup-stats">
          <div>
            <div class="label">Sänger:innen</div>
            <div class="value">${safeSaenger}</div>
          </div>
          <div>
            <div class="label">Aufnahmestopp</div>
            <div class="value">${props.aufnahmestopp ? 'Ja' : 'Nein'}</div>
          </div>
        </div>
        <a class="chor-popup-btn" href="${safeLink}" target="_blank" rel="noopener noreferrer">Zur Website</a>
        <div class="chor-popup-kontakt">Kontakt: <a href="mailto:${safeKontakt}">${safeKontakt}</a></div>
      </div>
    `;

    L.marker([lat, lng], { icon }).bindPopup(html, { maxWidth: 360 }).addTo(map);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const chorDaten = await window.loadChorDaten();
    initKneipenchorMap(chorDaten);
  } catch (error) {
    console.error(error);
    const mapElement = document.getElementById('map');
    if (mapElement) {
      mapElement.innerHTML = '<p style="padding: 1rem; color: white;">Die Chor-Karte konnte nicht geladen werden.</p>';
    }
  }
});
