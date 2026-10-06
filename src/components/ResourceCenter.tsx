import { useState, useEffect } from "react";
import { 
  Search, 
  BookOpen, 
  Compass, 
  Shield, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  Info,
  Calendar,
  Sun,
  CloudRain,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Cloud,
  Mountain,
  HeartPulse,
  Users,
  Check,
  MapPin,
  Award,
  Activity,
  ArrowRight
} from "lucide-react";

interface Guide {
  title: string;
  icon: any;
  category: "Comparisons" | "Packing" | "Visas" | "Etiquette";
  summary: string;
  sections: { headline: string; bullets: string[] }[];
}

interface RegionSeasonalData {
  id: string;
  name: string;
  lat: number;
  lon: number;
  elevation: string;
  bestMonths: number[];
  shoulderMonths: number[];
  wetMonths: number[];
  description: string;
  tip: string;
}

const SEASONAL_REGIONS: RegionSeasonalData[] = [
  {
    id: "mt_kenya",
    name: "Mount Kenya Summit",
    lat: -0.1521,
    lon: 37.3084,
    elevation: "3,000m - 4,985m",
    bestMonths: [0, 1, 2, 6, 7, 8], // Jan, Feb, Mar, Jul, Aug, Sep
    shoulderMonths: [5, 9, 11], // Jun, Oct, Dec
    wetMonths: [3, 4, 10], // Apr, May, Nov
    description: "Dry seasons offer clear early mornings for climbing Batian/Nelion and beautiful sunrises at Point Lenana.",
    tip: "July & August are extremely clear but cold. Pack heavy down jackets and warm gloves.",
  },
  {
    id: "nanyuki",
    name: "Nanyuki & Laikipia Conservancies",
    lat: 0.0167,
    lon: 37.0722,
    elevation: "1,900m",
    bestMonths: [0, 1, 2, 5, 6, 7, 8, 9, 11], // Jan, Feb, Mar, Jun, Jul, Aug, Sep, Oct, Dec
    shoulderMonths: [4, 10], // May, Nov
    wetMonths: [3], // Apr
    description: "Laikipia dry months keep animals near watering holes, offering pristine, close-range rhino and predator sightings.",
    tip: "Even in dry seasons, evenings are cool due to altitude. A light fleece is recommended.",
  },
  {
    id: "masai_mara",
    name: "Masai Mara (Kenya Safaris)",
    lat: -1.5292,
    lon: 35.1915,
    elevation: "1,500m",
    bestMonths: [6, 7, 8, 9], // Jul, Aug, Sep, Oct (Great Migration peak)
    shoulderMonths: [0, 1, 11], // Jan, Feb, Dec
    wetMonths: [2, 3, 4, 10], // Mar, Apr, May, Nov (Long and short rains)
    description: "The magnificent Great Wildebeest Migration crosses the Mara River from July through October.",
    tip: "Book at least 6 months in advance for the July-October crossing season.",
  },
  {
    id: "kilimanjaro",
    name: "Mount Kilimanjaro (Tanzania)",
    lat: -3.0674,
    lon: 37.3556,
    elevation: "5,895m Peak",
    bestMonths: [0, 1, 2, 6, 7, 8, 9], // Jan, Feb, Mar, Jul, Aug, Sep, Oct
    shoulderMonths: [5, 11], // Jun, Dec
    wetMonths: [3, 4, 10], // Apr, May, Nov
    description: "Stretches of warm dry days offer excellent acclimatization curves and high summit success rates.",
    tip: "Avoid climbing in April and May when heavy cloud cover reduces visibility to near zero.",
  },
  {
    id: "bwindi",
    name: "Bwindi Gorilla Trekking (Uganda)",
    lat: -1.0478,
    lon: 29.7026,
    elevation: "1,160m - 2,600m",
    bestMonths: [0, 1, 5, 6, 7, 8, 11], // Jan, Feb, Jun, Jul, Aug, Sep, Dec
    shoulderMonths: [4, 9, 10], // May, Oct, Nov
    wetMonths: [2, 3], // Mar, Apr
    description: "Dry months keep forest floors less muddy, facilitating steep slope climbs to encounter mountain gorilla families.",
    tip: "Permits are highly regulated and limited to 8 visitors per gorilla family per day.",
  }
];

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getWeatherLabel = (code: number) => {
  if (code === 0) return "Sunny & Clear";
  if ([1, 2, 3].includes(code)) return "Partly Cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "Rainy";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowing";
  if ([95, 96, 99].includes(code)) return "Thunderstorms";
  return "Cloudy";
};

