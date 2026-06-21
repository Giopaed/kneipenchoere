document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('choir-list');
  const bundeslandFilter = document.getElementById('bundesland-filter');
  const genreFilter = document.getElementById('genre-filter');
  const aufnahmestoppFilter = document.getElementById('aufnahmestopp-filter');

  if (!container || !bundeslandFilter || !genreFilter || !aufnahmestoppFilter) return;

  let chorDaten;
  try {
    chorDaten = await window.loadChorDaten();
  } catch (error) {
    console.error(error);
    container.innerHTML = '<p>Die Chorliste konnte nicht geladen werden.</p>';
    return;
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function asArray(value) {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    return [value];
  }

  function renderList(features) {
    container.innerHTML = '';

    if (!features.length) {
      container.innerHTML = '<p>Keine Chöre gefunden.</p>';
      return;
    }

    features.forEach((feature) => {
      const props = feature.properties || {};
      const card = document.createElement('article');
      card.className = 'choir-card';
      const genres = asArray(props.genres).join(', ');
      const link = props.link || '#';

      card.innerHTML = `
        <img src="${escapeHtml(props.bild)}" alt="${escapeHtml(props.name)}" class="choir-image" />
        <div class="choir-info">
          <h3 class="choir-name">${escapeHtml(props.name)}</h3>
          <p class="choir-description">${escapeHtml(props.beschreibung)}</p>
          <div class="conductor-info">
            <span class="label">Chorleitung:</span>
            <span class="conductor-name">${escapeHtml(props.leitung)}</span>
          </div>
          <div class="conductor-info">
            <span class="label">Genre:</span>
            <span class="conductor-name">${escapeHtml(genres)}</span>
          </div>
        </div>
        <div class="choir-details">
          <div class="stats">
            <div class="stat-item">
              <span class="stat-label">Aktive Sänger:innen:</span>
              <span class="stat-value">${escapeHtml(props.saenger)}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Aufnahmestopp:</span>
              <span class="stat-value">${props.aufnahmestopp ? 'ja' : 'nein'}</span>
            </div>
          </div>
          <a href="${escapeHtml(link)}" class="choir-website" target="_blank" rel="noopener noreferrer">${escapeHtml(link)}</a>
          <div class="contact-info">
            <p class="contact-text">
              Kontakt:<br>
              <strong>${escapeHtml(props.kontakt)}</strong>
            </p>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function applyFilters() {
    const bundesland = bundeslandFilter.value;
    const genre = genreFilter.value;
    const ohneAufnahmestopp = aufnahmestoppFilter.checked;

    const filtered = (chorDaten.features || []).filter((feature) => {
      const props = feature.properties || {};
      const genres = asArray(props.genres);
      const matchBundesland = !bundesland || props.bundesland === bundesland;
      const matchGenre = !genre || genres.includes(genre);
      const matchAufnahmestopp = !ohneAufnahmestopp || props.aufnahmestopp === false;
      return matchBundesland && matchGenre && matchAufnahmestopp;
    });

    renderList(filtered);
  }

  function populateFilters() {
    const bundeslaender = new Set();
    const genres = new Set();

    (chorDaten.features || []).forEach((feature) => {
      const props = feature.properties || {};
      if (props.bundesland) bundeslaender.add(props.bundesland);
      asArray(props.genres).forEach((g) => genres.add(g));
    });

    [...bundeslaender].sort().forEach((bl) => {
      const option = document.createElement('option');
      option.value = bl;
      option.textContent = bl;
      bundeslandFilter.appendChild(option);
    });

    [...genres].sort().forEach((g) => {
      const option = document.createElement('option');
      option.value = g;
      option.textContent = g;
      genreFilter.appendChild(option);
    });
  }

  bundeslandFilter.addEventListener('change', applyFilters);
  genreFilter.addEventListener('change', applyFilters);
  aufnahmestoppFilter.addEventListener('change', applyFilters);

  populateFilters();
  renderList(chorDaten.features || []);
});
