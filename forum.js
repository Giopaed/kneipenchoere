(() => {
  const topicsEl = document.getElementById('forum-topics');
  const searchEl = document.getElementById('forum-search');
  const categoryEl = document.getElementById('forum-category-filter');
  const statusEl = document.getElementById('forum-status-filter');
  const referenceEl = document.getElementById('forum-reference');

  let topics = [];

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return escapeHtml(value);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function slug(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function getStatusLabel(status) {
    if (status === 'gelöst') return 'Gelöst';
    if (status === 'info') return 'Info';
    return 'Offen';
  }

  function getSearchText(topic) {
    return [
      topic.titel,
      topic.kategorie,
      topic.autor,
      topic.chor,
      topic.ort,
      topic.kurztext,
      topic.text,
      ...(topic.tags || []),
      ...(topic.antworten || []).map((reply) => `${reply.autor} ${reply.text}`)
    ].join(' ').toLowerCase();
  }

  function renderCategories() {
    const categories = [...new Set(topics.map((topic) => topic.kategorie).filter(Boolean))].sort();
    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryEl.appendChild(option);
    });
  }

  function filterTopics() {
    const query = searchEl.value.trim().toLowerCase();
    const category = categoryEl.value;
    const status = statusEl.value;

    return topics.filter((topic) => {
      const matchesQuery = !query || getSearchText(topic).includes(query);
      const matchesCategory = !category || topic.kategorie === category;
      const matchesStatus = !status || (topic.status || 'offen') === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }

  function renderReplies(replies = []) {
    if (!replies.length) {
      return '<p class="forum-no-replies">Noch keine veröffentlichten Antworten.</p>';
    }

    return `
      <div class="forum-replies">
        <h4>Antworten</h4>
        ${replies.map((reply) => `
          <article class="forum-reply">
            <div class="forum-reply-meta">
              <strong>${escapeHtml(reply.autor || 'Anonym')}</strong>
              ${reply.chor ? `<span>${escapeHtml(reply.chor)}</span>` : ''}
              ${reply.datum ? `<time datetime="${escapeHtml(reply.datum)}">${formatDate(reply.datum)}</time>` : ''}
            </div>
            <p>${escapeHtml(reply.text || '').replace(/\n/g, '<br>')}</p>
          </article>
        `).join('')}
      </div>
    `;
  }

  function renderTopic(topic) {
    const status = topic.status || 'offen';
    const tags = topic.tags || [];
    const topicId = topic.id || slug(topic.titel);
    const publicContact = topic.kontakt_oeffentlich && topic.kontakt;

    return `
      <article class="forum-topic-card" id="topic-${escapeHtml(topicId)}">
        <div class="forum-topic-meta">
          <span class="forum-pill">${escapeHtml(topic.kategorie || 'Allgemein')}</span>
          <span class="forum-status forum-status-${escapeHtml(status)}">${getStatusLabel(status)}</span>
          ${topic.datum ? `<time datetime="${escapeHtml(topic.datum)}">${formatDate(topic.datum)}</time>` : ''}
        </div>

        <h3>${escapeHtml(topic.titel || 'Ohne Titel')}</h3>

        <p class="forum-topic-summary">${escapeHtml(topic.kurztext || '').replace(/\n/g, '<br>')}</p>

        <details class="forum-topic-details">
          <summary>Beitrag lesen</summary>
          <div class="forum-topic-body">
            <p>${escapeHtml(topic.text || topic.kurztext || '').replace(/\n/g, '<br>')}</p>
            ${renderReplies(topic.antworten)}
          </div>
        </details>

        <div class="forum-topic-footer">
          <div class="forum-author">
            <strong>${escapeHtml(topic.autor || 'Kneipenchor')}</strong>
            ${topic.chor ? `<span>${escapeHtml(topic.chor)}</span>` : ''}
            ${topic.ort ? `<span>${escapeHtml(topic.ort)}</span>` : ''}
          </div>
          <div class="forum-topic-actions">
            ${publicContact ? `<a class="forum-small-button" href="mailto:${escapeHtml(topic.kontakt)}?subject=${encodeURIComponent(`Antwort auf Forumsbeitrag: ${topic.titel || ''}`)}">Direkt antworten</a>` : ''}
            <a class="forum-small-button forum-reply-button" href="#neuer-beitrag" data-topic-title="${escapeHtml(topic.titel || '')}">Antwort vorschlagen</a>
          </div>
        </div>

        ${tags.length ? `<div class="forum-tags">${tags.map((tag) => `<span>#${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
      </article>
    `;
  }

  function render() {
    const filteredTopics = filterTopics();

    if (!filteredTopics.length) {
      topicsEl.innerHTML = '<p class="forum-empty">Keine passenden Beiträge gefunden.</p>';
      return;
    }

    topicsEl.innerHTML = filteredTopics.map(renderTopic).join('');
  }

  function bindReplyButtons() {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('.forum-reply-button');
      if (!button || !referenceEl) return;
      const title = button.getAttribute('data-topic-title') || '';
      referenceEl.value = title;
      setTimeout(() => referenceEl.focus(), 100);
    });
  }

  async function loadTopics() {
    try {
      const response = await fetch('daten/forum.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      topics = (data.themen || [])
        .filter((topic) => topic.veroeffentlicht !== false)
        .sort((a, b) => String(b.datum || '').localeCompare(String(a.datum || '')));
      renderCategories();
      render();
    } catch (error) {
      topicsEl.innerHTML = `
        <p class="forum-empty">
          Die Forum-Beiträge konnten gerade nicht geladen werden. Bitte später erneut versuchen oder an
          <a href="mailto:kontakt@kneipenchor.net">kontakt@kneipenchor.net</a> schreiben.
        </p>
      `;
      console.error('Forum konnte nicht geladen werden:', error);
    }
  }

  [searchEl, categoryEl, statusEl].forEach((element) => {
    if (element) element.addEventListener('input', render);
  });

  bindReplyButtons();
  loadTopics();
})();
