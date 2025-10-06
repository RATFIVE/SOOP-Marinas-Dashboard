"use client";

import React from 'react';
import { Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface WindSpeedCardProps {
  average: number;
  direction: number;
  label?: string;
  time?: string;
}

const WindSpeedCard: React.FC<WindSpeedCardProps> = ({
  average,
  direction,
  label,
  time
}) => {
  // Convert direction to compass points if label not provided
  const getCompassLabel = (degrees: number) => {
    const points = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return points[index];
  };

  const compassLabel = label || getCompassLabel(direction);

  return (
    <Card className="w-[220px] h-[220px] bg-white shadow-lg rounded-xl border border-gray-200">
      <CardContent className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Wind Speed</h3>
        </div>

        {/* Compass Circle */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-32 h-32">
            {/* Compass circle background */}
            <div className="absolute inset-0 rounded-full border-2 border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100">
              {/* Compass marks */}
              <div className="absolute inset-0">
                {/* Major compass points */}
                {[0, 90, 180, 270].map((angle) => (
                  <div
                    key={angle}
                    className="absolute w-0.5 h-4 bg-gray-400"
                    style={{
                      top: angle === 0 ? '0' : angle === 180 ? 'auto' : '50%',
                      bottom: angle === 180 ? '0' : 'auto',
                      left: angle === 90 ? 'auto' : angle === 270 ? '0' : '50%',
                      right: angle === 90 ? '0' : 'auto',
                      transform: angle === 90 || angle === 270 
                        ? 'translateY(-50%) rotate(90deg)' 
                        : 'translateX(-50%)',
                      transformOrigin: 'center'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Wind direction arrow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="text-blue-600 transition-transform duration-700 ease-in-out"
                style={{ transform: `rotate(${direction}deg)` }}
              >
                <Navigation size={24} className="drop-shadow-md" />
              </div>
            </div>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="bg-white rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-sm border border-gray-100 mt-1">
                <div className="text-xs font-bold text-gray-800">
                  {average.toFixed(1)}
                </div>
                <div className="text-[10px] text-gray-500">m/s</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom info */}
        <div className="space-y-1">
          {/* Direction */}
          <div className="text-center">
            <span className="text-xs font-medium text-gray-700">
              {direction}° {compassLabel}
            </span>
          </div>

          {/* Time */}
          {time && (
            <div className="text-right">
              <span className="text-[10px] text-gray-400">{time}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WindSpeedCard;
