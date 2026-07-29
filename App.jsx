import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog,
  CloudDrizzle, CloudSun, CloudMoon, Wind, Droplets, Search, Loader2,
  MapPin, ArrowUp
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  WMO weather code -> { label, Icon, sky }                          */
/* ------------------------------------------------------------------ */
const WMO = {
  0:  { label: "Clear sky",        icon: "sun",      sky: "clear" },
  1:  { label: "Mostly clear",     icon: "sunCloud", sky: "clear" },
  2:  { label: "Partly cloudy",    icon: "sunCloud", sky: "cloudy" },
  3:  { label: "Overcast",         icon: "cloud",     sky: "overcast" },
  45: { label: "Fog",              icon: "fog",       sky: "overcast" },
  48: { label: "Rime fog",         icon: "fog",       sky: "overcast" },
  51: { label: "Light drizzle",    icon: "drizzle",   sky: "rain" },
  53: { label: "Drizzle",          icon: "drizzle",   sky: "rain" },
  55: { label: "Dense drizzle",    icon: "drizzle",   sky: "rain" },
  56: { label: "Freezing drizzle", icon: "drizzle",   sky: "rain" },
  57: { label: "Freezing drizzle", icon: "drizzle",   sky: "rain" },
  61: { label: "Light rain",       icon: "rain",      sky: "rain" },
  63: { label: "Rain",             icon: "rain",      sky: "rain" },
  65: { label: "Heavy rain",       icon: "rain",      sky: "rain" },
  66: { label: "Freezing rain",    icon: "rain",      sky: "rain" },
  67: { label: "Freezing rain",    icon: "rain",      sky: "rain" },
  71: { label: "Light snow",       icon: "snow",      sky: "snow" },
  73: { label: "Snow",             icon: "snow",      sky: "snow" },
  75: { label: "Heavy snow",       icon: "snow",      sky: "snow" },
  77: { label: "Snow grains",      icon: "snow",      sky: "snow" },
  80: { label: "Light showers",    icon: "rain",      sky: "rain" },
  81: { label: "Showers",          icon: "rain",      sky: "rain" },
  82: { label: "Violent showers",  icon: "rain",      sky: "rain" },
  85: { label: "Snow showers",     icon: "snow",      sky: "snow" },
  86: { label: "Snow showers",     icon: "snow",      sky: "snow" },
  95: { label: "Thunderstorm",     icon: "storm",     sky: "storm" },
  96: { label: "Thunder + hail",   icon: "storm",     sky: "storm" },
  99: { label: "Thunder + hail",   icon: "storm",     sky: "storm" },
};
const wmo = (code) => WMO[code] || { label: "Unknown", icon: "cloud", sky: "cloudy" };

function WeatherIcon({ code, isDay, size = 28, className = "" }) {
  const { icon } = wmo(code);
  const props = { size, strokeWidth: 1.6, className };
  if (icon === "sun") return isDay ? <Sun {...props} /> : <Moon {...props} />;
  if (icon === "sunCloud") return isDay ? <CloudSun {...props} /> : <CloudMoon {...props} />;
  if (icon === "cloud") return <Cloud {...props} />;
  if (icon === "fog") return <CloudFog {...props} />;
  if (icon === "drizzle") return <CloudDrizzle {...props} />;
  if (icon === "rain") return <CloudRain {...props} />;
  if (icon === "snow") return <CloudSnow {...props} />;
  if (icon === "storm") return <CloudLightning {...props} />;
  return <Cloud {...props} />;
}

/* ------------------------------------------------------------------ */
/*  Sky gradients keyed by condition + day/night                      */
/* ------------------------------------------------------------------ */
const SKY = {
  clear:    { day: ["#4E85B8", "#8FC1DE", "#E8C77E"], night: ["#0B1220", "#1B2A44", "#33456B"] },
  cloudy:   { day: ["#5B7A93", "#93AABC", "#D7C9A9"], night: ["#12181F", "#232E3A", "#38495A"] },
  overcast: { day: ["#5C6B73", "#8B99A0", "#C7C2B4"], night: ["#14181B", "#262C30", "#3B444A"] },
  rain:     { day: ["#3C4A56", "#5E7383", "#8FA3AC"], night: ["#0D1114", "#1B2328", "#2C3A42"] },
  snow:     { day: ["#7C8C99", "#B7C4CC", "#EDEEEF"], night: ["#161B22", "#2A323C", "#47545F"] },
  storm:    { day: ["#2A2E38", "#454C59", "#6C7280"], night: ["#08090C", "#181B22", "#2B2F3A"] },
};

