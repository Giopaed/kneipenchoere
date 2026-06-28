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

  function renderList(features) {
    container.innerHTML = '';

    if (!features.length) {
      container.innerHTML = '<p>Keine Chöre gefunden.</p>';
      return;
    }

    features.forEach((feature) => {
      const props = feature.properties || {};
      const image = props.logo || props.logo_url || props.logoUrl || props.bild || '';
      const card = document.createElement('article');
      card.className = 'choir-card';
      card.innerHTML = `
        ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(props.name)}" class="choir-image" />` : ''}
        <div class="choir-info">
          <h3 class="choir-name">${escapeHtml(props.name)}</h3>
          <p class="choir-description">${escapeHtml(props.beschreibung)}</p>
          <div class="conductor-info">
            <span class="label">Chorleitung:</span>
            <span class="conductor-name">${escapeHtml(props.leitung)}</span>
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
          ${props.link ? `<a href="${escapeHtml(props.link)}" class="choir-website" target="_blank" rel="noopener noreferrer">Website öffnen</a>` : ''}
          ${props.kontakt ? `<div class="contact-info"><p class="contact-text">Kontakt:<br><strong>${escapeHtml(props.kontakt)}</strong></p></div>` : ''}
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
      const genres = Array.isArray(props.genres) ? props.genres : [props.genres].filter(Boolean);
      return (!bundesland || props.bundesland === bundesland)
        && (!genre || genres.includes(genre))
        && (!ohneAufnahmestopp || props.aufnahmestopp === false);
    });

    renderList(filtered);
  }

  function populateFilters() {
    const bundeslaender = new Set();
    const genres = new Set();

    (chorDaten.features || []).forEach((feature) => {
      const props = feature.properties || {};
      if (props.bundesland) bundeslaender.add(props.bundesland);
      const genreValues = Array.isArray(props.genres) ? props.genres : [props.genres].filter(Boolean);
      genreValues.forEach((g) => genres.add(g));
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
