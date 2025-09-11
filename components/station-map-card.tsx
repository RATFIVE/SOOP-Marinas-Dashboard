"use client";

import React, { useEffect, useRef } from 'react';
import LeafletMap from '@/components/leaflet-map';

type Props = {
  lat: number;
  lon: number;
  zoom?: number;
  height?: number;
  /** keep the map square (height == width) */
  square?: boolean;
};

export default function StationMapCard({ lat, lon, zoom = 15, height = 240, square = true }: Props) {
  // If square is requested, use aspect-square so the element's height follows its width.
  // Provide a minHeight to avoid extremely small layouts when width is tiny.
  const wrapperClass = `bg-transparent overflow-hidden ${square ? 'aspect-square' : ''}`.trim();
  const innerStyle: React.CSSProperties = {};
  if (!square) innerStyle.height = height;
  // minHeight ensures a reasonable footprint when square (width may be small on narrow layouts)
  if (square) innerStyle.minHeight = height;

  const containerRef = useRef<HTMLDivElement | null>(null);
  // Trigger ResizeObserver friendly event for Leaflet after mount
  useEffect(() => {
    const t = setTimeout(() => {
      if (!containerRef.current) return;
      window.dispatchEvent(new Event('resize'));
    }, 50);
    return () => clearTimeout(t);
  }, [lat, lon, zoom, height, square]);

  return (
    <div className={wrapperClass} ref={containerRef}>
      <div className="w-full rounded-lg h-full shadow-lg shadow-black/10 dark:shadow-black/40" style={innerStyle}>
        <LeafletMap center={[lat, lon]} zoom={zoom} height={square ? 'full' : height} single={true} />
      </div>
    </div>
  );
}
