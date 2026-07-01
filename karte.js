const MAP_DATA_URL = 'https://script.google.com/macros/s/AKfycbzt2DTR1djboA_HP0NzpZeHj-TZB5PQmhX8FM6cJFiOyjQwsZyz8Jl-xOLqLPDJ3fCZlw/exec';

mapboxgl.accessToken = 'pk.' + 'eyJ1IjoidmllcnZpZXJ0ZWwiLCJhIjoiY21hbnN4c3V5MDJkeDJrczl1ZjIxaGIzMyJ9.7GPJr4HzvulQJmMXY72CEA';

const pinImages = [
  'pins/pin_01.png',
  'pins/pin_02.png',
  'pins/pin_03.png',
  'pins/pin_04.png',
  'pins/pin_05.png'
];

let chorDaten = { type: 'FeatureCollection', features: [] };
window.chorDaten = chorDaten;

const markerListe = [];

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [10.5, 51],
  zoom: 5
});

window.kneipenchorMap = map;

function holeWert(obj, keys) {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      return obj[key];
    }
  }
  return '';
}

function parseBoolean(value) {
  if (value === true) return true;
  const normalisiert = String(value || '').trim().toLowerCase();
  return ['ja', 'true', '1', 'yes'].includes(normalisiert);
}

function parseGenres(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value)
    .split(',')
    .map((eintrag) => eintrag.trim())
    .filter(Boolean);
}

