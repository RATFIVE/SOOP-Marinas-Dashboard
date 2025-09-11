# Dashboard — Lokale Entwicklungsanleitung

Kurz: Dieses Repository ist eine Next.js (App‑Directory) Demo mit Leaflet (OpenStreetMap) Karte, Recharts‑AreaCharts und Tailwind‑Styling.

## Voraussetzungen

## Repository klonen

Ersetze `<REPO_URL>` durch die URL des GitHub‑Repos (z. B. `git@github.com:owner/repo.git`):

```bash
 git clone <REPO_URL>
 cd SOOP-Marinas-Dashboard
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

## Geolocation / Nearest Station testen

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
