"use client";

import React, { useState } from 'react';
import CompassCard from '@/components/ui/compass-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function CompassDemoPage() {
  const [windFromDeg, setWindFromDeg] = useState<number>(0);
  const [windSpeed, setWindSpeed] = useState<number>(5.3);
  const [unit, setUnit] = useState<'m/s' | 'km/h'>('m/s');

  // Vordefinierte Test-Richtungen
  const testDirections = [
    { label: 'Nord', deg: 0 },
    { label: 'Nordost', deg: 45 },
    { label: 'Ost', deg: 90 },
    { label: 'Südost', deg: 135 },
    { label: 'Süd', deg: 180 },
    { label: 'Südwest', deg: 225 },
    { label: 'West', deg: 270 },
    { label: 'Nordwest', deg: 315 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Windkompass Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Interaktive Demonstration der wiederverwendbaren Kompass-Komponente
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kompass-Anzeige */}
          <div className="flex justify-center">
            <CompassCard
              windFromDeg={windFromDeg}
              windSpeed={windSpeed}
              unit={unit}
              title="Windkompass (Demo)"
            />
          </div>

          {/* Steuerung */}
          <Card>
            <CardHeader>
              <CardTitle>Kompass-Steuerung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Manuelle Eingabe */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="direction">Windrichtung (0-360°)</Label>
                  <Input
                    id="direction"
                    type="number"
                    min="0"
                    max="360"
                    value={windFromDeg}
                    onChange={(e) => setWindFromDeg(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="speed">Windgeschwindigkeit</Label>
                  <Input
                    id="speed"
                    type="number"
                    min="0"
                    step="0.1"
                    value={windSpeed}
                    onChange={(e) => setWindSpeed(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Einheit</Label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      variant={unit === 'm/s' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUnit('m/s')}
                    >
                      m/s
                    </Button>
                    <Button
                      variant={unit === 'km/h' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUnit('km/h')}
                    >
                      km/h
                    </Button>
                  </div>
                </div>
              </div>

              {/* Schnell-Buttons */}
              <div className="space-y-2">
                <Label>Schnellauswahl Richtungen</Label>
                <div className="grid grid-cols-2 gap-2">
                  {testDirections.map(({ label, deg }) => (
                    <Button
                      key={deg}
                      variant="outline"
                      size="sm"
                      onClick={() => setWindFromDeg(deg)}
                      className={windFromDeg === deg ? 'bg-blue-50 dark:bg-blue-950' : ''}
                    >
                      {label} ({deg}°)
                    </Button>
                  ))}
                </div>
              </div>

              {/* Edge-Case Tests */}
              <div className="space-y-2">
                <Label>Edge-Case Tests</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setWindFromDeg(359.9);
                      setWindSpeed(12.5);
                    }}
                  >
                    359.9° (≈ N)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setWindFromDeg(0);
                      setWindSpeed(0);
                    }}
                  >
                    Windstille
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mehrere Kompass-Beispiele */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
            Beispiel-Konfigurationen
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CompassCard
              windFromDeg={315}
              windSpeed={5.3}
              unit="m/s"
              title="Marina Nord"
            />
            
            <CompassCard
              windFromDeg={180}
              windSpeed={8.7}
              unit="km/h"
              title="Hafen Süd"
            />
            
            <CompassCard
              windFromDeg={90}
              windSpeed={null}
              title="Messung ausstehend"
            />
            
            <CompassCard
              windFromDeg={null}
              windSpeed={15.2}
              unit="m/s"
              title="Sensor defekt"
            />
          </div>
        </div>

        {/* Technische Details */}
        <Card>
          <CardHeader>
            <CardTitle>Implementierungsdetails</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Meteorologische Konvention</h4>
                <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• 0° = Wind aus Norden</li>
                  <li>• 90° = Wind aus Osten</li>
                  <li>• 180° = Wind aus Süden</li>
                  <li>• 270° = Wind aus Westen</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Features</h4>
                <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• SVG-basierte Darstellung</li>
                  <li>• Sanfte Rotation (0.5s)</li>
                  <li>• Deutsche Himmelsrichtungen</li>
                  <li>• Einheitenkonvertierung</li>
                  <li>• Accessibility Support</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Code-Beispiel</h4>
              <Badge variant="outline" className="font-mono text-xs">
                {`<CompassCard windFromDeg={${windFromDeg}} windSpeed={${windSpeed}} unit="${unit}" />`}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}