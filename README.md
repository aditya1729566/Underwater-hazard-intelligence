# SonarSense — SIH26057 frontend

Interactive frontend prototype for an AI-powered underwater marine debris and anomaly detection system using side-scan sonar imagery.

## Run locally

```bash
pnpm install
pnpm dev
```

This repository contains frontend-only mock data and interactions. No backend, model inference, or authentication is included. Operator preferences are saved only in this browser's local storage.

## Reference dashboard

The main dashboard follows the supplied SonarSense reference: dark sidebar, six summary cards, classification and time charts, satellite detection map, recent detections, anomaly preview, confidence histogram, and mission summary.

Every sidebar item opens a dedicated view: Overview, Detections, Map, Analysis, Missions, Data Quality, Reports, System Status, and Settings. Detections support search, class/priority filters, pagination, detail dialogs, and CSV export. Missions open summary dialogs. The Map view stays in the dashboard; the legacy `/intelligence-map` route remains available directly.

Map markers and detection details include category-specific reference photographs, bundled locally. These are not captures from the mock survey. Credits and source links appear below each photo; see [image credits](public/images/anomalies/CREDITS.md) for reuse terms.

The fixture contains 243 detections and seven missions. Sonar imagery, anomaly output, telemetry, and historical chart trends are illustrative; no live sensor or model is connected. Satellite tiles require an internet connection and retain Esri attribution.

## Checks

```bash
node --experimental-strip-types --test tests/dashboard-data.test.mjs
pnpm build
```
