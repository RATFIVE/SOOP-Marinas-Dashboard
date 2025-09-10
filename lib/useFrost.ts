import { useState, useEffect } from 'react';

const BASE = 'https://timeseries.geomar.de/soop/FROST-Server/v1.1';

type Observation = {
  phenomenonTime?: string;
  result?: unknown;
  [k: string]: unknown;
};

type Thing = { '@iot.id': number; name?: string; [k: string]: unknown };
type Datastream = { '@iot.id': number; name?: string; [k: string]: unknown };

const cache = new Map<string, { ts: number; data: unknown }>();
const TTL = 30 * 1000; // 30s cache

async function cachedFetch(url: string): Promise<unknown> {
  const now = Date.now();
  const c = cache.get(url);
  if (c && now - c.ts < TTL) return c.data;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
  const json = await res.json();
  cache.set(url, { ts: now, data: json });
  return json;
}

function extractArray<T>(resp: unknown): T[] {
  if (!resp) return [];
  if (Array.isArray(resp)) return resp as T[];
  if (typeof resp === 'object' && resp !== null) {
    const maybe = (resp as { value?: unknown }).value;
    if (Array.isArray(maybe)) return maybe as T[];
  }
  return [];
}

export function useThingObservations(thingName: string | null, options?: { datastreams?: string[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [observations, setObservations] = useState<Record<string, Observation | null>>({});

  useEffect(() => {
    if (!thingName) return;
    let mounted = true;
    setLoading(true);
    setError(null);

  (async () => {
      try {
    const thingsResp = await cachedFetch(`${BASE}/Things?$filter=name eq '${encodeURIComponent(thingName)}'`);
    const things = extractArray<Thing>(thingsResp);
    if (!things || things.length === 0) {
          if (mounted) {
            setLoading(false);
            setError('Thing not found');
          }
          return;
        }
    const thing = things[0] as Thing;

        const datastreams = options?.datastreams;
        if (datastreams && datastreams.length > 0) {
      const obsPromises = datastreams.map(async (dsName) => {
            try {
              const dsUrl = `${BASE}/Datastreams?$filter=name eq '${dsName}' and Thing/@iot.id eq ${thing['@iot.id']}`;
        const dsResp = await cachedFetch(dsUrl);
        const dsArr = extractArray<Datastream>(dsResp);
        const ds = dsArr[0];
              if (!ds) return { name: dsName, obs: null };
        const obsUrl = `${BASE}/Datastreams(${ds['@iot.id']})/Observations?$orderby=phenomenonTime desc&$top=1`;
        const obsResp = await cachedFetch(obsUrl);
        const obsArr = extractArray<Observation>(obsResp);
        const o = obsArr[0];
        return { name: dsName, obs: o || null };
            } catch (e) {
              return { name: dsName, obs: null };
            }
          });
          const results = await Promise.all(obsPromises);
          const out: Record<string, Observation | null> = {};
          results.forEach(r => { out[r.name] = r.obs; });
          if (mounted) { setObservations(out); setLoading(false); }
          return;
        }

    const dsUrl = `${BASE}/Datastreams?$filter=Thing/@iot.id eq ${thing['@iot.id']}`;
    const dsResp = await cachedFetch(dsUrl);
    const dsList = extractArray<Datastream>(dsResp);

    const obsPromises = (dsList || []).map(async (ds: Datastream) => {
          try {
      const obsUrl = `${BASE}/Datastreams(${ds['@iot.id']})/Observations?$orderby=phenomenonTime desc&$top=1`;
      const obsResp = await cachedFetch(obsUrl);
      const obsArr = extractArray<Observation>(obsResp);
      const o = obsArr[0];
      return { name: ds.name || String(ds['@iot.id']), obs: o || null };
          } catch (e) {
      return { name: ds.name || String(ds['@iot.id']), obs: null };
          }
        });
        const results = await Promise.all(obsPromises);
        const out: Record<string, Observation | null> = {};
        results.forEach(r => { out[r.name] = r.obs; });
        if (mounted) { setObservations(out); setLoading(false); }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (mounted) { setError(msg); setLoading(false); }
      }
    })();

    return () => { mounted = false; };
  }, [thingName, JSON.stringify(options)]);

  return { loading, error, observations };
}

export default useThingObservations;

export function useThingSeries(thingName: string | null, preferKeywords: string[] = ['temp', 'temperature'], hours: number = 24) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [series, setSeries] = useState<Array<{ time: string; value: number }>>([]);

  useEffect(() => {
    if (!thingName) return;
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const thingsResp = await cachedFetch(`${BASE}/Things?$filter=name eq '${encodeURIComponent(thingName)}'`);
        const things = extractArray<Thing>(thingsResp);
        if (!things || things.length === 0) { if (mounted) { setSeries([]); setLoading(false); setError('Thing not found'); } return; }
        const thing = things[0] as Thing;

        const dsResp = await cachedFetch(`${BASE}/Datastreams?$filter=Thing/@iot.id eq ${thing['@iot.id']}`);
        const dsList = extractArray<Datastream>(dsResp);
        if (!dsList || dsList.length === 0) { if (mounted) { setSeries([]); setLoading(false); } return; }

        let ds: Datastream | null = null;
        for (const candidate of (dsList || [])) {
          const n = String(candidate.name || '').toLowerCase();
          if (preferKeywords.some(pk => n.includes(pk))) { ds = candidate; break; }
        }
        if (!ds) ds = (dsList && dsList[0]) || null;
        if (!ds) { if (mounted) { setSeries([]); setLoading(false); } return; }

        const from = new Date(Date.now() - hours * 3600 * 1000).toISOString();
        const filter = encodeURIComponent(`phenomenonTime gt ${from}`);
        const obsUrl = `${BASE}/Datastreams(${(ds as Datastream)['@iot.id']})/Observations?$filter=${filter}&$orderby=phenomenonTime asc`;
        const obsResp = await cachedFetch(obsUrl);
        const obsList = extractArray<Observation>(obsResp);
        const out: Array<{ time: string; value: number }> = [];
        for (const o of (obsList || [])) {
          let val: unknown = o.result;
          if (val && typeof val === 'object' && 'value' in (val as Record<string, unknown>)) {
            const obj = val as Record<string, unknown>;
            val = obj['value'];
          }
          const num = Number(val);
          if (!isNaN(num)) out.push({ time: o.phenomenonTime || '', value: num });
        }
        if (mounted) { setSeries(out); setLoading(false); }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (mounted) { setError(msg); setLoading(false); }
      }
    })();

    return () => { mounted = false; };
  }, [thingName, JSON.stringify(preferKeywords), hours]);

  return { loading, error, series };
}
