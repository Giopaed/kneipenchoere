// Lädt die Chor-Daten aus daten/choere.json.
// Diese Datei sorgt dafür, dass Karte und Liste dieselben CMS-Daten verwenden.
window.loadChorDaten = async function loadChorDaten() {
  if (window.chorDaten) return window.chorDaten;
  if (window._chorDatenPromise) return window._chorDatenPromise;

  window._chorDatenPromise = fetch('daten/choere.json', { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Chor-Daten konnten nicht geladen werden: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      window.chorDaten = data;
      return data;
    });

  return window._chorDatenPromise;
};