const GUIDES: Guide[] = [
  {
    title: "Mount Kenya vs. Kilimanjaro Guide",
    icon: Compass,
    category: "Comparisons",
    summary: "A breakdown of East Africa's two largest mountains to help you choose your ideal summit path.",
    sections: [
      {
        headline: "Elevation & Technicality",
        bullets: [
          "Mt. Kilimanjaro (5,895m) is higher, but mostly an uphill hike. Mt. Kenya (Point Lenana 4,985m) is highly scenic and steep.",
          "Mt. Kenya's primary peaks (Nelion and Batian) are technical rock climbing routes, while Point Lenana is a trekking peak."
        ]
      },
      {
        headline: "Crowd Levels & Costs",
        bullets: [
          "Kilimanjaro is heavily commercialized and crowded. Mt. Kenya offers wild, quiet trails where you can hike for hours without seeing others.",
          "Mt. Kenya park fees and guiding are overall 50% more affordable while supporting local Nanyuki community porters directly."
        ]
      }
    ]
  },
  {
    title: "The Ultimate Safari & Climbing Packing List",
    icon: BookOpen,
    category: "Packing",
    summary: "Guiding you on what to pack to remain comfortable under Nanyuki sun and Mt. Kenya freeze.",
    sections: [
      {
        headline: "Essential Mountain Gear",
        bullets: [
          "Thermal Base Layers: High-wicking merino wool or synthetics (avoid cotton completely).",
          "Waterproof Outer Shell: Goretest or similar windbreaker/trousers for freezing rain/snow.",
          "Sturdy Trekking Boots: Broken-in waterproof leather or synthetic boots with deep treads."
        ]
      },
      {
        headline: "Safari Necessities",
        bullets: [
          "Neutral colored clothing (Khaki, brown, olive green) to blend with the bush landscape.",
          "Compact Binoculars: Mandatory for spotting leopards in acacia trees and rare hornbills.",
          "High SPF Eco-friendly sunscreen and DEET insect repellent."
        ]
      }
    ]
  },
  {
    title: "East African Visa & Health Checklist",
    icon: Shield,
    category: "Visas",
    summary: "Crucial travel protocols to keep your entry smooth at Nairobi JKIA and border crossings.",
    sections: [
      {
        headline: "Visa Details",
        bullets: [
          "Kenya Electronic Travel Authorization (eTA): Must be requested online at least 2 weeks before arriving.",
          "East Africa Tourist Visa: A unified $100 visa allowing entry to Kenya, Rwanda, and Uganda continuously."
        ]
      },
      {
        headline: "Medical Requirements",
        bullets: [
          "Yellow Fever Certification: Crucial when crossing between Kenya, Tanzania, and Uganda.",
          "Malaria Prophylaxis: Standard recommendation. Wear long sleeves during morning/evening drives."
        ]
      }
    ]
  },
  {
    title: "Community Etiquette & Swahili Key Vocab",
    icon: HelpCircle,
    category: "Etiquette",
    summary: "Essential phrases and basic community rules to facilitate warm, respectful human exchanges.",
    sections: [
      {
        headline: "Useful Swahili Phrases",
        bullets: [
          "Jambo / Habari: 'Hello' / 'How are you?'",
          "Asante sana: 'Thank you very much' (always appreciated by porters and local hosts).",
          "Pole pole: 'Slowly, slowly' (the golden rule for climbing Mt. Kenya without sickness)."
        ]
      },
      {
        headline: "Local Community Respect",
        bullets: [
          "Ask permission first before taking pictures of Maasai or Samburu individuals or homesteads.",
          "Avoid direct sweet/cash hand-outs to children on trails; support registered village schools instead.",
          "Ask Cool J what community projects he currently supports and how you can directly contribute to local initiatives."
        ]
      }
    ]
  }
];