function skyGradient(code, isDay) {
  const { sky } = wmo(code);
  const stops = SKY[sky] ? SKY[sky][isDay ? "day" : "night"] : SKY.cloudy[isDay ? "day" : "night"];
  return `linear-gradient(160deg, ${stops[0]} 0%, ${stops[1]} 55%, ${stops[2]} 100%)`;
}

/* ------------------------------------------------------------------ */
/*  Sun arc: position of sun/moon between sunrise & sunset             */
/* ------------------------------------------------------------------ */
function SunArc({ sunrise, sunset, now, isDay }) {
  const total = sunset - sunrise;
  const elapsed = isDay ? now - sunrise : (now < sunrise ? now - (sunrise - 86400000) : now - sunset);
  const span = isDay ? total : (86400000 - total);
  const frac = Math.min(1, Math.max(0, elapsed / span));
  const angle = Math.PI * frac; // 0..PI across the arc
  const cx = 100, cy = 90, r = 78;
  const x = cx - r * Math.cos(angle);
  const y = cy - r * Math.sin(angle);

  const fmt = (d) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <svg viewBox="0 0 200 100" className="w-full h-auto">
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 4" />
      <circle cx={x} cy={y} r={isDay ? 6 : 5} fill={isDay ? "#F4C463" : "#DCE4EC"} />
      <circle cx={cx - r} cy={cy} r="2" fill="currentColor" opacity="0.5" />
      <circle cx={cx + r} cy={cy} r="2" fill="currentColor" opacity="0.5" />
      <text x={cx - r} y={cy + 16} fontSize="9" fill="currentColor" opacity="0.6" textAnchor="middle" fontFamily="ui-monospace, monospace">
        {fmt(sunrise)}
      </text>
      <text x={cx + r} y={cy + 16} fontSize="9" fill="currentColor" opacity="0.6" textAnchor="middle" fontFamily="ui-monospace, monospace">
        {fmt(sunset)}
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Wind compass                                                       */
/* ------------------------------------------------------------------ */
function Compass({ direction, speed, unit }) {
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 60 60" className="w-12 h-12 shrink-0">
        <circle cx="30" cy="30" r="27" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
        {["N", "E", "S", "W"].map((l, i) => {
          const a = (i * 90 - 90) * (Math.PI / 180);
          const x = 30 + 21 * Math.cos(a);
          const y = 30 + 21 * Math.sin(a);
          return (
            <text key={l} x={x} y={y + 3} fontSize="7" textAnchor="middle" fill="currentColor" opacity="0.55" fontFamily="ui-monospace, monospace">
              {l}
            </text>
          );
        })}
        <g transform={`rotate(${direction} 30 30)`}>
          <line x1="30" y1="30" x2="30" y2="10" stroke="#E8A33D" strokeWidth="2" strokeLinecap="round" />
          <polygon points="30,6 26,14 34,14" fill="#E8A33D" />
        </g>
        <circle cx="30" cy="30" r="2.5" fill="currentColor" />
      </svg>
      <div className="font-mono text-sm leading-tight">
        <div>{Math.round(speed)} {unit === "f" ? "mph" : "km/h"}</div>
        <div className="opacity-50 text-xs">{Math.round(direction)}°</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main App                                                           */
/* ------------------------------------------------------------------ */
const DAY_ABBR = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function WeatherAlmanac() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const [place, setPlace] = useState({ name: "Kyoto", admin1: "Kyoto Prefecture", country: "Japan", latitude: 35.0116, longitude: 135.7681 });
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("c"); // c | f
  const debounceRef = useRef(null);

  const fetchWeather = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day",
        hourly: "temperature_2m,weather_code,precipitation_probability",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max",
        temperature_unit: unit === "f" ? "fahrenheit" : "celsius",
        wind_speed_unit: unit === "f" ? "mph" : "kmh",
        timezone: "auto",
        forecast_days: "7",
      });
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
      if (!res.ok) throw new Error("Forecast request failed");
      const data = await res.json();
      setWeather(data);
    } catch (e) {
      setError("Couldn't reach the forecast station. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [unit]);

  useEffect(() => {
    fetchWeather(place.latitude, place.longitude);
  }, [place, fetchWeather]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
        );
        const data = await res.json();
        setSuggestions(data.results || []);
        setShowSuggest(true);
      } catch {
        setSuggestions([]);
      }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const selectPlace = (r) => {
    setPlace({
      name: r.name,
      admin1: r.admin1,
      country: r.country,
      latitude: r.latitude,
      longitude: r.longitude,
    });
    setQuery("");
    setSuggestions([]);
    setShowSuggest(false);
  };

  const current = weather?.current;
  const isDay = current ? current.is_day === 1 : true;
  const code = current?.weather_code ?? 0;
  const bg = skyGradient(code, isDay);
  const unitLabel = unit === "f" ? "°F" : "°C";

  // Build next 8 hourly entries from "now"
  let hourly = [];
  if (weather?.hourly) {
    const nowISO = weather.current.time;
    const idx = weather.hourly.time.findIndex((t) => t >= nowISO);
    const start = idx === -1 ? 0 : idx;
    for (let i = start; i < Math.min(start + 8, weather.hourly.time.length); i++) {
      hourly.push({
        time: weather.hourly.time[i],
        temp: weather.hourly.temperature_2m[i],
        code: weather.hourly.weather_code[i],
        pop: weather.hourly.precipitation_probability[i],
      });
    }
  }

  const now = weather ? new Date(weather.current.time) : new Date();
  const sunrise = weather ? new Date(weather.daily.sunrise[0]) : null;
  const sunset = weather ? new Date(weather.daily.sunset[0]) : null;

  return (
    <div
      className="min-h-screen w-full text-[#EDEFEF] transition-[background] duration-700 ease-out"
      style={{ background: bg, fontFamily: "'Iowan Old Style', 'Georgia', serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500&display=swap');
        .font-display { font-family: 'Fraunces', Georgia, serif; }
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
        {/* Header / masthead */}
        <header className="flex items-baseline justify-between border-b border-white/25 pb-4 mb-8">
          <div>
            <p className="font-mono text-[11px] tracking-[0.25em] uppercase opacity-70">Field Almanac</p>
            <h1 className="font-display text-2xl sm:text-3xl font-medium mt-1">Weather Station</h1>
          </div>
          <button
            onClick={() => setUnit((u) => (u === "c" ? "f" : "c"))}
            className="font-mono text-xs border border-white/40 rounded-full px-3 py-1.5 hover:bg-white/10 transition-colors"
            aria-label="Toggle temperature unit"
          >
            °C / °F &nbsp;<span className="opacity-70">[{unit.toUpperCase()}]</span>
          </button>
        </header>

        {/* Search */}
        <div className="relative mb-10">
          <div className="flex items-center gap-2 border-b border-white/40 pb-2">
            <Search size={16} className="opacity-60 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => suggestions.length && setShowSuggest(true)}
              placeholder="Search a city, e.g. Lisbon, Nairobi, Osaka…"
              className="bg-transparent outline-none w-full font-body text-sm placeholder:text-white/50"
            />
          </div>
          {showSuggest && suggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-[#1B2430]/95 backdrop-blur border border-white/15 rounded-lg overflow-hidden shadow-xl">
              {suggestions.map((r) => (
                <li key={`${r.id}`}>
                  <button
                    onClick={() => selectPlace(r)}
                    className="w-full text-left px-4 py-2.5 hover:bg-white/10 transition-colors font-body text-sm flex items-center gap-2"
                  >
                    <MapPin size={13} className="opacity-50 shrink-0" />
                    <span>{r.name}{r.admin1 ? `, ${r.admin1}` : ""}</span>
                    <span className="ml-auto text-xs opacity-50 font-mono">{r.country_code}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && (
          <div className="font-body text-sm bg-white/10 border border-white/20 rounded-lg px-4 py-3 mb-8">
            {error}
          </div>
        )}

        {loading && !weather ? (
          <div className="flex items-center gap-2 opacity-70 font-body text-sm py-20 justify-center">
            <Loader2 className="animate-spin" size={18} />
            Reading the instruments…
          </div>
        ) : weather ? (
          <>
            {/* Hero reading */}
            <section className="grid sm:grid-cols-[1fr_auto] gap-8 items-start mb-12">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] opacity-70 mb-1">
                  {place.name}{place.admin1 ? `, ${place.admin1}` : ""} — {place.country}
                </p>
                <div className="flex items-end gap-4">
                  <span className="font-display text-7xl sm:text-8xl font-medium leading-none tabular-nums">
                    {Math.round(current.temperature_2m)}°
                  </span>
                  <WeatherIcon code={code} isDay={isDay} size={44} className="mb-2 opacity-90" />
                </div>
                <p className="font-body text-base mt-2 opacity-90">{wmo(code).label}</p>
                <p className="font-mono text-xs opacity-60 mt-1">
                  feels like {Math.round(current.apparent_temperature)}{unitLabel}
                </p>
              </div>

              <div className="flex sm:flex-col gap-6 sm:gap-4 sm:items-end sm:text-right w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center gap-2 font-mono text-sm">
                  <Droplets size={15} className="opacity-60" />
                  {current.relative_humidity_2m}%
                </div>
                <Compass direction={current.wind_direction_10m} speed={current.wind_speed_10m} unit={unit} />
              </div>
            </section>

            {/* Sun arc */}
            {sunrise && sunset && (
              <section className="mb-12 border-y border-white/20 py-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-60 mb-1">Sun position</p>
                <SunArc sunrise={sunrise} sunset={sunset} now={now} isDay={isDay} />
              </section>
            )}

            {/* Hourly ticker */}
            <section className="mb-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-60 mb-3">Next hours</p>
              <div className="flex gap-0 overflow-x-auto -mx-1 px-1 pb-2">
                {hourly.map((h, i) => {
                  const d = new Date(h.time);
                  return (
                    <div
                      key={h.time}
                      className={`flex flex-col items-center gap-2 px-4 py-3 shrink-0 ${i !== hourly.length - 1 ? "border-r border-white/15" : ""}`}
                    >
                      <span className="font-mono text-xs opacity-70">
                        {i === 0 ? "Now" : d.toLocaleTimeString([], { hour: "numeric" })}
                      </span>
                      <WeatherIcon code={h.code} isDay={true} size={20} />
                      <span className="font-display text-lg tabular-nums">{Math.round(h.temp)}°</span>
                      <span className="font-mono text-[10px] opacity-50 flex items-center gap-0.5">
                        {h.pop > 0 ? `${h.pop}%` : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Daily log */}
            <section>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-60 mb-3">Seven-day log</p>
              <ul className="divide-y divide-white/15 border-t border-b border-white/15">
                {weather.daily.time.map((t, i) => {
                  const d = new Date(t + "T00:00:00");
                  const max = weather.daily.temperature_2m_max[i];
                  const min = weather.daily.temperature_2m_min[i];
                  const dcode = weather.daily.weather_code[i];
                  const pop = weather.daily.precipitation_probability_max[i];
                  return (
                    <li key={t} className="flex items-center gap-4 py-3 font-body text-sm">
                      <span className="font-mono text-xs w-9 opacity-70">{i === 0 ? "TODAY" : DAY_ABBR[d.getDay()]}</span>
                      <WeatherIcon code={dcode} isDay={true} size={18} className="opacity-90" />
                      <span className="flex-1 opacity-85 hidden sm:block">{wmo(dcode).label}</span>
                      <span className="font-mono text-xs opacity-60 w-10 text-right flex items-center gap-0.5 justify-end">
                        <Droplets size={11} className="opacity-60" />{pop}%
                      </span>
                      <span className="font-mono text-sm tabular-nums w-20 text-right">
                        <span className="opacity-60">{Math.round(min)}°</span>
                        {"  "}
                        <span>{Math.round(max)}°</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>

            <footer className="mt-12 pt-6 border-t border-white/15 font-mono text-[11px] opacity-50 flex items-center justify-between">
              <span>Data: Open-Meteo</span>
              <span>{lastUpdated(weather.current.time)}</span>
            </footer>
          </>
        ) : null}
      </div>
    </div>
  );
}

function lastUpdated(iso) {
  const d = new Date(iso);
  return `Updated ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}
