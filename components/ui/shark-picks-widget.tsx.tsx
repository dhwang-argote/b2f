import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SportSlug =
  | "americanfootball_nfl"
  | "basketball_nba"
  | "baseball_mlb"
  | "soccer_epl";

type SharkPick = {
  matchup: string;
  recommended_pick: string;
  best_odds: number;
  bookmaker: string;
  start_time?: string;
};

const SPORT_OPTIONS: { label: string; value: SportSlug }[] = [
  { label: "NBA", value: "basketball_nba" },
  { label: "MLB", value: "baseball_mlb" },
  { label: "NFL", value: "americanfootball_nfl" },
  { label: "EPL", value: "soccer_epl" },
];

const formatTime = (iso?: string) => {
  if (!iso) return "Time TBD";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "Time TBD";
  }
};

const SharkPicksWidget: React.FC<{
  sport?: SportSlug;
  limit?: number;
  rotateMs?: number;
  defaultAutoRotate?: boolean;
}> = ({
  sport = "americanfootball_nfl",
  limit = 3,
  rotateMs = 10000,
  defaultAutoRotate = true,
}) => {
  const [selectedSport, setSelectedSport] = useState<SportSlug>(sport);
  const [picks, setPicks] = useState<SharkPick[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [, navigate] = useLocation();

  const [autoRotate, setAutoRotate] = useState<boolean>(defaultAutoRotate);

  const currentIndex = useMemo(() => {
    const i = SPORT_OPTIONS.findIndex((o) => o.value === selectedSport);
    return i >= 0 ? i : 0;
  }, [selectedSport]);

  const title = useMemo(() => {
    const o = SPORT_OPTIONS.find((o) => o.value === selectedSport);
    return o ? `Shark Picks AI - ${o.label}` : "Shark Picks AI";
  }, [selectedSport]);

  const itemApprox = 88;
  const minHeight = limit * itemApprox;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(
          `/api/shark-picks/${selectedSport}?ts=${Date.now()}`,
          {
            cache: "no-store",
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];
        if (mounted) setPicks(arr.slice(0, limit));
      } catch (e: any) {
        if (mounted) setErr(e?.message || "Failed to load picks");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [selectedSport, limit]);

  useEffect(() => {
    if (!autoRotate) return;
    const id = setInterval(() => {
      const nextIdx = (currentIndex + 1) % SPORT_OPTIONS.length;
      setSelectedSport(SPORT_OPTIONS[nextIdx].value);
    }, rotateMs);
    return () => clearInterval(id);
  }, [currentIndex, autoRotate, rotateMs]);

  const handleSportChange = (v: string) => {
    setSelectedSport(v as SportSlug);
  };

  return (
    <Card className="p-4 mb-6 bg-gray-800/50 border border-blue-500/20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <Badge className="bg-primary/30 text-primary border border-primary/40">
            Beta
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedSport} onValueChange={handleSportChange}>
            <SelectTrigger className="w-44 bg-transparent text-white border-primary/30">
              <SelectValue placeholder="Choose sport" />
            </SelectTrigger>
            <SelectContent align="end" className="bg-[#0f1115] text-white">
              {SPORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            className={`border-primary/30 text-white hover:bg-primary/10 ${
              autoRotate ? "opacity-100" : "opacity-70"
            }`}
            onClick={() => setAutoRotate((v) => !v)}
            title={autoRotate ? "Pause auto-rotate" : "Resume auto-rotate"}
          >
            {autoRotate ? "Pause" : "Auto"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-primary/30 text-white hover:bg-primary/10"
            onClick={() => navigate("/odds")}
          >
            See All
          </Button>
        </div>
      </div>

      <div
        style={{ minHeight }}
        className="transition-[min-height] duration-300"
      >
        {loading ? (
          <ul className="space-y-3 animate-pulse">
            {Array.from({ length: limit }).map((_, i) => (
              <li
                key={i}
                className="p-3 rounded-lg bg-gray-800/40 border border-primary/10"
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 w-40 bg-white/10 rounded" />
                  <div className="h-3 w-24 bg-white/10 rounded" />
                </div>
                <div className="mt-2 h-4 w-56 bg-white/10 rounded" />
                <div className="mt-2 h-3 w-32 bg-white/10 rounded" />
              </li>
            ))}
          </ul>
        ) : err ? (
          <div className="text-sm text-red-400">Error: {err}</div>
        ) : picks.length === 0 ? (
          <div className="text-sm text-gray-400">
            No picks available right now.
          </div>
        ) : (
          <ul className="space-y-3">
            {picks.map((p, i) => (
              <li
                key={`${p.matchup}-${i}`}
                className="p-3 rounded-lg bg-gray-800/40 border border-primary/10"
              >
                <div className="flex items-center justify-between">
                  <div className="text-white font-medium">{p.matchup}</div>
                  <div className="text-xs text-gray-400">
                    {formatTime(p.start_time)}
                  </div>
                </div>
                <div className="mt-1 text-sm">
                  <span className="text-green-400 font-semibold">★ Pick:</span>{" "}
                  <span className="text-white">{p.recommended_pick}</span>{" "}
                  <span className="text-primary font-semibold">
                    ({p.best_odds?.toFixed?.(2) ?? p.best_odds})
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Bookmaker: {p.bookmaker}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};

export default SharkPicksWidget;
