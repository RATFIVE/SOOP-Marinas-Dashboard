# Dashboard — Lokale Entwicklungsanleitung

Kurz: Dieses Repository ist eine Next.js (App‑Directory) Demo mit Leaflet‑Karte, Recharts‑AreaCharts und Tailwind‑Styling.

## Voraussetzungen
- Node.js ≥ 18 (empfohlen via nvm)
- Git
- pnpm oder npm (pnpm empfohlen, falls `pnpm-lock.yaml` vorhanden)

## Repository klonen

Ersetze `<REPO_URL>` durch die URL des GitHub‑Repos (z. B. `git@github.com:owner/repo.git`):

```bash
git clone <REPO_URL>
cd dashboard
```

## Installieren

Prüfe, ob `pnpm-lock.yaml` vorhanden ist. Wenn ja, verwende `pnpm`; sonst kannst du `npm` verwenden.

pnpm (empfohlen):
```bash
pnpm install
```

npm:
```bash
npm install
```

Falls du `nvm` benutzt und Node nicht installiert ist:
```bash
nvm install --lts
nvm use --lts
```

## Dev Server starten

Standard (Port 3000):

```bash
# pnpm
pnpm dev

# npm
npm run dev
```

Im Browser: http://localhost:3000

Wenn der Port belegt ist, kannst du einen anderen Port setzen:
```bash
PORT=3001 npm run dev
```

## Wichtige Hinweise zum Projekt
- Daten: Stationsdaten liegen in `data/station.json`. Diese Datei wird zur Laufzeit gelesen.
- Leaflet: Die Karte ist client‑only (dynamischer Import). Marker verwenden inline SVG‑Icons, damit Bundling/HMR stabil läuft.
- Theme: Standardmäßig wird die App im Dark‑Mode gerendert (siehe `app/layout.tsx` → `defaultTheme="dark"` und `html` hat die `dark` Klasse). Du kannst dies anpassen, wenn du Light Mode bevorzugst.
- Account/Sidebar: Das Account‑Menü wurde temporär ausgeblendet in `components/nav-user.tsx` (Komponente gibt `null` zurück). Einfach rückgängig machen, um es wiederherzustellen.

## Geolocation / Nearest Station testen
- Um den `Nearest Station`-Mechanismus zu testen, erlaube Standortfreigabe im Browser auf `/overview` oder emuliere einen Standort in Chrome DevTools (More tools → Sensors → Geolocation → Custom location).
- Wenn die Nearest‑Berechnung ungewöhnlich ist, öffne die Browser‑Console — die Seite loggt Debug‑Informationen (Entfernungen pro Station), z. B. `distance to <Station> ...`.

## Troubleshooting
- JSON in `app/` kann Probleme mit Turbopack/HMR verursachen. Deshalb liegen die Stationsdaten in `data/station.json`.
- Wenn Leaflet‑Tooltips Fehler wie `this.getPane() is undefined` oder `appendChild` werfen, wurde das Projekt so angepasst, dass Tooltips erst gerendert werden, wenn die Map‑Pane existiert (siehe `components/leaflet-map.tsx`).
- Falls HMR oder Build kaputt erscheint: Node Modules neu installieren und `.next`/Lockfile aufräumen:
```bash
rm -rf node_modules .next
pnpm install # oder npm install
pnpm dev
```

## Tests & Lint
- Es gibt keine test‑Suite in diesem Demo‑Repo. TypeScript/TSX Dateien wurden während der Anpassungen auf Syntax geprüft.

## Weiteres
- Wenn du das Repo auf GitHub hast, empfehle ich, die Lockfile (`pnpm-lock.yaml` oder `package-lock.json`) ins VCS zu committen, damit Builds reproduzierbar sind.
- Wenn du willst, starte ich für dich lokal den Dev‑Server und prüfe Verhalten (Tooltips, Marker, Nearest Station). Sag kurz Bescheid.

---

Bei Fragen zu spezifischen Fehlermeldungen oder zum Live‑Check antworte kurz mit `prüfe dev` und ich führe den Dev‑Server für dich lokal aus und teile die relevanten Logs.This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
