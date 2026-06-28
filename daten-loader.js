// Lädt freigegebene Chor-Daten direkt aus Google Apps Script.
// Quelle: Google-Tabelle „Formularantworten 1“ über doGet().
// Wichtig: Das Apps Script gibt nur öffentliche Felder aus, keine E-Mail-Adressen oder internen Notizen.

const KNEIPENCHOR_DATEN_URL = 'https://script.google.com/macros/s/AKfycbzt2DTR1djboA_HP0NzpZeHj-TZB5PQmhX8FM6cJFiOyjQwsZyz8Jl-xOLqLPDJ3fCZlw/exec';

function parseBool(value) {
  const text = String(value ?? '').trim().toLowerCase();
  return text === 'true' || text === 'ja' || text === 'yes' || text === '1';
}

function parseGenres(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value ?? '')
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeChorDaten(data) {
  // Falls irgendwann wieder GeoJSON geliefert wird, direkt akzeptieren.
  if (data && data.type === 'FeatureCollection' && Array.isArray(data.features)) {
    return data;
  }

  const eintraege = Array.isArray(data) ? data : [];

  return {
    type: 'FeatureCollection',
    features: eintraege.map((chor) => {
      const lat = Number(chor.lat);
      const lng = Number(chor.lng);

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        properties: {
          name: chor.name || '',
          stadt: chor.stadt || '',
          bundesland: chor.bundesland || '',
          beschreibung: chor.beschreibung || '',
          leitung: chor.leitung || '',
          saenger: chor.saenger || '',
          genres: parseGenres(chor.genres),
          aufnahmestopp: parseBool(chor.aufnahmestopp),
          bild: chor.bild || '',
          logo: chor.logo || '',
          link: chor.link || '',
          kontakt: chor.kontakt || ''
        }
      };
    }).filter((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      return Number.isFinite(lat) && Number.isFinite(lng);
    })
  };
}

function loadJsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = 'kneipenchorDatenCallback_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const separator = url.includes('?') ? '&' : '?';
    const script = document.createElement('script');

    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error('Zeitüberschreitung beim Laden der Chor-Daten.'));
    }, 15000);

    function cleanup() {
      window.clearTimeout(timeout);
      delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[callbackName] = (data) => {
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error('Chor-Daten konnten nicht geladen werden.'));
    };

    script.src = `${url}${separator}callback=${encodeURIComponent(callbackName)}&v=${Date.now()}`;
    document.head.appendChild(script);
  });
}

window.loadChorDaten = async function loadChorDaten() {
  if (window.chorDaten) return window.chorDaten;
  if (window._chorDatenPromise) return window._chorDatenPromise;

  window._chorDatenPromise = loadJsonp(KNEIPENCHOR_DATEN_URL)
    .then((data) => {
      const normalized = normalizeChorDaten(data);
      window.chorDaten = normalized;
      return normalized;
    });

  return window._chorDatenPromise;
};
