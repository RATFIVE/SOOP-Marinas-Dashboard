export type GeoLocation = { type: 'Point'; coordinates: [number, number] } | { type: string; coordinates: number[] };

export type Station = {
  id?: string;
  name: string;
  info?: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: GeoLocation;
  'twlbox-id'?: string;
  'metbox-id'?: string;
  status?: 'online' | 'offline';
};

import stationJson from '@/data/station.json';

const raw = stationJson as { stations?: Station[] };
export const stations: Station[] = raw.stations ?? [];

export default stations;
