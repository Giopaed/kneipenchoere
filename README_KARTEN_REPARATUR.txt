Karten-Reparatur für kneipenchor.net

Was wurde gemacht?
- Karte.html nutzt wieder Leaflet/OpenStreetMap.
- karte.js lädt die Chordaten und zeigt Marker auf der Karte.
- Die Marker zeigen jetzt kleine runde Chor-Logos.
- Falls ein Chor kein eigenes Logo-Feld hat, wird automatisch das Feld "bild" genutzt.
- daten-loader.js lädt daten/choere.json.
- liste-filter.js lädt dieselben Daten für die Chorliste und Filter.
- netlify.toml leitet /karte sauber auf Karte.html.

Wichtig für zukünftige Logos:
In daten/choere.json kann jeder Chor optional ein Feld "logo" bekommen, z. B.:
"logo": "bilder/uploads/mein-chor-logo.png"

Wenn kein "logo" vorhanden ist, verwendet die Karte automatisch "bild".

Hochladen:
1. Alle Dateien und Ordner aus diesem Paket in GitHub hochladen.
2. Vorhandene Dateien ersetzen.
3. Commit message: Karte repariert und Logo-Punkte ergänzt
4. In Netlify: Deploys -> Trigger deploy -> Deploy project without cache
5. Danach https://kneipenchor.net/karte öffnen und Strg+F5 drücken.