function hashText(value) {
  let hash = 0;
  const text = String(value || '');
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function normalisiereDaten(rohdaten) {
  return {
    type: 'FeatureCollection',
    features: (Array.isArray(rohdaten) ? rohdaten : [])
      .map((eintrag) => {
        const lat = parseFloat(String(holeWert(eintrag, [
          'lat', 'Lat', 'Latitude', 'latitude', 'Breitengrad'
        ])).replace(',', '.'));

        const lng = parseFloat(String(holeWert(eintrag, [
          'lng', 'Lng', 'lon', 'Lon', 'Longitude', 'longitude', 'Längengrad', 'Laengengrad'
        ])).replace(',', '.'));

        if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

        const bild = holeWert(eintrag, [
          'logo', 'Logo',
          'bild', 'Bild',
          'Foto hochladen', 'Foto', 'Chorbild'
        ]);

        const genres = parseGenres(holeWert(eintrag, [
          'genres', 'Genres', 'Genre', 'Musikrichtung'
        ]));

        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          properties: {
            name: holeWert(eintrag, ['name', 'Name', 'Name des Chores', 'Name des Chors', 'Chorname', 'Chor']),
            stadt: holeWert(eintrag, ['stadt', 'Stadt', 'Ort']),
            bundesland: holeWert(eintrag, ['bundesland', 'Bundesland']),
            beschreibung: holeWert(eintrag, ['beschreibung', 'Beschreibung']),
            leitung: holeWert(eintrag, ['leitung', 'Leitung', 'Chorleitung']),
            saenger: holeWert(eintrag, ['saenger', 'Sänger*innenanzahl', 'Sänger', 'Saenger']),
            genres,
            aufnahmestopp: parseBoolean(holeWert(eintrag, ['aufnahmestopp', 'Aufnahmestopp'])),
            bild: bild,
            logo: bild,
            link: holeWert(eintrag, ['link', 'Link', 'Link zur Homepage', 'Website', 'Homepage'])
          }
        };
      })
      .filter(Boolean)
  };
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function pinIndexFuerChor(props, index) {
  const basis = props.name || `${props.stadt || ''}-${index}`;
  return hashText(basis) % pinImages.length;
}

function markerFallbackSvg(pinIndex) {
  const faces = [
    '<circle cx="27" cy="26" r="12" fill="#fff" stroke="#111" stroke-width="2"/><path d="M19 23q3-4 6 0M29 23q3-4 6 0" stroke="#111" stroke-width="2" fill="none"/><ellipse cx="27" cy="32" rx="5" ry="7" fill="#111"/>',
    '<circle cx="27" cy="26" r="12" fill="#fff" stroke="#111" stroke-width="2"/><circle cx="22" cy="23" r="2" fill="#111"/><circle cx="32" cy="23" r="2" fill="#111"/><ellipse cx="27" cy="32" rx="6" ry="5" fill="#111"/>',
    '<circle cx="27" cy="26" r="12" fill="#fff" stroke="#111" stroke-width="2"/><path d="M19 18q8-8 16 0" stroke="#111" stroke-width="3" fill="none"/><circle cx="22" cy="24" r="2" fill="#111"/><circle cx="32" cy="24" r="2" fill="#111"/><ellipse cx="27" cy="32" rx="4" ry="7" fill="#111"/>',
    '<circle cx="27" cy="26" r="12" fill="#fff" stroke="#111" stroke-width="2"/><circle cx="22" cy="22" r="4" fill="none" stroke="#111" stroke-width="2"/><circle cx="32" cy="22" r="4" fill="none" stroke="#111" stroke-width="2"/><path d="M26 22h2" stroke="#111" stroke-width="2"/><ellipse cx="27" cy="32" rx="5" ry="6" fill="#111"/>',
    '<circle cx="27" cy="26" r="12" fill="#fff" stroke="#111" stroke-width="2"/><path d="M17 19q6-8 20 0" stroke="#111" stroke-width="3" fill="none"/><path d="M21 25q2-3 4 0M29 25q2-3 4 0" stroke="#111" stroke-width="2" fill="none"/><ellipse cx="27" cy="33" rx="5" ry="6" fill="#111"/>'
  ];

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="54" height="70" viewBox="0 0 54 70">
    <path d="M27 2C14 2 3 13 3 26c0 18 24 42 24 42s24-24 24-42C51 13 40 2 27 2z" fill="#ffed00" stroke="#000" stroke-width="2"/>
    ${faces[pinIndex % faces.length]}
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function popupHtml(props) {
  const bildQuelle = props.logo || props.bild || '';
  const bildHtml = bildQuelle
    ? `<img class="chor-popup-img" src="${escapeHtml(bildQuelle)}" alt="${escapeHtml(props.name)}">`
    : '';

  const websiteHtml = props.link
    ? `<a class="chor-popup-btn" href="${escapeHtml(props.link)}" target="_blank" rel="noopener noreferrer">Zur Website</a>`
    : '';

  return `
    <div class="chor-popup">
      <div class="chor-popup-facts">
        ${bildHtml}
        <div class="chor-popup-text">
          <div class="chor-popup-title">${escapeHtml(props.name)}</div>
          <div class="chor-popup-desc">${escapeHtml(props.beschreibung)}</div>
        </div>
      </div>
      <hr class="chor-popup-line">
      <div class="chor-popup-leitung">Leitung: ${escapeHtml(props.leitung)}</div>
      <div class="chor-popup-stats">
        <div>
          <div class="label">Sänger*innenanzahl</div>
          <div class="value">${escapeHtml(props.saenger)}</div>
        </div>
        <div>
          <div class="label">Aufnahmestopp</div>
          <div class="value">${props.aufnahmestopp ? 'Ja' : 'Nein'}</div>
        </div>
      </div>
      ${websiteHtml}
    </div>
  `;
}

function entferneMarker() {
  markerListe.forEach((marker) => marker.remove());
  markerListe.length = 0;
}

function zeichneMarker(features) {
  entferneMarker();

  features.forEach((feature, index) => {
    const coords = feature.geometry.coordinates;
    const props = feature.properties;

    const pinIndex = pinIndexFuerChor(props, index);
    const pinPfad = pinImages[pinIndex];

    const el = document.createElement('div');
    el.className = 'marker';
    el.style.width = '46px';
    el.style.height = '60px';
    el.style.cursor = 'pointer';
    el.style.backgroundSize = 'contain';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.backgroundPosition = 'center';
    el.style.backgroundImage = `url(${pinPfad})`;

    const testImg = new Image();
    testImg.onerror = () => {
      el.style.backgroundImage = `url(${markerFallbackSvg(pinIndex)})`;
    };
    testImg.src = pinPfad;

    const popup = new mapboxgl.Popup({ maxWidth: '360px' }).setHTML(popupHtml(props));

    const marker = new mapboxgl.Marker(el)
      .setLngLat(coords)
      .setPopup(popup)
      .addTo(map);

    markerListe.push(marker);
  });

  if (features.length > 0) {
    const bounds = new mapboxgl.LngLatBounds();
    features.forEach((feature) => bounds.extend(feature.geometry.coordinates));
    map.fitBounds(bounds, { padding: 60, maxZoom: 7 });
  }
}

function ladeDatenPerJsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = 'kneipenchorCallback_' + Date.now();

    window[callbackName] = (daten) => {
      delete window[callbackName];
      script.remove();
      resolve(daten);
    };

    const script = document.createElement('script');
    script.src = `${url}?callback=${callbackName}&_=${Date.now()}`;
    script.onerror = () => {
      delete window[callbackName];
      script.remove();
      reject(new Error('JSONP konnte nicht geladen werden.'));
    };

    document.body.appendChild(script);
  });
}

async function ladeKneipenchorDaten() {
  try {
    const rohdaten = await ladeDatenPerJsonp(MAP_DATA_URL);
    chorDaten = normalisiereDaten(rohdaten);
    window.chorDaten = chorDaten;

    const starteAnzeige = () => {
      zeichneMarker(chorDaten.features);
      document.dispatchEvent(new CustomEvent('chorDatenGeladen', { detail: chorDaten }));
    };

    if (map.loaded()) {
      starteAnzeige();
    } else {
      map.once('load', starteAnzeige);
    }
  } catch (error) {
    console.error('Fehler beim Laden der Chordaten:', error);
    const list = document.getElementById('choir-list');
    if (list) {
      list.innerHTML = '<p>Die Chordaten konnten leider nicht geladen werden.</p>';
    }
  }
}

ladeKneipenchorDaten();
