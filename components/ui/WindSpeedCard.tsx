"use client";

import React from 'react';
import CompassCard from './compass-card';

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
  return (
    <CompassCard 
      windFromDeg={direction}
      windSpeed={average}
      unit="m/s"
      title="Wind Compass"
      timestamp={time ? new Date() : undefined}
      isOnline={true}
      className="w-full min-w-[220px] max-w-[320px] h-[220px] md:h-[320px]"
    />
  );
};

export default WindSpeedCard;
