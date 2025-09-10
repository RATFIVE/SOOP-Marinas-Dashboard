"use client";

import React from 'react';
import MapboxMap from '@/components/mapbox-map';

type Props = {
  lat: number;
  lon: number;
  zoom?: number;
  height?: number;
};

export default function StationMapCard({ lat, lon, zoom = 13, height = 240 }: Props) {
  return (
    <div className="bg-transparent rounded-lg overflow-hidden">
      <div className="h-full w-full rounded-lg" style={{ height }}>
        {/* MapboxMap expects center as [lat, lon] */}
        <MapboxMap center={[lat, lon]} zoom={zoom} height={height} />
      </div>
    </div>
  );
}
