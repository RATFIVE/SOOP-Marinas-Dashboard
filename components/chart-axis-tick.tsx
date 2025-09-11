"use client";
import React from 'react';

interface RotatedDateTickProps {
  x?: number;
  y?: number;
  payload?: { value?: string };
  angle?: number; // negative for clockwise
  fontSize?: number;
  dx?: number;
  dy?: number;
  offsetY?: number; // zusätzlicher Pixel-Offset nach unten (verschiebt gesamte Gruppe)
  textAnchor?: 'end' | 'start' | 'middle' | 'inherit';
}

export const RotatedDateTick: React.FC<RotatedDateTickProps> = ({
  x = 0,
  y = 0,
  payload,
  angle = -30,
  fontSize = 12,
  dx = -4,
  dy = 0,
  textAnchor = 'end',
  offsetY = 10,
}) => {
  const value = payload?.value ?? '';
  return (
    <g transform={`translate(${x},${y + offsetY})`}>
  <text dy={dy} dx={dx} textAnchor={textAnchor} transform={`rotate(${angle})`} fontSize={fontSize} fill="currentColor">
        {value}
      </text>
    </g>
  );
};

export default RotatedDateTick;
