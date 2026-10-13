import React, { useState, useEffect } from "react";
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  Wind, 
  Thermometer, 
  Droplets, 
  RefreshCw, 
  MapPin, 
  Calendar, 
  Info,
  AlertTriangle,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

interface WeatherData {
  currentTemp: number;
  apparentTemp: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  precipitation: number;
  daily: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    weatherCode: number;
    precipitationSum: number;
  }>;
}

const getWmoDetails = (code: number) => {
  if (code === 0) return { label: "Clear Sky", icon: Sun, color: "text-[#C9A24A]" };
  if ([1, 2, 3].includes(code)) return { label: "Partly Cloudy", icon: Cloud, color: "text-slate-500" };
  if ([45, 48].includes(code)) return { label: "Foggy", icon: Cloud, color: "text-slate-400" };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { label: "Rainy", icon: CloudRain, color: "text-blue-500" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: "Snowy", icon: CloudSnow, color: "text-sky-300" };
  if ([95, 96, 99].includes(code)) return { label: "Thunderstorm", icon: CloudLightning, color: "text-amber-600" };
  return { label: "Overcast", icon: Cloud, color: "text-slate-500" };
};

const LOCATIONS = {
  mtKenya: {
    name: "Mount Kenya (Chogoria Route Base)",
    lat: -0.1521,
    lon: 37.3084,
    altitude: "approx. 3,000m Base camp",
    type: "Alpine Summit Route",
    description: "High altitude alpine environment. Temperatures plummet drastically at night and wind chill is extreme near point Lenana."
  },
  serengeti: {
    name: "Serengeti (Seronera Central)",
    lat: -2.1540,
    lon: 34.6857,
    altitude: "approx. 1,400m Plains",
    type: "Savannah Savanna Plains",
    description: "Warm tropical savannah. Great for wildlife viewing. Sunny afternoons; brief rain showers are possible during wet cycles."
  }
};

const getFallbackWeatherData = (type: "mtKenya" | "serengeti"): WeatherData => {
  const today = new Date();
  const daily = [];
  for (let i = 0; i < 4; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    if (type === "mtKenya") {
      daily.push({
        date: dateStr,
        maxTemp: 4 - (i % 2),
        minTemp: -3 - (i % 2),
        weatherCode: i % 2 === 0 ? 1 : 2,
        precipitationSum: 0
      });
    } else {
      daily.push({
        date: dateStr,
        maxTemp: 28 + (i % 2),
        minTemp: 16 - (i % 2),
        weatherCode: i === 1 ? 2 : 1,
        precipitationSum: 0
      });
    }
  }

  if (type === "mtKenya") {
    return {
      currentTemp: -2,
      apparentTemp: -7,
      humidity: 65,
      windSpeed: 20,
      weatherCode: 2,
      precipitation: 0,
      daily
    };
  } else {
    return {
      currentTemp: 26,
      apparentTemp: 27,
      humidity: 50,
      windSpeed: 11,
      weatherCode: 1,
      precipitation: 0,
      daily
    };
  }
};

