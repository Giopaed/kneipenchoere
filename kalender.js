(function () {
  const DATA_URL = 'daten/konzerte.json';

  const monthSelect = document.getElementById('monat-filter');
  const choirSelect = document.getElementById('chor-filter');
  const placeSelect = document.getElementById('ort-filter');
  const list = document.getElementById('konzert-liste');
  const statusBox = document.getElementById('kalender-status');

  let concerts = [];

  function normalizeConcert(item) {
    const datum = item.datum || item.date || item.termin || '';
    const uhrzeit = item.uhrzeit || item.zeit || item.time || '';
    const chor = item.chor || item.name || item.chorname || '';
    const ort = item.ort || item.stadt || item.location || '';
    const titel = item.titel || item.title || '';
    const link = item.link || item.url || '';
    const beschreibung = item.beschreibung || item.description || '';

    return { datum, uhrzeit, chor, ort, titel, link, beschreibung };
  }

  function toDate(value) {
    if (!value) return null;
    const parsed = new Date(value + 'T00:00:00');
    if (!Number.isNaN(parsed.getTime())) return parsed;

    const parts = String(value).match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (parts) return new Date(`${parts[3]}-${parts[2].padStart(2, '0')}-${parts[1].padStart(2, '0')}T00:00:00`);
    return null;
  }

  function formatDate(value) {
    const date = toDate(value);
    if (!date) return value || '';
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function getMonthKey(value) {
    const date = toDate(value);
    if (!date) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  function monthLabel(key) {
    const [year, month] = key.split('-');
    const date = new Date(`${year}-${month}-01T00:00:00`);
    return date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  }

  function uniqueSorted(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), 'de'));
  }

  function fillSelect(select, label, values, labelFn) {
    select.innerHTML = '';
    const all = document.createElement('option');
    all.value = '';
    all.textContent = label;
    select.appendChild(all);

    values.forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = labelFn ? labelFn(value) : value;
      select.appendChild(option);
    });
  }

  function setupFilters() {
    const months = uniqueSorted(concerts.map(item => getMonthKey(item.datum)));
    const choirs = uniqueSorted(concerts.map(item => item.chor));
    const places = uniqueSorted(concerts.map(item => item.ort));

    fillSelect(monthSelect, 'Monat wählen', months, monthLabel);
    fillSelect(choirSelect, 'Chor wählen', choirs);
    fillSelect(placeSelect, 'Ort wählen', places);
  }

  function render() {
    const month = monthSelect.value;
    const choir = choirSelect.value;
    const place = placeSelect.value;

    let filtered = concerts.slice();

    if (month) filtered = filtered.filter(item => getMonthKey(item.datum) === month);
    if (choir) filtered = filtered.filter(item => item.chor === choir);
    if (place) filtered = filtered.filter(item => item.ort === place);

    filtered.sort((a, b) => {
      const da = toDate(a.datum);
      const db = toDate(b.datum);
      return (da ? da.getTime() : 0) - (db ? db.getTime() : 0);
    });

    if (!filtered.length) {
      list.innerHTML = `
        <div class="calendar-empty">
          <h2>Noch keine Konzerte eingetragen</h2>
          <p>Sobald freigegebene Termine vorhanden sind, erscheinen sie hier im Kalender.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = filtered.map(item => {
      const title = item.titel ? `<div class="calendar-title">Titel: ${escapeHtml(item.titel)}</div>` : '';
      const description = item.beschreibung ? `<p>${escapeHtml(item.beschreibung)}</p>` : '';
      const link = item.link ? `<a href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">Weitere Infos</a>` : '';

      return `
        <article class="calendar-card">
          <h2>${escapeHtml(item.chor || 'Kneipenchor')}</h2>
          <p class="calendar-meta"><strong>${escapeHtml(formatDate(item.datum))}</strong>${item.uhrzeit ? ` · ${escapeHtml(item.uhrzeit)}` : ''}${item.ort ? ` · ${escapeHtml(item.ort)}` : ''}</p>
          ${title}
          ${description}
          ${link}
        </article>
      `;
    }).join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  async function init() {
    try {
      const response = await fetch(DATA_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error('Daten konnten nicht geladen werden.');
      const data = await response.json();
      concerts = Array.isArray(data) ? data.map(normalizeConcert) : [];
      setupFilters();
      render();
      statusBox.textContent = '';
    } catch (error) {
      statusBox.textContent = 'Kalenderdaten konnten nicht geladen werden.';
      list.innerHTML = '';
    }
  }

  [monthSelect, choirSelect, placeSelect].forEach(select => select.addEventListener('change', render));
  init();
})();
