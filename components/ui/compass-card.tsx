"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { degToCardinal, formatWindSpeed } from '@/lib/deg-to-cardinal';
import { cn } from '@/lib/utils';

export type CompassCardProps = {
  windFromDeg: number | null | undefined; // 0–360, Richtung AUS der der Wind kommt
  windSpeed?: number | null;              // optional, in m/s (Standard) oder km/h
  unit?: 'm/s' | 'km/h';                  // Default: 'm/s'
  title?: string;                         // Default: 'Wind'
  className?: string;                     // zusätzliche Styles
};

export default function CompassCard({
  windFromDeg,
  windSpeed,
  unit = 'm/s',
  title = 'Wind',
  className
}: CompassCardProps) {
  // Validierung der Eingabewerte
  const isValidDirection = windFromDeg !== null && windFromDeg !== undefined && !isNaN(windFromDeg);
  const isValidSpeed = windSpeed !== null && windSpeed !== undefined && !isNaN(windSpeed);
  
  // Himmelsrichtung berechnen
  const cardinal = isValidDirection ? degToCardinal(windFromDeg) : null;
  
  // Formatierte Geschwindigkeit
  const formattedSpeed = isValidSpeed ? formatWindSpeed(windSpeed, unit) : null;

  return (
    <Card className={cn("w-full max-w-sm mx-auto", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Kompass-Bereich */}
        <div className="flex justify-center">
          <div className="relative w-48 h-48">
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
        
        {/* Info-Bereich */}
        <div className="space-y-2">
          {/* Richtung und Grad */}
          {isValidDirection ? (
            <div className="text-center">
              <Badge variant="secondary" className="text-sm font-medium">
                {cardinal} ({windFromDeg}°)
              </Badge>
            </div>
          ) : (
            <div className="text-center">
              <Badge variant="outline" className="text-sm">
                —
              </Badge>
            </div>
          )}
          
          {/* Windgeschwindigkeit */}
          {isValidSpeed ? (
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {formattedSpeed}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-lg text-gray-400 dark:text-gray-600">
                — {unit}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}