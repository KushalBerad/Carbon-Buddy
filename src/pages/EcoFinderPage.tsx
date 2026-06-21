import {
  CheckCircle,
  Compass,
  Info,
  MapPin,
  Navigation,
  Search,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useUserStore } from '../store/userStore';

interface EcoSpot {
  id: string;
  name: string;
  category: 'garden' | 'charging' | 'recycling' | 'organic';
  address: string;
  distanceMiles: number;
  offsetCarbonGrams: number;
  pointsRewarded: number;
}

export interface EcoFinderPageProps {
  onEarnPoints?: (
    pts: number,
    carbonOffset: number
  ) => void;
}

/* moved outside component */
const ECO_SPOTS: EcoSpot[] = [
  {
    id: 'spot-1',
    name: 'Downtown Community Compost Center',
    category: 'recycling',
    address: '128 S Green Ave, Metro City',
    distanceMiles: 1.4,
    offsetCarbonGrams: 500,
    pointsRewarded: 30,
  },
  {
    id: 'spot-2',
    name: 'Greenway EV Charger Network',
    category: 'charging',
    address: '445 Broadway Blvd, Metro City',
    distanceMiles: 2.1,
    offsetCarbonGrams: 800,
    pointsRewarded: 40,
  },
  {
    id: 'spot-3',
    name: 'West Side Community Gardens',
    category: 'garden',
    address: '88 Harvest Lane, Metro City',
    distanceMiles: 3.5,
    offsetCarbonGrams: 600,
    pointsRewarded: 35,
  },
  {
    id: 'spot-4',
    name: 'E-Waste Battery Collection Hub',
    category: 'recycling',
    address: '900 Industrial Way, Metro City',
    distanceMiles: 4.8,
    offsetCarbonGrams: 1000,
    pointsRewarded: 50,
  },
  {
    id: 'spot-5',
    name: 'Whole Roots Organic Market',
    category: 'organic',
    address: '14 Plaza Circle, Metro City',
    distanceMiles: 1.1,
    offsetCarbonGrams: 300,
    pointsRewarded: 20,
  },
];

