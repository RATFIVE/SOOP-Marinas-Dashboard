/**
 * Konvertiert Grad-Angaben in deutsche Himmelsrichtungen (8er-Rose)
 * @param deg - Grad-Angabe (0-360)
 * @returns Deutsche Himmelsrichtung als Kürzel
 */
export function degToCardinal(deg: number): 'N' | 'NO' | 'O' | 'SO' | 'S' | 'SW' | 'W' | 'NW' {
  // Normalisiere den Wert auf 0-360
  const normalizedDeg = ((deg % 360) + 360) % 360;
  
  // 8er-Rose: 45° Sektoren
  const directions: Array<'N' | 'NO' | 'O' | 'SO' | 'S' | 'SW' | 'W' | 'NW'> = [
    'N',   // 337.5 - 22.5
    'NO',  // 22.5 - 67.5
    'O',   // 67.5 - 112.5
    'SO',  // 112.5 - 157.5
    'S',   // 157.5 - 202.5
    'SW',  // 202.5 - 247.5
    'W',   // 247.5 - 292.5
    'NW'   // 292.5 - 337.5
  ];
  
  // Berechne Index basierend auf 45° Sektoren (mit 22.5° Offset)
  const index = Math.round(normalizedDeg / 45) % 8;
  
  return directions[index];
}

/**
 * Konvertiert m/s zu km/h
 * @param ms - Geschwindigkeit in m/s
 * @returns Geschwindigkeit in km/h
 */
export function msToKmh(ms: number): number {
  return ms * 3.6;
}

/**
 * Formatiert Windgeschwindigkeit mit Einheit
 * @param speed - Geschwindigkeit
 * @param unit - Einheit ('m/s' oder 'km/h')
 * @returns Formatierte Geschwindigkeit als String
 */
export function formatWindSpeed(speed: number, unit: 'm/s' | 'km/h' = 'm/s'): string {
  const value = unit === 'km/h' ? msToKmh(speed) : speed;
  return `${value.toFixed(1)} ${unit}`;
}