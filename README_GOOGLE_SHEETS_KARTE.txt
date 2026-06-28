Karten-Update: Google Sheets als Datenquelle
===========================================

Dieses Paket stellt die Karte so um, dass sie die freigegebenen Chöre aus dem Google Apps Script lädt:

https://script.google.com/macros/s/AKfycbzt2DTR1djboA_HP0NzpZeHj-TZB5PQmhX8FM6cJFiOyjQwsZyz8Jl-xOLqLPDJ3fCZlw/exec

Was neu ist:
- Die Karte lädt nicht mehr aus daten/choere.json.
- Es werden nur Chöre angezeigt, die in der Google-Tabelle freigegeben sind.
- lat und lng werden für die Kartenposition verwendet.
- Wenn in der Spalte logo ein Wert steht, wird dieser als kleiner runder Kartenpunkt verwendet.
- Wenn logo leer ist, wird bild verwendet.
- Wenn beides leer ist, erscheint ein gelber Punkt mit Anfangsbuchstabe.

In GitHub hochladen:
- Karte.html
- daten-loader.js
- karte.js
- liste-filter.js
- netlify.toml

Der Ordner daten/ und daten/choere.json sind in diesem Paket nur noch als alte Fallback-/Beispieldaten enthalten. Die neue Karte braucht sie nicht mehr.

Nach dem Hochladen:
1. In Netlify einen Deploy ohne Cache starten.
2. https://kneipenchor.net/karte öffnen.
3. Strg + F5 drücken.

Wenn ein Chor nicht erscheint, prüfen:
- Freigeben ist angehakt.
- lat ist ausgefüllt.
- lng ist ausgefüllt.
- Apps Script Web-App-Link zeigt JSON-Daten an.
