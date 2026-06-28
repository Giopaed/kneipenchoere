// Lädt die Chor-Daten aus daten/choere.json.
// Karte und Liste verwenden dadurch dieselbe Datenquelle.
window.loadChorDaten = async function loadChorDaten() {
  if (window.chorDaten) return window.chorDaten;
  if (window._chorDatenPromise) return window._chorDatenPromise;

  const datenPfad = 'daten/choere.json';

  window._chorDatenPromise = fetch(datenPfad, { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Chor-Daten konnten nicht geladen werden: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!data || !Array.isArray(data.features)) {
        throw new Error('Chor-Daten haben nicht das erwartete Format.');
      }
      window.chorDaten = data;
      return data;
    });

  return window._chorDatenPromise;
};
