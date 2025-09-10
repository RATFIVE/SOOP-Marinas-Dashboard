"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Wifi, Thermometer, Wind, Waves, Droplets, Clock, ArrowRight } from "lucide-react";

type Metric = { label: string; value: string };

export type StationCardProps = {
  name: string;
  lat: number;
  lon: number;
  online: boolean;
  metrics: Metric[];
  lastUpdateISO: string;
  onMoreDetails?: () => void;
  compact?: boolean; // when true, render inline/auto width (for map popups)
};

function formatLastUpdate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    return iso;
  }
}

export default function StationCard({ name, lat, lon, online, metrics, lastUpdateISO, onMoreDetails, compact = false }: StationCardProps) {
  const baseClasses = compact
    ? 'inline-block w-auto rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-2 sm:p-3'
    : 'w-full rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-3 sm:p-4';

  return (
    <Card className={baseClasses}>
      <CardHeader className="p-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold">{name}</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="w-4 h-4 mr-1 text-[var(--muted)]" />
              <span className="select-none">{lat.toFixed(4)}, {lon.toFixed(4)}</span>
            </div>
          </div>
          <div className="flex items-start">
            <Badge
              variant={online ? "secondary" : "outline"}
              className={`rounded-full px-2 py-0.5 flex items-center gap-2 ${online ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300"}`}
              aria-label={online ? "Online" : "Offline"}
            >
              <Wifi className={`w-4 h-4 ${online ? "text-green-600" : "text-gray-500"}`} />
              <span className="text-sm font-medium">{online ? "Online" : "Offline"}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>

  <CardContent className="p-0 mt-3">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {metrics.map((m, i) => {
            const key = `${m.label}-${i}`;
            return (
      <div key={key} className="flex items-center justify-between bg-transparent py-1">
                <div className="flex items-center gap-3">
                  {/* choose icon by heuristic label */}
                  <span className="text-muted-foreground">
                    {m.label.toLowerCase().includes("wind") ? <Wind className="w-5 h-5 text-[var(--muted)]" /> :
                     m.label.toLowerCase().includes("temp") || m.label.toLowerCase().includes("temperature") ? <Thermometer className="w-5 h-5 text-[var(--muted)]" /> :
                     m.label.toLowerCase().includes("level") ? <Waves className="w-5 h-5 text-[var(--muted)]" /> :
                     m.label.toLowerCase().includes("salin") ? <Droplets className="w-5 h-5 text-[var(--muted)]" /> :
                     <MapPin className="w-5 h-5 text-[var(--muted)]" />}
                  </span>
                  <div>
                    <div className="text-sm text-muted-foreground">{m.label}</div>
                  </div>
                </div>
                <div className="text-base font-medium">{m.value}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <div className="mt-3">
        <Separator />
      </div>

      <CardFooter className="p-0 mt-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground w-full">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--muted)]" />
            <span className="text-sm">Last update:&nbsp;</span>
            <time dateTime={lastUpdateISO} className="font-medium text-sm">{formatLastUpdate(lastUpdateISO)}</time>
          </div>
          <div className="text-right hidden sm:block text-sm text-muted-foreground" aria-hidden> </div>
        </div>
      </CardFooter>

      <div className="mt-2">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 py-2 text-base"
          onClick={onMoreDetails}
          aria-label={`More details for ${name}`}
        >
          <span>More details</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
