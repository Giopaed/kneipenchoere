const MAP_DATA_URL = 'https://script.google.com/macros/s/AKfycbzt2DTR1djboA_HP0NzpZeHj-TZB5PQmhX8FM6cJFiOyjQwsZyz8Jl-xOLqLPDJ3fCZlw/exec';

mapboxgl.accessToken = 'pk.eyJ1IjoidmllcnZpZXJ0ZWwiLCJhIjoiY21hbnN4c3V5MDJkeDJrczl1ZjIxaGIzMyJ9.7GPJr4HzvulQJmMXY72CEA';

const pinImages = [
  'pins/pin_01.png',
  'pins/pin_02.png',
  'pins/pin_03.png',
  'pins/pin_04.png',
  'pins/pin_05.png'
];

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [10.5, 51],
  zoom: 5
});

let chorDaten = { type: 'FeatureCollection', features: [] };
window.chorDaten = chorDaten;
window.kneipenchorMap = map;

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

function holeWert(obj, keys) {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      return obj[key];
    }
  }
  return '';
}

function normalisiereDaten(rohdaten) {
  return {
    type: 'FeatureCollection',
    features: (Array.isArray(rohdaten) ? rohdaten : [])
      .map((eintrag) => {
        const lat = parseFloat(String(holeWert(eintrag, ['lat', 'Lat', 'latitude', 'Latitude', 'Breitengrad'])).replace(',', '.'));
        const lng = parseFloat(String(holeWert(eintrag, ['lng', 'Lng', 'lon', 'Lon', 'longitude', 'Longitude', 'Längengrad'])).replace(',', '.'));

        if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

        const genres = parseGenres(holeWert(eintrag, ['genres', 'Genres', 'Genre']));

        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          properties: {
            name: holeWert(eintrag, ['name', 'Name des Chors', 'Name des Chores', 'Chorname', 'Chor']),
            stadt: holeWert(eintrag, ['stadt', 'Stadt', 'Ort']),
            bundesland: holeWert(eintrag, ['bundesland', 'Bundesland']),
            beschreibung: holeWert(eintrag, ['beschreibung', 'Beschreibung']),
            leitung: holeWert(eintrag, ['leitung', 'Leitung']),
            saenger: holeWert(eintrag, ['saenger', 'Sänger*innenanzahl', 'Sänger', 'Saenger']),
            genres,
            aufnahmestopp: parseBoolean(holeWert(eintrag, ['aufnahmestopp', 'Aufnahmestopp'])),
            bild: holeWert(eintrag, ['bild', 'Bild', 'Foto hochladen', 'Foto', 'Logo']),
            link: holeWert(eintrag, ['link', 'Link zur Homepage', 'Link', 'Website']),
            kontakt: holeWert(eintrag, ['kontakt', 'Kontakt', 'E-Mail-Adresse', 'Email', 'E-Mail']),
            logo: holeWert(eintrag, ['logo', 'Logo'])
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

function markerBild(index) {
  return pinImages[index % pinImages.length];
}

function popupHtml(props) {
  const bildHtml = props.bild
    ? `<img class="chor-popup-img" src="${escapeHtml(props.bild)}" alt="${escapeHtml(props.name)}">`
    : '';

  const websiteHtml = props.link
    ? `<a class="chor-popup-btn" href="${escapeHtml(props.link)}" target="_blank" rel="noopener noreferrer">Zur Website</a>`
    : '';

  const kontaktHtml = props.kontakt
    ? `<div class="chor-popup-kontakt">E-Mail-Adresse: <a href="mailto:${escapeHtml(props.kontakt)}">${escapeHtml(props.kontakt)}</a></div>`
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
      ${kontaktHtml}
    </div>
  `;
}

function zeichneMarker(features) {
  features.forEach((feature, index) => {
    const coords = feature.geometry.coordinates;
    const props = feature.properties;

    const el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = `url(${markerBild(index)})`;
    el.style.width = '40px';
    el.style.height = '52px';
    el.style.backgroundSize = '100%';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.cursor = 'pointer';

    const popup = new mapboxgl.Popup({ maxWidth: '360px' }).setHTML(popupHtml(props));

    new mapboxgl.Marker(el)
      .setLngLat(coords)
      .setPopup(popup)
      .addTo(map);
  });

  if (features.length > 0) {
    const bounds = new mapboxgl.LngLatBounds();
    features.forEach((feature) => bounds.extend(feature.geometry.coordinates));
    map.fitBounds(bounds, { padding: 60, maxZoom: 7 });
  }
}

async function ladeKneipenchorDaten() {
  try {
    const response = await fetch(MAP_DATA_URL, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }

    const rohdaten = await response.json();
    chorDaten = normalisiereDaten(rohdaten);
    window.chorDaten = chorDaten;

    map.on('load', () => {
      zeichneMarker(chorDaten.features);
      document.dispatchEvent(new CustomEvent('chorDatenGeladen', { detail: chorDaten }));
    });

    if (map.loaded()) {
      zeichneMarker(chorDaten.features);
      document.dispatchEvent(new CustomEvent('chorDatenGeladen', { detail: chorDaten }));
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
