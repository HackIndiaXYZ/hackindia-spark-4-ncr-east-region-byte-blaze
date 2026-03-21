/**
 * WeatherDashboard Page
 * =====================
 * Shows live weather data with admin location search.
 * Admin can enter any city name to evaluate weather metrics.
 * Auto-refreshes every 60 seconds.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'https://hackindia-spark-4-ncr-east-region-byte-5yx2.onrender.com/api';

const timeAgo = (iso) => {
  if (!iso) return 'Never';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.round(diff)}s ago`;
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  return `${Math.round(diff / 3600)}h ago`;
};

const WeatherDashboard = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [contractStats, setContractStats] = useState(null);
  const [lastJobRun, setLastJobRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  // Location search state
  const [searchCity, setSearchCity] = useState('');
  const [activeCity, setActiveCity] = useState('');
  const [searching, setSearching] = useState(false);

  // Fetch weather data
  const fetchWeather = useCallback(async (city = '') => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const query = city ? `?city=${encodeURIComponent(city)}` : '';

      const res = await fetch(`${API_BASE}/weather-monitor${query}`, { headers });
      const json = await res.json();

      if (json.success) {
        setWeather(json.data.weather);
        setAnalysis(json.data.analysis);
        setContractStats(json.data.contractStats);
        setLastJobRun(json.data.lastJobRun);
        setLastUpdated(new Date().toISOString());
        setError('');
      } else {
        setError(json.error || 'Failed to fetch weather');
      }
    } catch (e) {
      setError('Cannot connect to weather service. Ensure backend is running.');
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, []);

  // Initial fetch + auto-refresh
  useEffect(() => {
    fetchWeather(activeCity);
    const interval = setInterval(() => fetchWeather(activeCity), 60000);
    return () => clearInterval(interval);
  }, [fetchWeather, activeCity]);

  // Handle location search
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchCity.trim()) return;
    setSearching(true);
    setError('');
    setActiveCity(searchCity.trim());
    fetchWeather(searchCity.trim());
  };

  const handleReset = () => {
    setSearchCity('');
    setActiveCity('');
    setLoading(true);
    fetchWeather('');
  };

  // Suggested cities
  const quickCities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Jaipur', 'Lucknow', 'Patna'];

  const getWeatherIcon = (condition) => {
    const icons = {
      'Clear': '☀️', 'Clouds': '☁️', 'Rain': '🌧️', 'Drizzle': '🌦️',
      'Thunderstorm': '⛈️', 'Snow': '❄️', 'Mist': '🌫️', 'Fog': '🌫️',
      'Haze': '😶‍🌫️', 'Dust': '🌪️', 'Tornado': '🌪️',
    };
    return icons[condition] || '🌤️';
  };

  const severityColor = (sev) => {
    if (sev === 'critical') return { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' };
    if (sev === 'warning') return { bg: '#fffbeb', border: '#f59e0b', text: '#92400e' };
    return { bg: '#ecfdf5', border: '#10b981', text: '#065f46' };
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }} className="animate-float">🌦️</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Loading Weather Data...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Hero */}
      <div style={{ padding: '80px 24px 60px', background: 'var(--gradient-dark)', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h1 className="animate-fade-in-up" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'white', marginBottom: 12 }}>
            🌦️ Weather <span className="text-gradient-accent">Monitoring</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
            Real-time weather tracking & automatic insurance payout triggers
          </p>
          {lastUpdated && (
            <div style={{ marginTop: 12, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
              Last updated: {timeAgo(lastUpdated)} • Auto-refreshes every 60s
            </div>
          )}
        </div>
      </div>

      <div className="page-container" style={{ marginTop: '-30px', position: 'relative', zIndex: 10 }}>

        {/* ═══ LOCATION SEARCH ═══ */}
        <div className="glass-panel animate-fade-in-up" style={{ padding: 28, marginBottom: 32 }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>📍 Search Weather by Location</h3>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Enter city name (e.g., Delhi, Mumbai, London)..."
              className="premium-input"
              style={{ flex: 1, minWidth: 250 }}
            />
            <button type="submit" className="btn-premium" disabled={searching || !searchCity.trim()}
              style={{ padding: '14px 28px', opacity: searching ? 0.7 : 1 }}>
              {searching ? '⏳ Searching...' : '🔍 Search'}
            </button>
            {activeCity && (
              <button type="button" onClick={handleReset}
                style={{ padding: '14px 20px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)',
                  background: 'white', cursor: 'pointer', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                ✕ Reset to Default
              </button>
            )}
          </form>

          {/* Quick City Buttons */}
          <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600, alignSelf: 'center' }}>Quick:</span>
            {quickCities.map(city => (
              <button key={city} onClick={() => { setSearchCity(city); setSearching(true); setActiveCity(city); fetchWeather(city); }}
                style={{
                  padding: '6px 16px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)',
                  background: activeCity === city ? 'var(--gradient-primary)' : 'white',
                  color: activeCity === city ? 'white' : 'var(--color-text-muted)',
                  cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s'
                }}>
                {city}
              </button>
            ))}
          </div>

          {activeCity && (
            <div style={{ marginTop: 12, padding: '8px 16px', background: '#ecfdf5', borderRadius: 8, fontSize: '0.9rem', color: '#065f46' }}>
              📍 Showing weather for: <strong>{activeCity}</strong>
            </div>
          )}
        </div>

        {error && (
          <div className="glass-panel" style={{ padding: 20, marginBottom: 24, borderLeft: '4px solid #ef4444', background: '#fef2f2', color: '#991b1b' }}>
            ⚠️ {error}
          </div>
        )}

        {weather && (
          <>
            {/* ═══ WEATHER ALERT ═══ */}
            {analysis && analysis.severity !== 'normal' && (
              <div className="glass-panel animate-fade-in-up" style={{
                padding: 24, marginBottom: 32,
                background: severityColor(analysis.severity).bg,
                borderLeft: `4px solid ${severityColor(analysis.severity).border}`,
                color: severityColor(analysis.severity).text,
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
                  {analysis.severity === 'critical' ? '🚨 CRITICAL WEATHER ALERT' : '⚠️ WEATHER WARNING'}
                </div>
                <div>{analysis.reason}</div>
                <div style={{ marginTop: 12, fontSize: '0.9rem', opacity: 0.8 }}>
                  Automatic payouts may be triggered for affected policies.
                </div>
              </div>
            )}

            {/* ═══ WEATHER CARDS ═══ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 40 }}>
              {/* Temperature */}
              <div className="glass-panel animate-fade-in-up" style={{ padding: 28, textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 8 }}>🌡️</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-text-main)' }}>{Math.round(weather.temperature)}°C</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>TEMPERATURE</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                  Feels like {Math.round(weather.temperatureFeelsLike)}°C
                </div>
              </div>

              {/* Rainfall */}
              <div className="glass-panel animate-fade-in-up" style={{ padding: 28, textAlign: 'center', animationDelay: '0.1s' }}>
                <div style={{ fontSize: '3rem', marginBottom: 8 }}>🌧️</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: weather.rainfall > 0 ? '#3b82f6' : 'var(--color-text-main)' }}>
                  {weather.rainfall} mm
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>RAINFALL (1h)</div>
                {weather.rainfall === 0 && (
                  <div style={{ fontSize: '0.8rem', color: '#f59e0b', marginTop: 4 }}>⚠️ No rain detected</div>
                )}
              </div>

              {/* Humidity */}
              <div className="glass-panel animate-fade-in-up" style={{ padding: 28, textAlign: 'center', animationDelay: '0.2s' }}>
                <div style={{ fontSize: '3rem', marginBottom: 8 }}>💧</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-text-main)' }}>{weather.humidity}%</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>HUMIDITY</div>
              </div>

              {/* Wind */}
              <div className="glass-panel animate-fade-in-up" style={{ padding: 28, textAlign: 'center', animationDelay: '0.3s' }}>
                <div style={{ fontSize: '3rem', marginBottom: 8 }}>💨</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-text-main)' }}>{weather.windSpeed} m/s</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>WIND SPEED</div>
              </div>

              {/* Condition */}
              <div className="glass-panel animate-fade-in-up" style={{ padding: 28, textAlign: 'center', animationDelay: '0.4s' }}>
                <div style={{ fontSize: '3rem', marginBottom: 8 }}>{getWeatherIcon(weather.condition)}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-text-main)', textTransform: 'capitalize' }}>
                  {weather.description}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>CONDITION</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                  📍 {weather.location}, {weather.country}
                </div>
              </div>
            </div>

            {/* ═══ ANALYSIS STATUS ═══ */}
            {analysis && (
              <div className="glass-panel animate-fade-in-up" style={{ padding: 32, marginBottom: 40 }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: 20 }}>📊 Condition Analysis</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                  {[
                    { label: 'Overall Status', value: analysis.severity.toUpperCase(), color: severityColor(analysis.severity).border },
                    { label: 'Storm', value: analysis.isStorm ? '🔴 YES' : '🟢 NO' },
                    { label: 'Drought', value: analysis.isDrought ? '🔴 YES' : '🟢 NO' },
                    { label: 'Extreme Temp', value: analysis.isExtremeTemp ? '🔴 YES' : '🟢 NO' },
                    { label: 'Heavy Rain', value: analysis.isHeavyRain ? '🟡 YES' : '🟢 NO' },
                  ].map((item, i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.03)', padding: 16, borderRadius: 12, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: item.color || 'var(--color-text-main)' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ SMART CONTRACT STATS ═══ */}
            {contractStats && (
              <div className="glass-panel animate-fade-in-up" style={{ padding: 32, marginBottom: 40 }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: 20 }}>⛓️ Smart Contract Status</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                  {[
                    { emoji: '📋', label: 'Policies Sold', value: contractStats.totalPoliciesSold },
                    { emoji: '💰', label: 'Payouts Triggered', value: contractStats.totalPayoutsTriggered },
                    { emoji: '👨‍🌾', label: 'Active Farmers', value: contractStats.activeFarmers },
                    { emoji: '💎', label: 'Contract Balance', value: `${contractStats.contractBalance} MATIC` },
                  ].map((s, i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.03)', padding: 20, borderRadius: 12, textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{s.emoji}</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{s.value}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ JOB STATUS ═══ */}
            <div className="glass-panel animate-fade-in-up" style={{ padding: 32 }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: 20 }}>⏰ Auto-Trigger Job Status</h3>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ background: 'rgba(0,0,0,0.03)', padding: 16, borderRadius: 12, flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Status</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {lastJobRun?.isRunning ? '🔄 Running...' : '⏸️ Waiting (hourly)'}
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.03)', padding: 16, borderRadius: 12, flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Last Run</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700 }}>
                    {lastJobRun?.lastRun ? timeAgo(lastJobRun.lastRun) : 'Not yet run'}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 16, padding: 12, background: '#ecfdf5', borderRadius: 8, fontSize: '0.9rem', color: '#065f46' }}>
                💡 The system automatically checks weather every hour. If rainfall drops below policy thresholds, payouts are triggered on the
                <a href="https://amoy.polygonscan.com/" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, marginLeft: 4 }}>
                  Polygon Amoy blockchain
                </a>.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;
