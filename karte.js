function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function firstLetter(name) {
  return String(name || '?').trim().charAt(0).toUpperCase() || '?';
}

function createLogoIcon(props) {
  const name = props.name || 'Kneipenchor';
  const logo = props.logo || props.logo_url || props.logoUrl || props.bild || '';
  const safeName = escapeHtml(name);
  const safeLogo = escapeHtml(logo);

  const imageHtml = safeLogo
    ? `<img src="${safeLogo}" alt="${safeName}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;" onerror="this.style.display='none';this.parentElement.querySelector('span').style.display='flex';">`
    : '';

  const fallbackHtml = `<span style="${safeLogo ? 'display:none;' : 'display:flex;'}width:100%;height:100%;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#000;">${escapeHtml(firstLetter(name))}</span>`;

  return L.divIcon({
    className: '',
    html: `
      <div title="${safeName}" style="
        width:38px;
        height:38px;
        border-radius:50%;
        overflow:hidden;
        background:#ffed00;
        border:3px solid #111;
        box-shadow:0 3px 10px rgba(0,0,0,.28);
      ">
        ${imageHtml}
        ${fallbackHtml}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -22]
  });
}

function createPopupHtml(props) {
  const safeName = escapeHtml(props.name);
  const safeBeschreibung = escapeHtml(props.beschreibung);
  const safeLeitung = escapeHtml(props.leitung);
  const safeSaenger = escapeHtml(props.saenger);
  const safeBild = escapeHtml(props.bild || props.logo || '');
  const safeLink = escapeHtml(props.link || '#');
  const safeKontakt = escapeHtml(props.kontakt || '');
  const bildHtml = safeBild ? `<img class="chor-popup-img" src="${safeBild}" alt="${safeName}">` : '';

  return `
    <div class="chor-popup">
      <div class="chor-popup-facts">
        ${bildHtml}
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
      ${props.link ? `<a class="chor-popup-btn" href="${safeLink}" target="_blank" rel="noopener noreferrer">Zur Website</a>` : ''}
      ${safeKontakt ? `<div class="chor-popup-kontakt">Kontakt: <a href="mailto:${safeKontakt}">${safeKontakt}</a></div>` : ''}
    </div>
  `;
}

function initKneipenchorMap(chorDaten) {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  if (typeof L === 'undefined') {
    mapElement.innerHTML = '<p style="padding:1rem;">Die Kartenbibliothek konnte nicht geladen werden.</p>';
    return;
  }

  if (!mapElement.style.height) {
    mapElement.style.height = '520px';
  }

  const map = L.map('map', {
    scrollWheelZoom: true
  }).setView([51, 10.5], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap-Mitwirkende'
  }).addTo(map);

  const bounds = [];

  (chorDaten.features || []).forEach((feature) => {
    const props = feature.properties || {};
    const coords = feature.geometry?.coordinates || [];

    if (!Array.isArray(coords) || coords.length < 2) return;

    const lng = Number(coords[0]);
    const lat = Number(coords[1]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const marker = L.marker([lat, lng], { icon: createLogoIcon(props) })
      .bindPopup(createPopupHtml(props), { maxWidth: 360 })
      .addTo(map);

    bounds.push([lat, lng]);
  });

  if (bounds.length > 1) {
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
  }

  setTimeout(() => map.invalidateSize(), 250);
}

document.addEventListener('DOMContentLoaded', async () => {
  const mapElement = document.getElementById('map');

  try {
    const chorDaten = await window.loadChorDaten();
    initKneipenchorMap(chorDaten);
  } catch (error) {
    console.error(error);
    if (mapElement) {
      mapElement.innerHTML = '<p style="padding:1rem;">Die Chor-Karte konnte nicht geladen werden. Bitte prüfen, ob <strong>daten-loader.js</strong> und <strong>karte.js</strong> in GitHub vorhanden sind und ob das Google Apps Script veröffentlicht ist.</p>';
    }
  }
});