export default function ResourceCenter() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);

  // Expert Seasonal Advice State
  const [regionalWeather, setRegionalWeather] = useState<Record<string, { temp: number; precipitation: number; weatherCode: number }>>({});
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [isSeasonalOpen, setIsSeasonalOpen] = useState(false);

  // Collapsible Premium Feature States
  const [isRoutesOpen, setIsRoutesOpen] = useState(false);
  const [isPackingOpen, setIsPackingOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isWelfareOpen, setIsWelfareOpen] = useState(false);

  // Interactive Checklist State (Item ID -> Checked)
  const [checkedGears, setCheckedGears] = useState<Record<string, boolean>>({
    // Mountain
    "m_layers": true,
    "m_sleeping": false,
    "m_boots": true,
    "m_hardshell": false,
    "m_socks": true,
    "m_goggles": false,
    // Safari
    "s_fleece": true,
    "s_binoculars": false,
    "s_sunscreen": true,
    "s_neutral": true,
    // Bwindi
    "b_gaiters": false,
    "b_gloves": true,
    "b_repellent": true
  });

  const toggleGear = (id: string) => {
    setCheckedGears(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    const fetchSeasonalWeather = async () => {
      try {
        setLoadingWeather(true);
        setWeatherError(null);
        
        const fetches = SEASONAL_REGIONS.map(async (reg) => {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${reg.lat}&longitude=${reg.lon}&current=temperature_2m,precipitation,weather_code`);
          if (!res.ok) throw new Error(`Fetch failed for ${reg.name}`);
          const data = await res.json();
          return {
            id: reg.id,
            temp: Math.round(data.current.temperature_2m),
            precipitation: data.current.precipitation || 0,
            weatherCode: data.current.weather_code,
          };
        });

        const results = await Promise.all(fetches);
        const weatherMap: Record<string, { temp: number; precipitation: number; weatherCode: number }> = {};
        results.forEach((r) => {
          weatherMap[r.id] = r;
        });
        setRegionalWeather(weatherMap);
      } catch (err: any) {
        console.error("Error loading seasonal weather:", err);
        setWeatherError("Regional telemetry unavailable. Displaying historical dry season defaults.");
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchSeasonalWeather();
  }, []);

  const categories = ["All", "Comparisons", "Packing", "Visas", "Etiquette"];

  const filteredGuides = GUIDES.filter((guide) => {
    const matchesCategory = activeCategory === "All" || guide.category === activeCategory;
    const matchesSearch =
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.sections.some((s) => s.headline.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#FAF8F5] py-16 px-4 sm:px-6 lg:px-8 border-t border-[#E8DFD3]" id="resources">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C9A24A]">GUIDES & WISDOM</span>
          <h2 className="text-3xl font-serif text-[#0b3d2e] mt-2 font-bold select-none leading-tight">
            Expedition Resource Center
          </h2>
          <p className="text-sm text-gray-600 mt-2 max-w-2xl mx-auto">
            Decades of guiding secrets packed in simple checklists. Filter guides or search below to pack, prepare, and behave like a seasoned explorer.
          </p>
        </div>

        {/* Controls Layout */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search gear checklists, visas, Swahili terms..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E0D8CC] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A24A] text-[#1a1a1a]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="resource-search-input"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeCategory === cat
                    ? "bg-[#0b3d2e] text-white"
                    : "bg-white text-[#0b3d2e] border border-[#E0D8CC] hover:bg-[#F0EAE1]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Guides Rendering */}
        {filteredGuides.length > 0 ? (
          <div className="space-y-4">
            {filteredGuides.map((guide, idx) => {
              const IconComp = guide.icon;
              const isExpanded = expandedGuide === guide.title;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-[#E2D9CC] shadow-sm overflow-hidden hover:border-[#C9A24A] transition-all"
                >
                  <button
                    onClick={() => setExpandedGuide(isExpanded ? null : guide.title)}
                    className="w-full text-left p-6 flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-[#F3ECE0] flex items-center justify-center text-[#0b3d2e] flex-shrink-0">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="inline-block bg-[#F4EDE2] text-[#0b3d2e] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                          {guide.category}
                        </span>
                        <h3 className="text-lg font-bold text-[#0b3d2e]">{guide.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{guide.summary}</p>
                      </div>
                    </div>
                    <div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400 mt-1" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400 mt-1" />
                      )}
                    </div>
                  </button>

                  {/* Expand container */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-[#F2ECE2] bg-[#FCFBF8] animate-fadeIn">
                      <div className="grid md:grid-cols-2 gap-6 mt-4">
                        {guide.sections.map((sect, sIdx) => (
                          <div key={sIdx} className="space-y-3">
                            <h4 className="text-sm font-bold text-[#C9A24A] border-b border-[#F2ECE2] pb-1 uppercase tracking-wider">
                              {sect.headline}
                            </h4>
                            <ul className="space-y-2">
                              {sect.bullets.map((bullet, bIdx) => (
                                <li key={bIdx} className="flex gap-2.5 items-start text-xs text-gray-700 leading-relaxed">
                                  <CheckCircle className="h-4 w-4 text-[#0b3d2e] flex-shrink-0 mt-0.5" />
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex gap-2">
                        <Info className="h-4 w-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-emerald-800">
                          Need some specific advice or custom gear loan recommendations? Let Cool J know when filling out your itinerary request!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-8 text-center rounded-xl border border-[#E2D9CC] text-gray-500">
            No guides found matching your filters. Try a different category or search keyword.
          </div>
        )}

        {/* EXPERT SEASONAL ADVICE SECTION */}
        <div className="mt-16 pt-16 border-t border-[#E8DFD3]">
          <button
            type="button"
            onClick={() => setIsSeasonalOpen(!isSeasonalOpen)}
            className="w-full text-left bg-[#FAF8F5] hover:bg-[#F5EFE6] border border-[#E2D9CC] rounded-2xl p-6 sm:p-8 transition-all duration-200 shadow-sm hover:shadow group focus:outline-none focus:ring-2 focus:ring-[#0b3d2e]/30 flex flex-col sm:flex-row items-center justify-between gap-6 cursor-pointer"
          >
            <div className="space-y-1.5 flex-1 text-center sm:text-left">
              <span className="text-xs uppercase tracking-widest font-extrabold text-[#C9A24A]">CLIMATE FORESIGHT</span>
              <h3 className="text-xl sm:text-2xl font-serif text-[#0b3d2e] font-bold leading-tight flex flex-wrap items-center justify-center sm:justify-start gap-2">
                Expert Seasonal Advice & Optimal Months
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-100 text-[#0b3d2e] border border-emerald-200 font-bold">
                  {isSeasonalOpen ? "Expanded" : "Tap to Open"}
                </span>
              </h3>
              <p className="text-xs text-gray-500 max-w-xl leading-normal">
                Live telemetry matched with historical high-season cycles to guide your custom expedition booking dates. Click to {isSeasonalOpen ? "hide" : "reveal"} regional dry months.
              </p>
            </div>
            <div className="shrink-0 h-10 w-10 rounded-full bg-white border border-[#E2D9CC] flex items-center justify-center text-[#0b3d2e] group-hover:bg-[#0b3d2e] group-hover:text-white transition-all duration-200 shadow-sm">
              {isSeasonalOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </button>

          {isSeasonalOpen && (
            <div className="mt-8 space-y-6 animate-fadeIn">
              {weatherError && (
                <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl flex gap-2 text-amber-900 text-xs items-center">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                  <span>{weatherError}</span>
                </div>
              )}

              <div className="space-y-6">
                {SEASONAL_REGIONS.map((region) => {
                  const weather = regionalWeather[region.id];
                  const currentMonthIdx = new Date().getMonth(); // 0-11
                  
                  // Determine dynamic advice based on current live weather
                  let liveAdvice = "Analyzing local atmospheric models...";
                  let isLiveDry = true;
                  if (weather) {
                    if (weather.precipitation > 2.0) {
                      isLiveDry = false;
                      liveAdvice = `Currently rainy (${weather.precipitation}mm). Ensure premium stormproofing is chosen when coordinating gears. High-altitude trails may have mud or wet slate layers.`;
                    } else if (weather.temp < 5 && region.id === "mt_kenya") {
                      liveAdvice = `Intense freeze warning (${weather.temp}°C) near upper alpine regions. Ice spikes and sub-zero rated sleeping sleeping bags mandatory.`;
                    } else {
                      liveAdvice = `Currently clear and dry (${weather.temp}°C). Optimal route visibility and animal gathering patterns active on game drives right now!`;
                    }
                  } else if (loadingWeather) {
                    liveAdvice = "Synchronizing satellite coordinates...";
                  } else {
                    liveAdvice = "Dry season patterns standard for this month.";
                  }

                  return (
                    <div key={region.id} className="bg-white rounded-2xl border border-[#E2D9CC] p-5 sm:p-6 shadow-sm space-y-4">
                      {/* Top Header Row */}
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h4 className="text-base sm:text-lg font-black text-[#0b3d2e] font-serif">{region.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] bg-[#FAF6F0] text-gray-500 font-mono px-2 py-0.5 rounded border border-[#EADFCF]">
                              Elev: {region.elevation}
                            </span>
                            {weather ? (
                              <span className="text-[10px] font-bold text-gray-500 font-sans flex items-center gap-1">
                                <Sun className="h-3 w-3 text-[#C9A24A]" />
                                {weather.temp}°C • {getWeatherLabel(weather.weatherCode)}
                              </span>
                            ) : loadingWeather ? (
                              <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1.5">
                                <RefreshCw className="h-2.5 w-2.5 animate-spin text-[#C9A24A]" />
                                Syncing live sat-feed...
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Optimal Travel Window</span>
                          <span className="text-xs font-extrabold text-[#0b3d2e] bg-[#EAF5F1] border border-[#C5E3D5] px-2.5 py-1 rounded-lg inline-block mt-1">
                            {region.bestMonths.map(m => MONTH_NAMES[m]).join(", ")}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-xs text-gray-600 leading-relaxed font-medium">
                        {region.description}
                      </p>

                      {/* 12-Month Bar Visualizer */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">
                          <span>Seasonal Cycle Calendar:</span>
                          <div className="flex gap-2.5">
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Peak Dry</span>
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-400"></span> Shoulder</span>
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-400"></span> Rainy</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-12 gap-1.5 bg-[#FAF8F5] p-2 rounded-xl border border-[#EEE8DF]">
                          {MONTH_NAMES.map((month, idx) => {
                            const isBest = region.bestMonths.includes(idx);
                            const isShoulder = region.shoulderMonths.includes(idx);
                            const isCurrent = currentMonthIdx === idx;

                            let bgClass = "bg-blue-50 text-blue-800 border-blue-200/40"; // wet
                            if (isBest) bgClass = "bg-emerald-50 text-emerald-900 border-emerald-200";
                            else if (isShoulder) bgClass = "bg-amber-50 text-amber-900 border-amber-200";

                            return (
                              <div 
                                key={month} 
                                className={`relative text-center py-2 px-0.5 rounded text-[10px] font-black uppercase tracking-wider border transition-all ${bgClass} ${
                                  isCurrent ? "ring-2 ring-[#0b3d2e] ring-offset-1" : ""
                                }`}
                                title={`${month}: ${isBest ? "Optimal Dry Season" : isShoulder ? "Shoulder Transition" : "Low Rainy Season"}`}
                              >
                                {month}
                                {isCurrent && (
                                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Live Atmospheric Guidance & Pro Tip */}
                      <div className="grid sm:grid-cols-2 gap-3 pt-1">
                        <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EEE8DF] flex gap-2">
                          <Compass className="h-4 w-4 text-[#C9A24A] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[9px] font-extrabold text-[#C9A24A] uppercase tracking-wider block">Live Guide Climate Advice:</span>
                            <p className="text-[10px] text-gray-600 mt-0.5 font-medium leading-normal">{liveAdvice}</p>
                          </div>
                        </div>

                        <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[9px] font-extrabold text-emerald-700 uppercase tracking-wider block">Guiding Team Insider Tip:</span>
                            <p className="text-[10px] text-emerald-900 mt-0.5 leading-normal font-medium">{region.tip}</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* MOUNT KENYA CLIMBING ROUTES */}
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setIsRoutesOpen(!isRoutesOpen)}
            className="w-full text-left bg-[#FAF8F5] hover:bg-[#F5EFE6] border border-[#E2D9CC] rounded-2xl p-6 sm:p-8 transition-all duration-200 shadow-sm hover:shadow group focus:outline-none focus:ring-2 focus:ring-[#0b3d2e]/30 flex flex-col sm:flex-row items-center justify-between gap-6 cursor-pointer"
          >
            <div className="space-y-1.5 flex-1 text-center sm:text-left">
              <span className="text-xs uppercase tracking-widest font-extrabold text-[#C9A24A]">EXPLORATION ROUTES</span>
              <h3 className="text-xl sm:text-2xl font-serif text-[#0b3d2e] font-bold leading-tight flex flex-wrap items-center justify-center sm:justify-start gap-2">
                Mount Kenya Summit Routes Compared
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-100 text-[#0b3d2e] border border-emerald-200 font-bold">
                  {isRoutesOpen ? "Expanded" : "Tap to Open"}
                </span>
              </h3>
              <p className="text-xs text-gray-500 max-w-xl leading-normal">
                Comprehensive breakdown of the 5 official routes ascending Point Lenana, Batian, and Nelion.
              </p>
            </div>
            <div className="shrink-0 h-10 w-10 rounded-full bg-white border border-[#E2D9CC] flex items-center justify-center text-[#0b3d2e] group-hover:bg-[#0b3d2e] group-hover:text-white transition-all duration-200 shadow-sm">
              {isRoutesOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </button>

          {isRoutesOpen && (
            <div className="mt-6 space-y-6 animate-fadeIn bg-white rounded-2xl border border-[#E2D9CC] p-5 sm:p-8 shadow-sm">
              <div className="space-y-4">
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Mount Kenya offers some of the most spectacular high-altitude trekking in the world. Choose your route based on your conditioning, acclimatization preference, and scenic desires:
                </p>

                <div className="grid gap-6">
                  {/* Sirimon Route */}
                  <div className="border border-[#EEE8DF] rounded-xl p-5 bg-[#FAF8F5]/30 hover:border-[#C9A24A]/40 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EEE8DF] pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <h4 className="font-bold text-[#0b3d2e] font-serif text-base">Sirimon Route (North-West Ascent)</h4>
                      </div>
                      <div className="flex gap-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded">4-5 Days</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded">Easy-Moderate</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-normal mb-3">
                      The most popular and scenic dry-weather trail. It provides a highly gradual ascent curve through spectacular yellowwood forests, high alpine heaths, and dry river valleys.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="font-bold text-[#0b3d2e] uppercase tracking-wider text-[9px] block">Key Camp Highlights:</span>
                        <span className="text-gray-500">Old Moses Camp (3,300m) & Shipton's Camp (4,200m)</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#0b3d2e] uppercase tracking-wider text-[9px] block">Guiding Team Verdict:</span>
                        <span className="text-emerald-800 font-semibold">Best for beginners and high summit success rate.</span>
                      </div>
                    </div>
                  </div>

                  {/* Chogoria Route */}
                  <div className="border border-[#EEE8DF] rounded-xl p-5 bg-[#FAF8F5]/30 hover:border-[#C9A24A]/40 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EEE8DF] pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <h4 className="font-bold text-[#0b3d2e] font-serif text-base">Chogoria Route (Eastern Scenic Descent)</h4>
                      </div>
                      <div className="flex gap-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded">5-6 Days</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 border border-emerald-300 text-emerald-900 px-2 py-0.5 rounded">Moderate</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-normal mb-3">
                      Hands-down the most visually breathtaking trail on the mountain. Stretches past the spectacular Gorges Valley, Temple Cliff sheer drop-offs, and the incredible deep blue of Lake Michaelson.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="font-bold text-[#0b3d2e] uppercase tracking-wider text-[9px] block">Scenic Highlights:</span>
                        <span className="text-gray-500">Nithi Falls, Lake Ellis (3,450m), Lake Michaelson (4,000m)</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#0b3d2e] uppercase tracking-wider text-[9px] block">Guiding Team Verdict:</span>
                        <span className="text-emerald-800 font-semibold">Stunning landscapes; perfect as a scenic descent path.</span>
                      </div>
                    </div>
                  </div>

                  {/* Naro Moru Route */}
                  <div className="border border-[#EEE8DF] rounded-xl p-5 bg-[#FAF8F5]/30 hover:border-[#C9A24A]/40 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EEE8DF] pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                        <h4 className="font-bold text-[#0b3d2e] font-serif text-base">Naro Moru Route (Direct Western Ascent)</h4>
                      </div>
                      <div className="flex gap-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded">3-4 Days</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-red-50 border border-red-200 text-red-800 px-2 py-0.5 rounded">Challenging</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-normal mb-3">
                      The fastest, most direct route to the peak area. Famous for testing climbers with the 'Vertical Bog'—a steep, water-logged mud section—and rapid altitude increases.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="font-bold text-[#0b3d2e] uppercase tracking-wider text-[9px] block">Key Terrain Features:</span>
                        <span className="text-gray-500">Met Station (3,050m), Vertical Bog, Austrian Hut (4,790m)</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#0b3d2e] uppercase tracking-wider text-[9px] block">Guiding Team Verdict:</span>
                        <span className="text-amber-800 font-semibold">Demands solid physical fitness and fast acclimatizers.</span>
                      </div>
                    </div>
                  </div>

                  {/* Burguret Route */}
                  <div className="border border-[#EEE8DF] rounded-xl p-5 bg-[#FAF8F5]/30 hover:border-[#C9A24A]/40 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EEE8DF] pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                        <h4 className="font-bold text-[#0b3d2e] font-serif text-base">Burguret Route (Wilderness Trail)</h4>
                      </div>
                      <div className="flex gap-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded">5-6 Days</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-red-50 border border-red-200 text-red-800 px-2 py-0.5 rounded">Difficult</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-normal mb-3">
                      An untamed, rarely traveled trail starting near Gathiuru forest. Walk through ancient bamboo tunnels where elephants and forest hogs are common. No crowds whatsoever.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="font-bold text-[#0b3d2e] uppercase tracking-wider text-[9px] block">Wilderness Details:</span>
                        <span className="text-gray-500">Giant Bamboo tunnels, Highland Castle peak caves (3,700m)</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#0b3d2e] uppercase tracking-wider text-[9px] block">Guiding Team Verdict:</span>
                        <span className="text-red-800 font-semibold">Perfect for explorers who want true off-the-grid isolation.</span>
                      </div>
                    </div>
                  </div>

                  {/* Kamweti Route */}
                  <div className="border border-[#EEE8DF] rounded-xl p-5 bg-[#FAF8F5]/30 hover:border-[#C9A24A]/40 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EEE8DF] pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-600"></span>
                        <h4 className="font-bold text-[#0b3d2e] font-serif text-base">Kamweti Route (Ancient Elephant Track)</h4>
                      </div>
                      <div className="flex gap-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-100 border border-amber-300 text-amber-900 px-2 py-0.5 rounded">6-7 Days</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-red-100 border border-red-300 text-red-900 px-2 py-0.5 rounded">Extreme</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-normal mb-3">
                      The most challenging route ascending from the southern, rain-dense slopes of the mountain. Requires trail clearing with machetes and KWS armed rangers due to dense high-canopy wildlife activity.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="font-bold text-[#0b3d2e] uppercase tracking-wider text-[9px] block">Safety Protocol:</span>
                        <span className="text-gray-500">Armed wildlife rangers and experienced forest pathfinders mandatory.</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#0b3d2e] uppercase tracking-wider text-[9px] block">Guiding Team Verdict:</span>
                        <span className="text-red-900 font-semibold">Extreme wilderness exploration for experienced hikers only.</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>

        {/* INTERACTIVE PACKING CHECKLIST & GEAR RENTALS */}
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setIsPackingOpen(!isPackingOpen)}
            className="w-full text-left bg-[#FAF8F5] hover:bg-[#F5EFE6] border border-[#E2D9CC] rounded-2xl p-6 sm:p-8 transition-all duration-200 shadow-sm hover:shadow group focus:outline-none focus:ring-2 focus:ring-[#0b3d2e]/30 flex flex-col sm:flex-row items-center justify-between gap-6 cursor-pointer"
          >
            <div className="space-y-1.5 flex-1 text-center sm:text-left">
              <span className="text-xs uppercase tracking-widest font-extrabold text-[#C9A24A]">GEAR CHECKLIST</span>
              <h3 className="text-xl sm:text-2xl font-serif text-[#0b3d2e] font-bold leading-tight flex flex-wrap items-center justify-center sm:justify-start gap-2">
                Interactive Packing List & Gear Rentals
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-100 text-[#0b3d2e] border border-emerald-200 font-bold">
                  {isPackingOpen ? "Expanded" : "Tap to Open"}
                </span>
              </h3>
              <p className="text-xs text-gray-500 max-w-xl leading-normal">
                Check off what you have and see what you can rent directly at our Nanyuki base station. Save heavy luggage costs!
              </p>
            </div>
            <div className="shrink-0 h-10 w-10 rounded-full bg-white border border-[#E2D9CC] flex items-center justify-center text-[#0b3d2e] group-hover:bg-[#0b3d2e] group-hover:text-white transition-all duration-200 shadow-sm">
              {isPackingOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </button>

          {isPackingOpen && (
            <div className="mt-6 space-y-6 animate-fadeIn bg-white rounded-2xl border border-[#E2D9CC] p-5 sm:p-8 shadow-sm">
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Mountain Summit Column */}
                <div className="space-y-4">
                  <div className="border-b border-[#EEE8DF] pb-2">
                    <h4 className="font-bold text-[#0b3d2e] text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Mountain className="h-4 w-4 text-[#C9A24A]" /> Mount Kenya Summit
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {[
                      { id: "m_layers", label: "Merino Wool Base Layers", rent: false },
                      { id: "m_sleeping", label: "-15°C Down Sleeping Bag", rent: true },
                      { id: "m_boots", label: "Sturdy Waterproof Trail Boots", rent: false },
                      { id: "m_hardshell", label: "Gore-Tex Hardshell Jacket", rent: true },
                      { id: "m_socks", label: "Thick Thermal Hiking Socks", rent: false },
                      { id: "m_goggles", label: "Heavy Alpine Down Parka", rent: true },
                    ].map((item) => (
                      <div key={item.id} className="flex items-start justify-between gap-2 p-1.5 hover:bg-[#FAF8F5] rounded transition-colors text-xs">
                        <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-gray-700 flex-1">
                          <input 
                            type="checkbox" 
                            checked={!!checkedGears[item.id]} 
                            onChange={() => toggleGear(item.id)}
                            className="rounded text-[#0b3d2e] focus:ring-[#0b3d2e] border-[#E2D9CC] h-3.5 w-3.5"
                          />
                          <span className={checkedGears[item.id] ? "line-through text-gray-400" : ""}>{item.label}</span>
                        </label>
                        {item.rent && (
                          <span className="text-[8px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded shadow-sm shrink-0">
                            Hirable
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safari Column */}
                <div className="space-y-4">
                  <div className="border-b border-[#EEE8DF] pb-2">
                    <h4 className="font-bold text-[#0b3d2e] text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Sun className="h-4 w-4 text-[#C9A24A]" /> Laikipia Safari Gear
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {[
                      { id: "s_fleece", label: "Light fleece or windbreaker", rent: false },
                      { id: "s_binoculars", label: "High-spec Binoculars", rent: true },
                      { id: "s_sunscreen", label: "Eco-friendly sunscreen (SPF 50+)", rent: false },
                      { id: "s_neutral", label: "Neutral color trail clothing", rent: false },
                    ].map((item) => (
                      <div key={item.id} className="flex items-start justify-between gap-2 p-1.5 hover:bg-[#FAF8F5] rounded transition-colors text-xs">
                        <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-gray-700 flex-1">
                          <input 
                            type="checkbox" 
                            checked={!!checkedGears[item.id]} 
                            onChange={() => toggleGear(item.id)}
                            className="rounded text-[#0b3d2e] focus:ring-[#0b3d2e] border-[#E2D9CC] h-3.5 w-3.5"
                          />
                          <span className={checkedGears[item.id] ? "line-through text-gray-400" : ""}>{item.label}</span>
                        </label>
                        {item.rent && (
                          <span className="text-[8px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded shadow-sm shrink-0">
                            Hirable
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bwindi Gorilla trekking Column */}
                <div className="space-y-4">
                  <div className="border-b border-[#EEE8DF] pb-2">
                    <h4 className="font-bold text-[#0b3d2e] text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="h-4 w-4 text-[#C9A24A]" /> Gorilla Forest Trekking
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {[
                      { id: "b_gaiters", label: "Waterproof protective gaiters", rent: true },
                      { id: "b_gloves", label: "Thick trekking gloves", rent: false },
                      { id: "b_repellent", label: "DEET insect repellent spray", rent: false },
                    ].map((item) => (
                      <div key={item.id} className="flex items-start justify-between gap-2 p-1.5 hover:bg-[#FAF8F5] rounded transition-colors text-xs">
                        <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-gray-700 flex-1">
                          <input 
                            type="checkbox" 
                            checked={!!checkedGears[item.id]} 
                            onChange={() => toggleGear(item.id)}
                            className="rounded text-[#0b3d2e] focus:ring-[#0b3d2e] border-[#E2D9CC] h-3.5 w-3.5"
                          />
                          <span className={checkedGears[item.id] ? "line-through text-gray-400" : ""}>{item.label}</span>
                        </label>
                        {item.rent && (
                          <span className="text-[8px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded shadow-sm shrink-0">
                            Hirable
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EEE8DF] flex gap-2.5">
                <Info className="h-4 w-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                  💡 <strong className="text-[#0b3d2e]">Save Luggage Charges:</strong> Our Nanyuki base holds fully washed, sterilized, and premium mountaineering equipment (e.g. high-altitude sleeping bags, heavy down jackets, walking sticks). Simply tell your guide when checking in to secure rental gear in your size!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* MEDICAL SAFETY & ACCLIMATIZATION PROTOCOL */}
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setIsSafetyOpen(!isSafetyOpen)}
            className="w-full text-left bg-[#FAF8F5] hover:bg-[#F5EFE6] border border-[#E2D9CC] rounded-2xl p-6 sm:p-8 transition-all duration-200 shadow-sm hover:shadow group focus:outline-none focus:ring-2 focus:ring-[#0b3d2e]/30 flex flex-col sm:flex-row items-center justify-between gap-6 cursor-pointer"
          >
            <div className="space-y-1.5 flex-1 text-center sm:text-left">
              <span className="text-xs uppercase tracking-widest font-extrabold text-[#C9A24A]">SAFETY STANDARDS</span>
              <h3 className="text-xl sm:text-2xl font-serif text-[#0b3d2e] font-bold leading-tight flex flex-wrap items-center justify-center sm:justify-start gap-2">
                Altitude Acclimatization & Safety Protocol
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-100 text-[#0b3d2e] border border-emerald-200 font-bold">
                  {isSafetyOpen ? "Expanded" : "Tap to Open"}
                </span>
              </h3>
              <p className="text-xs text-gray-500 max-w-xl leading-normal">
                Learn how our Wilderness First Responder guides monitor blood oxygen, pacing, and provide emergency airlift cover.
              </p>
            </div>
            <div className="shrink-0 h-10 w-10 rounded-full bg-white border border-[#E2D9CC] flex items-center justify-center text-[#0b3d2e] group-hover:bg-[#0b3d2e] group-hover:text-white transition-all duration-200 shadow-sm">
              {isSafetyOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </button>

          {isSafetyOpen && (
            <div className="mt-6 space-y-6 animate-fadeIn bg-white rounded-2xl border border-[#E2D9CC] p-5 sm:p-8 shadow-sm">
              <div className="grid sm:grid-cols-2 gap-6">
                
                <div className="space-y-3.5">
                  <div className="flex gap-2">
                    <HeartPulse className="h-5 w-5 text-[#C9A24A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-[#0b3d2e] text-sm">Twice-Daily Pulse Oximeter Tracking</h4>
                      <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed font-medium">
                        Every morning and evening at camp, your lead guide measures your blood-oxygen saturation level (SpO2) and resting pulse rate. If levels drop below critical thresholds, we modify climbing pacing immediately.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Activity className="h-5 w-5 text-[#C9A24A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-[#0b3d2e] text-sm">Strict 'Pole Pole' Acclimatization Pacing</h4>
                      <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed font-medium">
                        We practice the golden alpine rule: <em>climb high, sleep low</em>. All routes are mapped at a measured, highly conservative ascent rate of under 500 meters of sleeping elevation gain per 24 hours once above 3,000 meters.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="flex gap-2">
                    <Shield className="h-5 w-5 text-[#C9A24A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-[#0b3d2e] text-sm">AMREF Flying Doctors Heli Evac Coverage</h4>
                      <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed font-medium">
                        All expedition participants are automatically registered with AMREF Flying Doctors. In the rare event of extreme mountain emergency or acute pulmonary edema, a designated rescue helicopter is dispatched directly to high alpine helipads.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <AlertTriangle className="h-5 w-5 text-[#C9A24A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-[#0b3d2e] text-sm">Oxygen Kits & Wilderness First Aid Kits</h4>
                      <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed font-medium">
                        We carry compressed medical oxygen tanks, state-of-the-art wilderness trauma kits, and carry a full supply of emergency high-altitude medications (such as Diamox and dexamethasone) on all climbs.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* PORTER & GUIDE ETHICAL WELFARE COMMITMENT */}
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setIsWelfareOpen(!isWelfareOpen)}
            className="w-full text-left bg-[#FAF8F5] hover:bg-[#F5EFE6] border border-[#E2D9CC] rounded-2xl p-6 sm:p-8 transition-all duration-200 shadow-sm hover:shadow group focus:outline-none focus:ring-2 focus:ring-[#0b3d2e]/30 flex flex-col sm:flex-row items-center justify-between gap-6 cursor-pointer"
          >
            <div className="space-y-1.5 flex-1 text-center sm:text-left">
              <span className="text-xs uppercase tracking-widest font-extrabold text-[#C9A24A]">ETHICAL TRAVEL</span>
              <h3 className="text-xl sm:text-2xl font-serif text-[#0b3d2e] font-bold leading-tight flex flex-wrap items-center justify-center sm:justify-start gap-2">
                Porter & Guide Ethical Welfare Commitment
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-100 text-[#0b3d2e] border border-emerald-200 font-bold">
                  {isWelfareOpen ? "Expanded" : "Tap to Open"}
                </span>
              </h3>
              <p className="text-xs text-gray-500 max-w-xl leading-normal">
                Discover how we ensure direct fair wages, strict load weight limits, and hot nutritious meals for our incredible local porters.
              </p>
            </div>
            <div className="shrink-0 h-10 w-10 rounded-full bg-white border border-[#E2D9CC] flex items-center justify-center text-[#0b3d2e] group-hover:bg-[#0b3d2e] group-hover:text-white transition-all duration-200 shadow-sm">
              {isWelfareOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </button>

          {isWelfareOpen && (
            <div className="mt-6 space-y-6 animate-fadeIn bg-white rounded-2xl border border-[#E2D9CC] p-5 sm:p-8 shadow-sm">
              <div className="grid sm:grid-cols-2 gap-6">
                
                <div className="space-y-3.5">
                  <div className="flex gap-2">
                    <Users className="h-5 w-5 text-[#C9A24A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-[#0b3d2e] text-sm">Direct Fair Wage Guarantees</h4>
                      <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed font-medium">
                        We bypass greedy intermediate agencies and pay wages directly to our registered Porter Association accounts. Our crew is compensated 35% above average market rates, providing direct uplift to families in Nanyuki.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-[#C9A24A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-[#0b3d2e] text-sm">Strict 15kg Porter Load Limits</h4>
                      <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed font-medium">
                        To protect the safety and long-term health of our crew, we strictly enforce a 15kg load limit per porter. We weigh all guest gear bags at the National Park gates with digital scales.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="flex gap-2">
                    <Award className="h-5 w-5 text-[#C9A24A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-[#0b3d2e] text-sm">Three Nutritious Warm Meals Daily</h4>
                      <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed font-medium">
                        Unlike bargain tour operators that feed porters cheap leftover flour, our porters eat the exact same high-energy, protein-rich warm meals that our guests enjoy on the trail.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Compass className="h-5 w-5 text-[#C9A24A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-[#0b3d2e] text-sm">Quality Insulated Shelter & Sleeping Gear</h4>
                      <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed font-medium">
                        We provide windproof, high-quality mountain domes, sleeping mats, and warm insulation gear for all porters to ensure restful, safe sleeping during freezing alpine nights.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Section Call To Action */}
        <div className="mt-12 bg-gradient-to-r from-[#FAF6EE] to-[#F3ECE0] rounded-2xl p-6 sm:p-8 border border-[#E0D4C3] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#8F5C38] font-bold block mb-1">
              EXPEDITION PREPARATION COMPLETE
            </span>
            <h4 className="text-xl sm:text-2xl font-serif font-black text-[#0b3d2e]">
              Ready to apply your knowledge to a tailored expedition?
            </h4>
            <p className="text-xs text-gray-600 mt-1 max-w-xl">
              Select your group size, target mountain peaks or wildlife sanctuaries, and get an instant custom quote.
            </p>
          </div>
          <a
            href="#builder"
            className="shrink-0 inline-flex items-center gap-2 bg-[#0b3d2e] hover:bg-[#06241c] text-[#C9A24A] font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-xl transition-all border border-[#C9A24A]"
          >
            <span>Draft My Adventure</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

      </div>
    </div>
  );
}