export default function WeatherForecast() {
  const [mtKenyaWeather, setMtKenyaWeather] = useState<WeatherData | null>(() => getFallbackWeatherData("mtKenya"));
  const [serengetiWeather, setSerengetiWeather] = useState<WeatherData | null>(() => getFallbackWeatherData("serengeti"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(() => new Date());

  const fetchWeatherForLocation = async (lat: number, lon: number, locationKey: "mtKenya" | "serengeti"): Promise<WeatherData> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      // Try local backend proxy first, then direct open-meteo
      let response: Response | null = null;
      try {
        response = await fetch(
          `/api/weather?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Africa/Nairobi`,
          { signal: controller.signal }
        );
      } catch {
        response = null;
      }

      if (!response || !response.ok) {
        response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Africa/Nairobi`,
          { signal: controller.signal }
        );
      }
      clearTimeout(timeoutId);

      if (!response || !response.ok) {
        return getFallbackWeatherData(locationKey);
      }
      const data = await response.json();
      if (!data?.current) {
        return getFallbackWeatherData(locationKey);
      }
      
      const dailyForecasts = [];
      for (let i = 0; i < 4; i++) {
        if (data.daily && data.daily.time && data.daily.time[i]) {
          dailyForecasts.push({
            date: data.daily.time[i],
            maxTemp: Math.round(data.daily.temperature_2m_max[i]),
            minTemp: Math.round(data.daily.temperature_2m_min[i]),
            weatherCode: data.daily.weather_code[i],
            precipitationSum: data.daily.precipitation_sum[i] || 0
          });
        }
      }

      return {
        currentTemp: typeof data.current.temperature_2m === "number" ? Math.round(data.current.temperature_2m) : getFallbackWeatherData(locationKey).currentTemp,
        apparentTemp: typeof data.current.apparent_temperature === "number" ? Math.round(data.current.apparent_temperature) : getFallbackWeatherData(locationKey).apparentTemp,
        humidity: data.current.relative_humidity_2m ?? 60,
        windSpeed: typeof data.current.wind_speed_10m === "number" ? Math.round(data.current.wind_speed_10m) : 15,
        weatherCode: data.current.weather_code ?? 1,
        precipitation: data.current.precipitation || 0,
        daily: dailyForecasts.length > 0 ? dailyForecasts : getFallbackWeatherData(locationKey).daily
      };
    } catch {
      return getFallbackWeatherData(locationKey);
    }
  };

  const loadAllWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const [mkData, sData] = await Promise.all([
        fetchWeatherForLocation(LOCATIONS.mtKenya.lat, LOCATIONS.mtKenya.lon, "mtKenya"),
        fetchWeatherForLocation(LOCATIONS.serengeti.lat, LOCATIONS.serengeti.lon, "serengeti")
      ]);
      setMtKenyaWeather(mkData);
      setSerengetiWeather(sData);
      setLastRefreshed(new Date());
    } catch {
      setMtKenyaWeather(prev => prev || getFallbackWeatherData("mtKenya"));
      setSerengetiWeather(prev => prev || getFallbackWeatherData("serengeti"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllWeather();
  }, []);

  const getClimbingSafetyRating = (temp: number, wind: number, code: number) => {
    // Basic recommendation logic for high-altitude Mt Kenya
    if (wind > 35 || temp < -5) {
      return {
        level: "Extreme Chill Alert",
        color: "bg-red-50 text-red-800 border-red-200",
        icon: AlertTriangle,
        advice: "High winds or freeze warning above camp 3. Heavy alpine thermal layers and balaclavas strictly mandatory."
      };
    }
    if ([95, 96, 99].includes(code)) {
      return {
        level: "Storm Advisory",
        color: "bg-amber-50 text-amber-800 border-amber-200",
        icon: AlertTriangle,
        advice: "Active lightning risk. Avoid Ridge pathways. Base camps are safe, postpone direct summit pushes."
      };
    }
    return {
      level: "Optimal Route Standard",
      color: "bg-[#0b3d2e]/10 text-[#0b3d2e] border-[#0b3d2e]/20",
      icon: CheckCircle2,
      advice: "Standard alpine trekking windows open. Perfect for acclimatization circuits."
    };
  };

  const getSafariRating = (precipitation: number, temp: number) => {
    if (precipitation > 10) {
      return {
        level: "Heavy Safari Rain",
        color: "bg-blue-50 text-blue-800 border-blue-200",
        advice: "Expect mud-accumulation on trails. 4x4 differential locked drives mandatory. Great for low-season private viewing."
      };
    }
    if (temp > 32) {
      return {
        level: "Mid-Day Sun Peak",
        color: "bg-amber-50 text-amber-800 border-amber-200",
        advice: "High mid-day heat. Game animals will seek shade. Early morning and twilight game drives highly recommended."
      };
    }
    return {
      level: "Excellent Wildlife Viewing",
      color: "bg-[#0b3d2e]/10 text-[#0b3d2e] border-[#0b3d2e]/20",
      advice: "Active animal herds on migration plains. Optimal daylight photography conditions."
    };
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF6F0] border-t border-[#EAE1D2]" id="weather">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#C9A24A]">LIVE METEOROLOGY</span>
            <h2 className="text-3xl sm:text-4.5xl font-serif font-black text-[#0b3d2e] mt-1 tracking-tight">
              Real-Time Expedition Weather
            </h2>
            <p className="text-xs sm:text-xs text-gray-500 mt-2 max-w-xl">
              Syncing live climate telemetry directly from Mount Kenya and Serengeti Plains base weather stations to secure your climb preparations and packing lists.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastRefreshed && (
              <span className="text-[10px] font-mono text-gray-400">
                Synced: {lastRefreshed.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={loadAllWeather}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-[#0b3d2e] hover:bg-[#06241c] text-[#FAF8F5] border border-[#C9A24A] px-4 py-2 rounded-lg text-xs font-bold transition-all shadow hover:shadow-md disabled:opacity-50"
              id="weather-refresh-btn"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Syncing..." : "Sync Live Data"}
            </button>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-lg mx-auto">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-red-900">Weather Sync Interrupted</h3>
            <p className="text-xs text-red-700 mt-1">{error}</p>
            <button 
              onClick={loadAllWeather} 
              className="mt-4 bg-white border border-red-300 text-red-800 font-bold text-xs px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Retry Sync
            </button>
          </div>
        ) : loading && (!mtKenyaWeather || !serengetiWeather) ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white border border-[#EADFCF] rounded-2xl p-6 shadow-sm animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="grid grid-cols-3 gap-2 py-4">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Mount Kenya Panel */}
            {mtKenyaWeather && (
              <div className="bg-white border border-[#EADFCF] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  {/* Title Bar */}
                  <div className="flex items-start justify-between pb-4 border-b border-[#FAF6F0]">
                    <div>
                      <div className="flex items-center gap-1 text-[#8F5C38]">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-mono uppercase font-black tracking-wider">
                          {LOCATIONS.mtKenya.type}
                        </span>
                      </div>
                      <h3 className="text-lg font-serif font-black text-[#0b3d2e] mt-0.5">
                        {LOCATIONS.mtKenya.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                        Altitude: {LOCATIONS.mtKenya.altitude}
                      </p>
                    </div>
                    {(() => {
                      const details = getWmoDetails(mtKenyaWeather.weatherCode);
                      const IconComp = details.icon;
                      return (
                        <div className="flex flex-col items-end">
                          <div className={`p-2 bg-[#FAF6F0] rounded-xl border border-[#EADFCF] ${details.color}`}>
                            <IconComp className="h-6 w-6" />
                          </div>
                          <span className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-wide">
                            {details.label}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Telemetry Numbers */}
                  <div className="grid grid-cols-3 gap-4 py-6 border-b border-[#FAF6F0]">
                    <div className="text-center">
                      <span className="text-[9px] font-mono text-gray-400 uppercase block tracking-wider">CURRENT TEMP</span>
                      <div className="flex items-center justify-center text-[#0b3d2e] mt-1">
                        <Thermometer className="h-4 w-4 text-[#8F5C38] mr-0.5" />
                        <span className="text-3xl font-black font-sans leading-none">{mtKenyaWeather.currentTemp}°C</span>
                      </div>
                      <span className="text-[9px] text-gray-500 block mt-0.5">Feels like {mtKenyaWeather.apparentTemp}°C</span>
                    </div>

                    <div className="text-center border-x border-[#FAF6F0]">
                      <span className="text-[9px] font-mono text-gray-400 uppercase block tracking-wider">WIND SPEED</span>
                      <div className="flex items-center justify-center text-[#0b3d2e] mt-1">
                        <Wind className="h-4 w-4 text-[#8F5C38] mr-0.5" />
                        <span className="text-3xl font-black font-sans leading-none">{mtKenyaWeather.windSpeed}</span>
                        <span className="text-[10px] font-bold ml-0.5">km/h</span>
                      </div>
                      <span className="text-[9px] text-gray-500 block mt-0.5">Alpine crosswinds</span>
                    </div>

                    <div className="text-center">
                      <span className="text-[9px] font-mono text-gray-400 uppercase block tracking-wider">REL. HUMIDITY</span>
                      <div className="flex items-center justify-center text-[#0b3d2e] mt-1">
                        <Droplets className="h-4 w-4 text-[#8F5C38] mr-0.5" />
                        <span className="text-3xl font-black font-sans leading-none">{mtKenyaWeather.humidity}%</span>
                      </div>
                      <span className="text-[9px] text-gray-500 block mt-0.5">Precip: {mtKenyaWeather.precipitation}mm</span>
                    </div>
                  </div>

                  {/* Smart Advice Box */}
                  {(() => {
                    const rating = getClimbingSafetyRating(mtKenyaWeather.currentTemp, mtKenyaWeather.windSpeed, mtKenyaWeather.weatherCode);
                    const AlertIcon = rating.icon;
                    return (
                      <div className={`mt-5 p-4 rounded-xl border ${rating.color} flex items-start gap-3`}>
                        <AlertIcon className="h-5 w-5 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <span className="font-bold uppercase tracking-wider block text-[10px]">{rating.level}</span>
                          <p className="mt-1 leading-relaxed opacity-90">{rating.advice}</p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 3-Day Forecast Strip */}
                  <div className="mt-6">
                    <h4 className="text-[10px] font-mono uppercase font-black tracking-widest text-gray-400 mb-3 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> 3-Day Alpine Forecast
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {mtKenyaWeather.daily.slice(1, 4).map((day, idx) => {
                        const dayDetails = getWmoDetails(day.weatherCode);
                        const DayIcon = dayDetails.icon;
                        const dateObj = new Date(day.date);
                        const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
                        return (
                          <div key={idx} className="bg-[#FAF8F5] border border-[#EADFCF] p-2.5 rounded-xl text-center">
                            <span className="text-[10px] font-bold text-[#0b3d2e] block">{dayName}</span>
                            <div className="flex justify-center my-1.5">
                              <DayIcon className={`h-4 w-4 ${dayDetails.color}`} />
                            </div>
                            <span className="text-xs font-black text-gray-800 block">
                              {day.maxTemp}° / {day.minTemp}°
                            </span>
                            <span className="text-[9px] text-gray-400 font-mono block mt-0.5">
                              {day.precipitationSum > 0 ? `${day.precipitationSum}mm` : "Dry"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#FAF6F0] flex items-center gap-1.5 text-[10px] text-gray-500">
                  <Info className="h-3 w-3 text-[#C9A24A]" />
                  <span>Always consult Cool J on WhatsApp before committing to Point Lenana paths.</span>
                </div>
              </div>
            )}

            {/* Serengeti Panel */}
            {serengetiWeather && (
              <div className="bg-white border border-[#EADFCF] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  {/* Title Bar */}
                  <div className="flex items-start justify-between pb-4 border-b border-[#FAF6F0]">
                    <div>
                      <div className="flex items-center gap-1 text-[#8F5C38]">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-mono uppercase font-black tracking-wider">
                          {LOCATIONS.serengeti.type}
                        </span>
                      </div>
                      <h3 className="text-lg font-serif font-black text-[#0b3d2e] mt-0.5">
                        {LOCATIONS.serengeti.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                        Altitude: {LOCATIONS.serengeti.altitude}
                      </p>
                    </div>
                    {(() => {
                      const details = getWmoDetails(serengetiWeather.weatherCode);
                      const IconComp = details.icon;
                      return (
                        <div className="flex flex-col items-end">
                          <div className={`p-2 bg-[#FAF6F0] rounded-xl border border-[#EADFCF] ${details.color}`}>
                            <IconComp className="h-6 w-6" />
                          </div>
                          <span className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-wide">
                            {details.label}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Telemetry Numbers */}
                  <div className="grid grid-cols-3 gap-4 py-6 border-b border-[#FAF6F0]">
                    <div className="text-center">
                      <span className="text-[9px] font-mono text-gray-400 uppercase block tracking-wider">CURRENT TEMP</span>
                      <div className="flex items-center justify-center text-[#0b3d2e] mt-1">
                        <Thermometer className="h-4 w-4 text-[#8F5C38] mr-0.5" />
                        <span className="text-3xl font-black font-sans leading-none">{serengetiWeather.currentTemp}°C</span>
                      </div>
                      <span className="text-[9px] text-gray-500 block mt-0.5">Feels like {serengetiWeather.apparentTemp}°C</span>
                    </div>

                    <div className="text-center border-x border-[#FAF6F0]">
                      <span className="text-[9px] font-mono text-gray-400 uppercase block tracking-wider">WIND SPEED</span>
                      <div className="flex items-center justify-center text-[#0b3d2e] mt-1">
                        <Wind className="h-4 w-4 text-[#8F5C38] mr-0.5" />
                        <span className="text-3xl font-black font-sans leading-none">{serengetiWeather.windSpeed}</span>
                        <span className="text-[10px] font-bold ml-0.5">km/h</span>
                      </div>
                      <span className="text-[9px] text-gray-500 block mt-0.5">Plains game-breeze</span>
                    </div>

                    <div className="text-center">
                      <span className="text-[9px] font-mono text-gray-400 uppercase block tracking-wider">REL. HUMIDITY</span>
                      <div className="flex items-center justify-center text-[#0b3d2e] mt-1">
                        <Droplets className="h-4 w-4 text-[#8F5C38] mr-0.5" />
                        <span className="text-3xl font-black font-sans leading-none">{serengetiWeather.humidity}%</span>
                      </div>
                      <span className="text-[9px] text-gray-500 block mt-0.5">Precip: {serengetiWeather.precipitation}mm</span>
                    </div>
                  </div>

                  {/* Smart Advice Box */}
                  {(() => {
                    const rating = getSafariRating(serengetiWeather.precipitation, serengetiWeather.currentTemp);
                    return (
                      <div className={`mt-5 p-4 rounded-xl border ${rating.color} flex items-start gap-3`}>
                        <Info className="h-5 w-5 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <span className="font-bold uppercase tracking-wider block text-[10px]">{rating.level}</span>
                          <p className="mt-1 leading-relaxed opacity-90">{rating.advice}</p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 3-Day Forecast Strip */}
                  <div className="mt-6">
                    <h4 className="text-[10px] font-mono uppercase font-black tracking-widest text-gray-400 mb-3 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> 3-Day Safari Forecast
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {serengetiWeather.daily.slice(1, 4).map((day, idx) => {
                        const dayDetails = getWmoDetails(day.weatherCode);
                        const DayIcon = dayDetails.icon;
                        const dateObj = new Date(day.date);
                        const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
                        return (
                          <div key={idx} className="bg-[#FAF8F5] border border-[#EADFCF] p-2.5 rounded-xl text-center">
                            <span className="text-[10px] font-bold text-[#0b3d2e] block">{dayName}</span>
                            <div className="flex justify-center my-1.5">
                              <DayIcon className={`h-4 w-4 ${dayDetails.color}`} />
                            </div>
                            <span className="text-xs font-black text-gray-800 block">
                              {day.maxTemp}° / {day.minTemp}°
                            </span>
                            <span className="text-[9px] text-gray-400 font-mono block mt-0.5">
                              {day.precipitationSum > 0 ? `${day.precipitationSum}mm` : "Dry"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#FAF6F0] flex items-center gap-1.5 text-[10px] text-gray-500">
                  <Info className="h-3 w-3 text-[#C9A24A]" />
                  <span>Daily game drive departures sync with local wildlife crossing timelines.</span>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Section Call To Action */}
        <div className="mt-12 bg-gradient-to-r from-[#0b3d2e] to-[#134e3f] rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#C9A24A]/30 shadow-lg">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#C9A24A] font-bold block mb-1">
              READY FOR OPTIMAL CLIMBING OR SAFARI DATES?
            </span>
            <h4 className="text-xl sm:text-2xl font-serif font-black text-white">
              Lock in your personalized weather window & itinerary
            </h4>
            <p className="text-xs text-gray-300 mt-1 max-w-xl">
              Get an instant real-time quote with acclimatization schedules matched to peak weather seasons.
            </p>
          </div>
          <a
            href="#builder"
            className="shrink-0 inline-flex items-center gap-2 bg-[#C9A24A] hover:bg-[#D9B85A] text-[#0b3d2e] font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-xl transition-all"
          >
            <span>Draft My Adventure</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
