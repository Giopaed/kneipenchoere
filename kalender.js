const KONZERT_DATA_URL = 'https://script.google.com/macros/s/AKfycbwTlaoyp4Pdp8gneUlBpbRWr4LYyz4zv-harvI9Ki4xM1bw95hdm5uJzWjFkJ5428Nt/exec';

let alleKonzerte = [];

const monatNamen = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember'
];

document.addEventListener('DOMContentLoaded', initKalender);

async function initKalender() {
  try {
    const daten = await ladeDatenPerJsonp(KONZERT_DATA_URL);
    alleKonzerte = Array.isArray(daten) ? daten : [];
  } catch (error) {
    console.error('Konzerte konnten nicht geladen werden:', error);
    alleKonzerte = [];
  }

  alleKonzerte = alleKonzerte
    .map(normalisiereTermin)
    .filter(Boolean)
    .sort((a, b) => new Date(a.datum + 'T' + (a.uhrzeit || '00:00')) - new Date(b.datum + 'T' + (b.uhrzeit || '00:00')));

  baueFilter();
  renderKalender();

  ['filter-month', 'filter-choir', 'filter-place'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', renderKalender);
  });
}

function ladeDatenPerJsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = 'konzertKalenderCallback_' + Date.now();

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

function normalisiereTermin(t) {
  if (!t || !t.datum) return null;

  return {
    chor: t.chor || t.name || t.chorname || '',
    datum: t.datum || '',
    uhrzeit: t.uhrzeit || t.zeit || '',
    ort: t.ort || t.veranstaltungsort || t.stadt || '',
    stadt: t.stadt || '',
    titel: t.titel || t.name_des_konzerts || 'Konzert',
    link: t.link || '',
    beschreibung: t.beschreibung || ''
  };
}

function baueFilter() {
  const monthSelect = document.getElementById('filter-month');
  const choirSelect = document.getElementById('filter-choir');
  const placeSelect = document.getElementById('filter-place');

  if (!monthSelect || !choirSelect || !placeSelect) return;

  monthSelect.innerHTML = '<option value="">Monat wählen</option>';
  choirSelect.innerHTML = '<option value="">Chor wählen</option>';
  placeSelect.innerHTML = '<option value="">Ort wählen</option>';

  const months = [
    ...new Set(
      alleKonzerte
        .map(t => new Date(t.datum).getMonth())
        .filter(n => !isNaN(n))
    )
  ].sort((a, b) => a - b);

  months.forEach(m => monthSelect.appendChild(new Option(monatNamen[m], String(m))));

  const choirs = [...new Set(alleKonzerte.map(t => t.chor).filter(Boolean))].sort();
  choirs.forEach(c => choirSelect.appendChild(new Option(c, c)));

  const places = [...new Set(alleKonzerte.map(t => t.ort).filter(Boolean))].sort();
  places.forEach(p => placeSelect.appendChild(new Option(p, p)));
}

function renderKalender() {
  const list = document.getElementById('calendar-list');

  if (!list) return;

  const month = document.getElementById('filter-month')?.value || '';
  const choir = document.getElementById('filter-choir')?.value || '';
  const place = document.getElementById('filter-place')?.value || '';

  let termine = alleKonzerte;

  if (month !== '') {
    termine = termine.filter(t => String(new Date(t.datum).getMonth()) === month);
  }

  if (choir) {
    termine = termine.filter(t => t.chor === choir);
  }

  if (place) {
    termine = termine.filter(t => t.ort === place);
  }

  if (!termine.length) {
    list.innerHTML = '<p class="calendar-empty">Noch keine freigegebenen Konzerte eingetragen.</p>';
    return;
  }

  list.innerHTML = termine.map(t => {
    const datum = formatiereDatum(t.datum, t.uhrzeit);
    const titel = escapeHtml(t.titel || 'Konzert');
    const chor = escapeHtml(t.chor || 'Kneipenchor');
    const ort = escapeHtml(t.ort || 'Ort folgt');
    const beschreibung = t.beschreibung ? `<p>${escapeHtml(t.beschreibung)}</p>` : '';
    const link = t.link ? `<p><a href="${escapeAttr(t.link)}" target="_blank" rel="noopener noreferrer">Weitere Informationen</a></p>` : '';

    return `
      <article class="calendar-card">
        <h3>${chor}</h3>
        <p class="calendar-meta">${datum} — ${ort}</p>
        <p><strong>Titel:</strong> ${titel}</p>
        ${beschreibung}
        ${link}
      </article>
    `;
  }).join('');
}

function formatiereDatum(datum, uhrzeit) {
  const date = new Date(datum + 'T' + (uhrzeit || '00:00'));

  if (isNaN(date)) {
    return escapeHtml(datum || 'Datum folgt');
  }

  const datePart = date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const timePart = uhrzeit ? ` ${uhrzeit}` : '';

  return `${datePart}${timePart}`;
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[c]));
}

function escapeAttr(value) {
  return escapeHtml(value);
}
