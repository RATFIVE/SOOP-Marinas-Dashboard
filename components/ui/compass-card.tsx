"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation, Wifi, WifiOff } from 'lucide-react';
import { degToCardinal, formatWindSpeed } from '@/lib/deg-to-cardinal';
import { cn } from '@/lib/utils';

export type CompassCardProps = {
  windFromDeg: number | null | undefined; // 0–360, Richtung AUS der der Wind kommt
  windSpeed?: number | null;              // optional, in m/s (Standard) oder km/h
  windDirection?: number | null;          // Windrichtung in Grad (für separate Anzeige)
  unit?: 'm/s' | 'km/h';                  // Default: 'm/s'
  title?: string;                         // Default: 'Wind'
  timestamp?: Date | string | null;       // Zeitstempel der Messung
  isOnline?: boolean;                     // Online-Status
  className?: string;                     // zusätzliche Styles
};

export default function CompassCard({
  windFromDeg,
  windSpeed,
  windDirection,
  unit = 'm/s',
  title = 'Wind',
  timestamp,
  isOnline = true,
  className
}: CompassCardProps) {
  // Validierung der Eingabewerte
  const isValidDirection = windFromDeg !== null && windFromDeg !== undefined && !isNaN(windFromDeg);
  const isValidSpeed = windSpeed !== null && windSpeed !== undefined && !isNaN(windSpeed);
  
  // Himmelsrichtung berechnen
  const cardinal = isValidDirection ? degToCardinal(windFromDeg) : null;
  
  // Formatierte Geschwindigkeit
  const formattedSpeed = isValidSpeed ? formatWindSpeed(windSpeed, unit) : null;
  
  // Zeitstempel formatieren
  const formatTimestamp = (ts: Date | string | null | undefined): string => {
    if (!ts) return "Keine Daten";
    
    const date = typeof ts === 'string' ? new Date(ts) : ts;
    if (isNaN(date.getTime())) return "Ungültiges Datum";
    
    // Deutsches Format: DD.MM.YYYY • HH:mm
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}.${month}.${year} • ${hours}:${minutes}`;
  };

  const formattedTimestamp = formatTimestamp(timestamp);

  return (
    <Card className={cn(
      "relative w-full min-w-[220px] max-w-[320px] h-[220px] md:h-[320px] bg-white dark:bg-zinc-900 shadow-md rounded-lg border hover:shadow-lg transition-shadow duration-200",
      className
    )}>
      <CardContent className="relative p-4 h-full">
        {/* Links Oben - Navigation Icon */}
        <div className="absolute top-4 left-4">
          <Navigation size={20} className="text-blue-600 dark:text-blue-400" />
        </div>

        {/* Oben Mitte - Title */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </span>
        </div>

        {/* Oben Rechts - Online Status */}
        <div className="absolute top-4 right-4 flex flex-col items-center">
          {isOnline ? (
            <Wifi size={16} className="text-green-500" />
          ) : (
            <WifiOff size={16} className="text-red-500" />
          )}
          <Badge 
            variant={isOnline ? "default" : "destructive"} 
            className={`text-[10px] px-1 py-0 mt-1 ${
              isOnline 
                ? "bg-green-500 hover:bg-green-600 text-white" 
                : ""
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>

        {/* Center - Kompass */}
        <div className="absolute inset-0 flex items-center justify-center mt-8 mb-20">
          <div className="relative w-32 h-32 md:w-36 md:h-36">
            {/* SVG Kompass */}
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              aria-label={
                isValidDirection 
                  ? `Wind kommt aus ${cardinal} (${windFromDeg} Grad)`
                  : "Windrichtung nicht verfügbar"
              }
            >
              {/* Kompass-Ring */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-300 dark:text-gray-600"
              />
              
              {/* Innerer Ring */}
              <circle
                cx="100"
                cy="100"
                r="65"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-200 dark:text-gray-700"
              />
              
              {/* Tick-Marks (alle 30°) */}
              {Array.from({ length: 12 }, (_, i) => {
                const angle = i * 30;
                const isMajor = angle % 90 === 0;
                const tickLength = isMajor ? 15 : 8;
                const strokeWidth = isMajor ? 2 : 1;
                
                return (
                  <line
                    key={angle}
                    x1="100"
                    y1="20"
                    x2="100"
                    y2={20 + tickLength}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className={isMajor ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-600"}
                    transform={`rotate(${angle} 100 100)`}
                  />
                );
              })}
              
              {/* Himmelsrichtungen Labels außerhalb des Kreises */}
              <text x="100" y="12" textAnchor="middle" className="text-sm font-bold fill-current text-red-600 dark:text-red-400">N</text>
              <text x="188" y="105" textAnchor="middle" className="text-sm font-bold fill-current text-gray-600 dark:text-gray-400">O</text>
              <text x="100" y="192" textAnchor="middle" className="text-sm font-bold fill-current text-gray-600 dark:text-gray-400">S</text>
              <text x="12" y="105" textAnchor="middle" className="text-sm font-bold fill-current text-gray-600 dark:text-gray-400">W</text>
              
              {/* Kompass-Nadel */}
              {isValidDirection && (
                <g
                  transform={`rotate(${windFromDeg} 100 100)`}
                  className="transition-transform duration-500 ease-out"
                >
                  {/* Nadel-Körper */}
                  <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="45"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-red-600 dark:text-red-400"
                    strokeLinecap="round"
                  />
                  
                  {/* Pfeilspitze */}
                  <polygon
                    points="100,40 95,55 105,55"
                    fill="currentColor"
                    className="text-red-600 dark:text-red-400"
                  />
                  
                  {/* Rückseite der Nadel */}
                  <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="145"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-500 dark:text-gray-400"
                    strokeLinecap="round"
                  />
                </g>
              )}
              
              {/* Zentrum */}
              <circle
                cx="100"
                cy="100"
                r="4"
                fill="currentColor"
                className="text-gray-800 dark:text-gray-200"
              />
            </svg>
          </div>
        </div>

        {/* Wind Messwerte - Links und Rechts unterhalb des Kompass */}
        <div className="absolute bottom-16 left-4 right-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Wind Speed - Links */}
            <div className="text-left">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Speed</div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {isValidSpeed ? formattedSpeed : "— " + unit}
              </div>
            </div>
            
            {/* Wind Direction - Rechts */}
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Direction</div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {isValidDirection ? `${cardinal} (${windFromDeg}°)` : "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Unten - Trennlinie */}
        <div className="absolute bottom-12 left-4 right-4 border-t border-gray-200 dark:border-gray-700"></div>

        {/* Unten - Timestamp */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formattedTimestamp}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}