export const EcoFinderPage = React.memo(
  function EcoFinderPage({
    onEarnPoints: propOnEarnPoints,
  }: EcoFinderPageProps) {
    const storeEarnPoints = useUserStore(
      (s) => s.earnPoints
    );

    const onEarnPoints =
      propOnEarnPoints || storeEarnPoints;

    const [visitedMap, setVisitedMap] =
      useState<Record<string, boolean>>({});

    const [filter, setFilter] =
      useState<string>('all');

    const [search, setSearch] =
      useState<string>('');

    const handleVisit = useCallback(
      (
        id: string,
        pts: number,
        carbon: number
      ) => {
        if (visitedMap[id]) return;

        setVisitedMap((prev) => ({
          ...prev,
          [id]: true,
        }));

        onEarnPoints(pts, carbon);
      },
      [visitedMap, onEarnPoints]
    );

    const filteredSpots = useMemo(() => {
      return ECO_SPOTS.filter((spot) => {
        const matchesCategory =
          filter === 'all' ||
          spot.category === filter;

        const query =
          search.toLowerCase();

        const matchesSearch =
          spot.name
            .toLowerCase()
            .includes(query) ||
          spot.address
            .toLowerCase()
            .includes(query);

        return (
          matchesCategory &&
          matchesSearch
        );
      });
    }, [filter, search]);

    const categories = [
      { id: 'all', label: 'All Spots' },
      { id: 'recycling', label: 'Recycling' },
      { id: 'charging', label: 'EV Station' },
      { id: 'garden', label: 'Urban Garden' },
      { id: 'organic', label: 'Organic Shop' },
    ];

    return (
      <div className="space-y-8 font-sans">

        <div className="border-b border-zinc-200/50 pb-5 dark:border-zinc-800">
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Location Aware Eco Suggestions
          </h1>

          <p className="mt-1 text-xs font-light text-zinc-500 dark:text-zinc-300">
            Detect eco-friendly infrastructure nearby and check in to claim rewards.
          </p>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-teal-500/10 bg-teal-500/5 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />

          <p className="text-xs font-light leading-relaxed text-zinc-500 dark:text-zinc-300">
            Smart routing simulation rewards sustainable transportation decisions.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="relative w-full sm:w-80">

            {/* accessibility fix */}
            <label
              htmlFor="eco-search"
              className="sr-only"
            >
              Search eco locations
            </label>

            <input
              id="eco-search"
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search locations..."
              className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-4 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-teal-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            />

            <Search className="absolute left-3 top-3.5 h-3.5 w-3.5 text-zinc-500" />
          </div>

          <div className="flex max-w-full items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const isActive = filter === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilter(cat.id)}
                  title={cat.label}
                  data-active={isActive}
                  className={`rounded-xl border px-3 py-1.5 text-[11px] font-bold transition-colors ${isActive
                      ? 'border-teal-500 bg-teal-500/5 text-teal-600'
                      : 'border-zinc-200 text-zinc-500 dark:border-zinc-800'
                    }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <div className="space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-300">
              Nearby Ecological Nodes
            </h2>

            <div className="max-h-[480px] space-y-4 overflow-y-auto pr-1">

              {filteredSpots.length === 0 ? (
                <p className="py-8 text-center text-xs italic font-light text-zinc-500 dark:text-zinc-300">
                  No eco locations match current criteria.
                </p>
              ) : (
                filteredSpots.map((spot) => {
                  const isVisited =
                    visitedMap[spot.id];

                  return (
                    <Card
                      key={spot.id}
                      className={`flex flex-col justify-between gap-4 p-4 ${isVisited
                        ? 'border border-emerald-500/40 bg-emerald-500/5'
                        : ''
                        }`}
                    >
                      <div className="space-y-2">

                        <div className="flex items-start justify-between">

                          <div className="space-y-1">
                            <span className="text-[9px] font-bold uppercase text-zinc-500">
                              {spot.category} • {spot.distanceMiles} miles
                            </span>

                            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                              {spot.name}
                            </h3>
                          </div>

                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600">
                            <MapPin className="h-4 w-4" />
                          </div>
                        </div>

                        <p className="text-xs font-light text-zinc-500 dark:text-zinc-300">
                          {spot.address}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">

                        <div className="text-[11px] font-bold text-emerald-500">
                          +{spot.offsetCarbonGrams}g CO₂ | +{spot.pointsRewarded} XP
                        </div>

                        {isVisited ? (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <CheckCircle className="h-4 w-4" />
                            <span>Visited</span>
                          </div>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              handleVisit(
                                spot.id,
                                spot.pointsRewarded,
                                spot.offsetCarbonGrams
                              )
                            }
                            rightIcon={
                              <Navigation className="h-3 w-3" />
                            }
                            aria-label={`Check in at ${spot.name}`}
                            className="text-[10px]"
                          >
                            Check In
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* right panel */}

          <div className="space-y-6">

            <Card className="relative flex h-full min-h-[300px] flex-col justify-between overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 text-white">

              <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-teal-500/15 blur-2xl" />

              <div className="relative z-10 space-y-3">

                <Compass className="h-8 w-8 text-teal-400" />

                <h3 className="text-sm font-bold">
                  Smart Location Routing
                </h3>

                <p className="text-xs font-light leading-relaxed text-zinc-400">
                  Carbon Buddy estimates cleaner transportation routes and rewards lower-emission travel behavior automatically.
                </p>
              </div>

              <div className="relative z-10 flex items-center justify-between border-t border-zinc-800 pt-4 text-xs text-zinc-500">
                <span>Telemetry Node: Active</span>
                <span>Grid Status: Clean</span>
              </div>
            </Card>

          </div>
        </div>
      </div>
    );
  }
);