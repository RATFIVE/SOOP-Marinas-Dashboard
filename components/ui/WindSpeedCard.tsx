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
      title="Windkompass"
      className="w-[320px]"
    />
  );
};

export default WindSpeedCard;
