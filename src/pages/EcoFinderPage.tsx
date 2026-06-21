import { CheckCircle, Compass, Info, MapPin, Navigation, Search } from 'lucide-react';
import React, { useState } from 'react';
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
  visited: boolean;
}

export interface EcoFinderPageProps {
  onEarnPoints?: (pts: number, carbonOffset: number) => void;
}

export const EcoFinderPage = React.memo(function EcoFinderPage({ onEarnPoints: propOnEarnPoints }: EcoFinderPageProps) {
  const storeEarnPoints = useUserStore((s) => s.earnPoints);
  const onEarnPoints = propOnEarnPoints || storeEarnPoints;

  const [visitedMap, setVisitedMap] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const [spots, setSpots] = useState<EcoSpot[]>([
    { id: 'spot-1', name: 'Downtown Community Compost Center', category: 'recycling', address: '128 S Green Ave, Metro City', distanceMiles: 1.4, offsetCarbonGrams: 500, pointsRewarded: 30, visited: false },
    { id: 'spot-2', name: 'Greenway Electric vehicle charger network', category: 'charging', address: '445 Broadway Blv, Metro City', distanceMiles: 2.1, offsetCarbonGrams: 800, pointsRewarded: 40, visited: false },
    { id: 'spot-3', name: 'West Side Community Gardens & Farming', category: 'garden', address: '88 Harvest Lane, Metro City', distanceMiles: 3.5, offsetCarbonGrams: 600, pointsRewarded: 35, visited: false },
    { id: 'spot-4', name: 'E-Waste Organic processing & Battery node', category: 'recycling', address: '900 Industrial Way, Metro City', distanceMiles: 4.8, offsetCarbonGrams: 1000, pointsRewarded: 50, visited: false },
    { id: 'spot-5', name: 'Whole Roots Zero-Waste Organic Market', category: 'organic', address: '14 Plaza Circle, Metro City', distanceMiles: 1.1, offsetCarbonGrams: 300, pointsRewarded: 20, visited: false },
  ]);

  const handleVisit = (id: string, pts: number, carbon: number) => {
    if (visitedMap[id]) return;
    setVisitedMap((prev) => ({ ...prev, [id]: true }));
    onEarnPoints(pts, carbon);
  };

  const filteredSpots = spots.filter(spot => {
    const matchesCat = filter === 'all' || spot.category === filter;
    const matchesSearch = spot.name.toLowerCase().includes(search.toLowerCase()) || 
                          spot.address.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="border-b border-zinc-200/50 dark:border-zinc-800 pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Location Aware Ecosuggestions
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-300 font-light mt-1">
          Detect eco-friendly infrastructures nearby and check in to claim milestones.
        </p>
      </div>

      {/* Info Warning */}
      <div className="p-4 bg-teal-500/5 border border-teal-500/10 rounded-2xl flex items-start gap-3">
        <Info className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
        <p className="text-xs text-zinc-500 dark:text-zinc-300 font-light leading-relaxed">
          Using real-time telemetry simulated location coordinates. Traveling via public rail, biking, or walking to coordinates unlocks active carbon saving indexes. Always verify opening hours before setting out.
        </p>
      </div>

      {/* Filtering Options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search address or station..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-teal-500/20"
          />
          <Search className="absolute left-3 top-3.5 w-3.5 h-3.5 text-zinc-500" />
        </div>

        {/* Categories toggler */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'all', label: 'All spots' },
            { id: 'recycling', label: 'Recycling' },
            { id: 'charging', label: 'EV Station' },
            { id: 'garden', label: 'Urban Garden' },
            { id: 'organic', label: 'Organic shop' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl border text-[11px] font-bold whitespace-nowrap cursor-pointer transition-colors outline-none ${
                filter === cat.id
                  ? 'border-teal-500 bg-teal-500/5 text-teal-600'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
              aria-label={`Filter locations by ${cat.label}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Location Directory items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-300">Nearby Ecological Nodes</h2>

          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
            {filteredSpots.length === 0 ? (
              <p className="text-xs text-zinc-500 dark:text-zinc-300 italic font-light py-8 text-center">No eco locations match select criteria.</p>
            ) : (
              filteredSpots.map((spot) => {
                const isVisited = visitedMap[spot.id];
                return (
                  <Card key={spot.id} className={`p-4 gap-4 flex flex-col justify-between ${isVisited ? 'border border-emerald-500/50 bg-emerald-500/5' : ''}`}>
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase">{spot.category} • {spot.distanceMiles} miles away</span>
                          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-105">{spot.name}</h3>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600 shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                      </div>

                      <p className="text-xs font-light text-zinc-405 dark:text-zinc-300">{spot.address}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/80 mt-2">
                      <div className="text-[11px] font-mono text-emerald-500 font-bold">
                        +{spot.offsetCarbonGrams}g CO₂ | +{spot.pointsRewarded} XP
                      </div>

                      {isVisited ? (
                        <div className="flex items-center gap-1 text-[11px] text-emerald-550 font-bold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Logged visited</span>
                        </div>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="py-1 text-[10px]"
                          onClick={() => handleVisit(spot.id, spot.pointsRewarded, spot.offsetCarbonGrams)}
                          rightIcon={<Navigation className="w-3 h-3" />}
                          aria-label="Check in at this location"
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

        {/* Quick Tips and Simulated Interactive Map placeholder */}
        <div className="space-y-6">
          <Card className="p-5 flex flex-col justify-between h-full bg-gradient-to-br from-zinc-900 to-zinc-950 text-white relative overflow-hidden min-h-[300px]">
            <div className="absolute top-0 right-0 w-44 h-44 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-3 relative z-10">
              <Compass className="w-8 h-8 text-teal-400" />
              <h3 className="text-sm font-bold">Smart Location Routing</h3>
              <p className="text-xs font-light text-zinc-500 leading-relaxed">
                By allowing locations, Carbon Buddy parses regional grid carbon mixtures. For example, charging electric scooters during solar peaks multiplies daily energy offset scores by <strong className="text-teal-400 font-mono">1.3x</strong> automatically.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500 font-mono relative z-10">
              <span>Telemetry Node: Active</span>
              <span>Metro Grid Mix: Clean</span>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
});

