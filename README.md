# SOOP Marinas Dashboard

Eine Next.js Dashboard-Anwendung zur Überwachung von Marina-Sensordaten mit interaktiven Charts und Karten.

## Features

- Echtzeit-Sensordatenvisualisierung
- Interaktive Karten mit Leaflet
- Dynamische Zeitbereichsauswahl (24h, 7d, 30d)
- Responsive Design mit Dark/Light Mode
- Mehrere Marina-Stationen mit individuellen Metriken

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Maps**: Leaflet mit OpenStreetMap
- **UI Components**: Radix UI
- **Package Manager**: pnpm

## Entwicklung

### Repository klonen

```bash
git clone <REPO_URL>
cd SOOP-Marinas-Dashboard
```

### Installieren

```bash
# pnpm (empfohlen)
pnpm install

# oder npm
npm install
```

### Development Server

```bash
# pnpm
pnpm dev

# npm
npm run dev
```

Im Browser: http://localhost:3000

## Deployment auf Vercel

Dieses Projekt ist für Vercel-Deployment optimiert:

### Automatisches Deployment

1. **Repository verbinden**: Verbinde dein GitHub-Repository mit Vercel
2. **Auto-Deploy**: Vercel erkennt automatisch das Next.js-Framework
3. **Konfiguration**: Die `vercel.json` enthält:
   - Build-Befehl: `pnpm build`
   - Node.js Version: 18
   - Environment-Variablen
   - Function-Timeouts und Routing

### Manuelles Deployment

```bash
# Vercel CLI installieren
npm i -g vercel

# Deployment vom Projektroot
vercel

# Für Production-Deployment
vercel --prod
```

### Environment-Variablen

Falls nötig in Vercel Dashboard setzen:
- `ESLINT_IGNORE_DURING_BUILD=false` um Linting in CI zu aktivieren
- `NEXT_TELEMETRY_DISABLED=1` (bereits konfiguriert)

```bash
# Development
pnpm dev          # Startet Dev-Server auf localhost:3000
pnpm build        # Erstellt Production-Build
pnpm start        # Startet Production-Server
pnpm lint         # Führt ESLint aus
```

## Projekt-Struktur

```
app/
├── stations/           # Einzelne Marina-Stationsseiten
├── dashboard/          # Haupt-Dashboard
├── map/               # Karten-Übersicht
└── layout.tsx         # Root-Layout

components/
├── ui/                # Wiederverwendbare UI-Komponenten
├── charts/            # Chart-Komponenten
└── maps/              # Karten-Komponenten

lib/
├── utils.ts           # Utility-Funktionen
├── station.ts         # Stations-Datenverwaltung
└── useFrost.ts        # Data-Fetching Hooks
```

## Datenquellen

- **FROST Server**: Echtzeit-Sensorbeobachtungen
- **Time Series**: Historische Daten mit konfigurierbaren Bereichen
- **Metriken**: Wind, Wassertemperatur, Wasserpegel

## Technische Details

### Karten
- **Leaflet** statt Mapbox für OpenStreetMap-Integration
- **SSR-kompatibel** mit dynamischen Importen
- **Responsive** Karten mit Touch-Support

### Charts
- **Recharts** für AreaChart-Visualisierungen
- **Dynamische Y-Achsen** mit automatischer Skalierung
- **Rotierte X-Achsen-Labels** für bessere Lesbarkeit
- **Vertikale Grid-Linien** bei jedem Zeitstempel

### Deployment-Konfiguration
- **basePath**: Leer (Projekt läuft im Root `/`)
- **SSR/Edge Functions**: Vollständig unterstützt
- **Images**: Unoptimized für statische Kompatibilität

## Lizenz

Dieses Projekt ist privat und proprietär.

## Troubleshooting
```bash
rm -rf node_modules .next
pnpm install # oder npm install
pnpm dev
```

## Tests & Lint

## Weiteres


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


You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
