"use client";

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamischer Import der LeafletMap um SSR-Probleme zu vermeiden
const LeafletMap = dynamic(() => import('@/components/leaflet-map'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
});

type Props = {
  lat: number;
  lon: number;
  zoom?: number;
  height?: number;
  /** keep the map square (height == width) */
  square?: boolean;
};

export default function StationMapCard({ lat, lon, zoom = 15, height = 240, square = true }: Props) {
  const [isClient, setIsClient] = useState(false);
  
  // Sicherstellen, dass wir nur im Client rendern
  useEffect(() => {
    setIsClient(true);
  }, []);

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
    if (!isClient) return;
    const t = setTimeout(() => {
      if (!containerRef.current || typeof window === 'undefined') return;
      window.dispatchEvent(new Event('resize'));
    }, 50);
    return () => clearTimeout(t);
  }, [lat, lon, zoom, height, square, isClient]);

  if (!isClient) {
    return (
      <div className={wrapperClass} ref={containerRef}>
        <div className="w-full rounded-lg h-full shadow-lg shadow-black/10 dark:shadow-black/40 bg-gray-100 dark:bg-gray-800 animate-pulse" style={innerStyle} />
      </div>
    );
  }

  return (
    <div className={wrapperClass} ref={containerRef}>
      <div className="w-full rounded-lg h-full shadow-lg shadow-black/10 dark:shadow-black/40" style={innerStyle}>
        <LeafletMap center={[lat, lon]} zoom={zoom} height={square ? 'full' : height} single={true} />
      </div>
    </div>
  );
}
