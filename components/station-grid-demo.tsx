"use client";

import React from "react";
import StationCard from "./station-card";

const stations = [
  {
    name: "Kiel Harbour",
    lat: 54.3235,
    lon: 10.1519,
    online: true,
    metrics: [
      { label: "Average wind", value: "8.6 m/s" },
      { label: "Temperature", value: "15.2°C" },
      { label: "Water level", value: "+13 cm" },
      { label: "Salinity", value: "32 PSU" },
    ],
    lastUpdateISO: "2025-05-14T06:14:11.000Z",
  },
  {
  name: "Marina Lübeck \"The Newport\"",
    lat: 53.8667,
    lon: 10.6833,
    online: false,
    metrics: [
      { label: "Average wind", value: "5.1 m/s" },
      { label: "Temperature", value: "12.3°C" },
      { label: "Water level", value: "+8 cm" },
      { label: "Salinity", value: "30 PSU" },
    ],
    lastUpdateISO: "2025-06-01T10:00:00.000Z",
  },
  {
    name: "Kappeln",
    lat: 54.5420,
    lon: 9.9222,
    online: true,
    metrics: [
      { label: "Average wind", value: "7.4 m/s" },
      { label: "Temperature", value: "14.8°C" },
      { label: "Water level", value: "+10 cm" },
      { label: "Salinity", value: "31 PSU" },
    ],
    lastUpdateISO: "2025-05-30T08:30:00.000Z",
  },
  {
    name: "Schilksee",
    lat: 54.3667,
    lon: 10.1167,
    online: true,
    metrics: [
      { label: "Average wind", value: "6.3 m/s" },
      { label: "Temperature", value: "13.9°C" },
      { label: "Water level", value: "+9 cm" },
      { label: "Salinity", value: "29 PSU" },
    ],
    lastUpdateISO: "2025-07-02T12:45:00.000Z",
  },
  {
    name: "Marina Heiligenhafen",
    lat: 54.3861,
    lon: 11.0033,
    online: false,
    metrics: [
      { label: "Average wind", value: "4.8 m/s" },
      { label: "Temperature", value: "11.6°C" },
      { label: "Water level", value: "+6 cm" },
      { label: "Salinity", value: "28 PSU" },
    ],
    lastUpdateISO: "2025-04-12T09:20:00.000Z",
  },
];

export default function StationGridDemo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stations.map((s) => (
        <StationCard
          key={s.name}
          name={s.name}
          lat={s.lat}
          lon={s.lon}
          online={s.online}
          metrics={s.metrics}
          lastUpdateISO={s.lastUpdateISO}
          onMoreDetails={() => { const slug = s.name === 'Marina Lübeck "The Newport"' ? 'marina-luebeck-the-newport' : s.name.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, ''); window.location.hash = `#/station/${slug}` }}
        />
      ))}
    </div>
  );
}
