document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('choir-list');
  const bundeslandFilter = document.getElementById('bundesland-filter');
  const genreFilter = document.getElementById('genre-filter');
  const aufnahmestoppFilter = document.getElementById('aufnahmestopp-filter');

  if (!container || !bundeslandFilter || !genreFilter || !aufnahmestoppFilter) return;

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function linkMitKleinemHttps(url) {
    const text = String(url || '').trim();
    if (!text) return '';

    const sichererHref = /^https?:\/\//i.test(text) ? text : `https://${text}`;
    const anzeige = text.replace(/^https?:\/\//i, '');
    const protokoll = text.match(/^https?:\/\//i)?.[0] || 'https://';

    return `
      <a href="${escapeHtml(sichererHref)}" class="choir-website" target="_blank" rel="noopener noreferrer">
        <span class="choir-link-protocol">${escapeHtml(protokoll)}</span>${escapeHtml(anzeige)}
      </a>
    `;
  }

  function istBildLink(url) {
    const text = String(url || '').trim();
    if (!text) return false;

    return (
      /\.(png|jpe?g|gif|webp|svg)(\?|#|$)/i.test(text) ||
      /drive\.google\.com\/thumbnail/i.test(text) ||
      /googleusercontent\.com/i.test(text) ||
      /wp-content\/uploads/i.test(text)
    );
  }

  function bildHtml(props) {
    const bildQuelle = props.logo || props.bild || '';

    if (istBildLink(bildQuelle)) {
      return `
        <div class="choir-logo-area">
          <img src="${escapeHtml(bildQuelle)}" alt="Logo ${escapeHtml(props.name || '')}" class="choir-logo" loading="lazy" />
        </div>
      `;
    }

    return `
      <div class="choir-logo-area">
        <div class="choir-logo-placeholder">${escapeHtml(props.name || 'Kneipenchor')}</div>
      </div>
    `;
  }

  function renderList(features) {
    container.innerHTML = '';

    if (!features.length) {
      container.innerHTML = '<p>Keine freigegebenen Chöre gefunden.</p>';
      return;
    }

    features.forEach((feature) => {
      const props = feature.properties || {};
      const genresText = Array.isArray(props.genres) ? props.genres.join(', ') : (props.genres || '');
      const websiteHtml = linkMitKleinemHttps(props.link);

      const card = document.createElement('article');
      card.className = 'choir-card';
      card.innerHTML = `
        <div class="choir-info">
          <h3 class="choir-name">${escapeHtml(props.name || '')}</h3>
          <p class="choir-description">${escapeHtml(props.beschreibung || '')}</p>
          <p><strong>Stadt:</strong> ${escapeHtml(props.stadt || '')}</p>
          <p><strong>Bundesland:</strong> ${escapeHtml(props.bundesland || '')}</p>
          <div class="conductor-info">
            <span class="label">Chorleitung:</span>
            <span class="conductor-name">${escapeHtml(props.leitung || '')}</span>
          </div>
        </div>

        <div class="choir-details">
          <div class="stats">
            <div class="stat-item">
              <span class="stat-label">Sänger*innenanzahl:</span>
              <span class="stat-value">${escapeHtml(props.saenger || '')}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Genre:</span>
              <span class="stat-value">${escapeHtml(genresText)}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Aufnahmestopp:</span>
              <span class="stat-value">${props.aufnahmestopp ? 'ja' : 'nein'}</span>
            </div>
          </div>
          ${websiteHtml}
        </div>

        ${bildHtml(props)}
      `;
      container.appendChild(card);
    });
  }

  function aktuelleFeatures() {
    return (window.chorDaten && Array.isArray(window.chorDaten.features)) ? window.chorDaten.features : [];
  }

  function applyFilters() {
    const alleFeatures = aktuelleFeatures();
    const bundesland = bundeslandFilter.value;
    const genre = genreFilter.value;
    const ohneAufnahmestopp = aufnahmestoppFilter.checked;

    const filtered = alleFeatures.filter((feature) => {
      const props = feature.properties || {};
      const matchBundesland = !bundesland || props.bundesland === bundesland;
      const matchGenre = !genre || (Array.isArray(props.genres) ? props.genres.includes(genre) : props.genres === genre);
      const matchAufnahmestopp = !ohneAufnahmestopp || props.aufnahmestopp === false;
      return matchBundesland && matchGenre && matchAufnahmestopp;
    });

    renderList(filtered);
  }

  function populateFilters() {
    const alleFeatures = aktuelleFeatures();
    const bundeslaender = new Set();
    const genres = new Set();

    alleFeatures.forEach((feature) => {
      const props = feature.properties || {};
      if (props.bundesland) bundeslaender.add(props.bundesland);

      const featureGenres = Array.isArray(props.genres) ? props.genres : (props.genres ? [props.genres] : []);
      featureGenres.forEach((eintrag) => genres.add(eintrag));
    });

    bundeslandFilter.innerHTML = '<option value="">Bundesland wählen</option>';
    genreFilter.innerHTML = '<option value="">Genre wählen</option>';

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

  document.addEventListener('chorDatenGeladen', () => {
    populateFilters();
    applyFilters();
  });
});
