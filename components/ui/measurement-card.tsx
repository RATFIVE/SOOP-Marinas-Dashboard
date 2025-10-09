"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Waves, Wind, Navigation, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MeasurementCardProps = {
  type: 'temperature' | 'level' | 'wind-speed' | 'wind-direction';
  title: string;
  value: number | null | undefined;
  unit: string;
  timestamp?: Date | string | null;
  isOnline?: boolean;
  className?: string;
};

export default function MeasurementCard({
  type,
  title,
  value,
  unit,
  timestamp,
  isOnline = true,
  className
}: MeasurementCardProps) {
  // Icon mapping basierend auf type
  const getIcon = () => {
    switch (type) {
      case 'temperature':
        return <Thermometer size={20} className="text-blue-600 dark:text-blue-400" />;
      case 'level':
        return <Waves size={20} className="text-blue-600 dark:text-blue-400" />;
      case 'wind-speed':
        return <Wind size={20} className="text-blue-600 dark:text-blue-400" />;
      case 'wind-direction':
        return <Navigation size={20} className="text-blue-600 dark:text-blue-400" />;
      default:
        return <Thermometer size={20} className="text-blue-600 dark:text-blue-400" />;
    }
  };

  // Wert formatieren
  const formatValue = (val: number | null | undefined): string => {
    if (val === null || val === undefined || isNaN(val)) {
      return "—";
    }
    return val.toFixed(2);
  };

  // Timestamp formatieren
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

  const formattedValue = formatValue(value);
  const formattedTimestamp = formatTimestamp(timestamp);

  return (
    <Card className={cn(
      "relative w-full min-w-[220px] max-w-[320px] h-[220px] md:h-[320px] bg-white dark:bg-zinc-900 shadow-md rounded-lg border hover:shadow-lg transition-shadow duration-200",
      className
    )}>
      <CardContent className="relative p-4 h-full">
        {/* Links Oben - Measurement Icon */}
        <div className="absolute top-4 left-4">
          {getIcon()}
        </div>

        {/* Oben Mitte - Measurement Type */}
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

        {/* Center - Messwert */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {formattedValue}
            </span>
            {formattedValue !== "—" && (
              <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-1">
                {unit}
              </span>
            )}
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