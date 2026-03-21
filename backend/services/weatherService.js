/**
 * Weather Service
 * ===============
 * Dedicated weather data fetcher using OpenWeatherMap API.
 * This is a NEW standalone service — does NOT modify existing utils/weatherAPI.js.
 * 
 * Features:
 *  - Fetches temperature, rainfall, wind, humidity, weather condition
 *  - Handles missing rainfall data (defaults to 0)
 *  - Proper error handling with descriptive messages
 *  - Returns structured weather data object
 */

import axios from 'axios';

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const GEOCODING_URL = 'https://api.openweathermap.org/geo/1.0/direct';

/**
 * Fetch weather by city name (geocodes automatically via OpenWeather).
 * @param {string} cityName — e.g. "Delhi", "Mumbai, IN"
 * @returns {Promise<Object>} Same structured weather data as getWeatherData()
 */
export async function getWeatherByCity(cityName) {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey || apiKey === 'your_openweathermap_api_key') {
    throw new Error('WEATHER_API_KEY is not configured');
  }

  try {
    // Use the 'q' parameter to let OpenWeather resolve the city
    const response = await axios.get(OPENWEATHER_BASE_URL, {
      params: { q: cityName, appid: apiKey, units: 'metric' },
      timeout: 10000,
    });

    const data = response.data;
    const rainfall1h = data.rain?.['1h'] ?? 0;
    const rainfall3h = data.rain?.['3h'] ?? 0;

    return {
      location: data.name || cityName,
      country: data.sys?.country || '',
      coordinates: { lat: data.coord?.lat, lon: data.coord?.lon },
      temperature: data.main?.temp ?? null,
      temperatureFeelsLike: data.main?.feels_like ?? null,
      temperatureMin: data.main?.temp_min ?? null,
      temperatureMax: data.main?.temp_max ?? null,
      rainfall: rainfall1h,
      rainfall3h: rainfall3h,
      humidity: data.main?.humidity ?? null,
      pressure: data.main?.pressure ?? null,
      windSpeed: data.wind?.speed ?? 0,
      windDeg: data.wind?.deg ?? 0,
      cloudiness: data.clouds?.all ?? 0,
      visibility: data.visibility ?? null,
      condition: data.weather?.[0]?.main || 'Unknown',
      description: data.weather?.[0]?.description || 'Unknown',
      icon: data.weather?.[0]?.icon || '01d',
      timestamp: new Date().toISOString(),
      sunrise: data.sys?.sunrise ? new Date(data.sys.sunrise * 1000).toISOString() : null,
      sunset: data.sys?.sunset ? new Date(data.sys.sunset * 1000).toISOString() : null,
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`City "${cityName}" not found. Try a different name.`);
    }
    if (error.response) {
      throw new Error(`OpenWeather API error (${error.response.status}): ${error.response.data?.message}`);
    }
    throw new Error(`Weather fetch failed: ${error.message}`);
  }
}

/**
 * Fetch current weather data for a given latitude/longitude.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object>} Structured weather data
 */
export async function getWeatherData(latitude, longitude) {
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey || apiKey === 'your_openweathermap_api_key') {
    throw new Error('WEATHER_API_KEY is not configured in .env. Get one at https://openweathermap.org/appid');
  }

  try {
    const response = await axios.get(OPENWEATHER_BASE_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: apiKey,
        units: 'metric', // Celsius
      },
      timeout: 10000, // 10 second timeout
    });

    const data = response.data;

    // Extract rainfall — OpenWeather may not include rain object if no rain
    const rainfall1h = data.rain?.['1h'] ?? 0;  // mm in last 1 hour
    const rainfall3h = data.rain?.['3h'] ?? 0;  // mm in last 3 hours

    return {
      // Location
      location: data.name || 'Unknown',
      country: data.sys?.country || '',
      coordinates: { lat: data.coord?.lat, lon: data.coord?.lon },

      // Temperature
      temperature: data.main?.temp ?? null,
      temperatureFeelsLike: data.main?.feels_like ?? null,
      temperatureMin: data.main?.temp_min ?? null,
      temperatureMax: data.main?.temp_max ?? null,

      // Rainfall (IMPORTANT: defaults to 0 if not present)
      rainfall: rainfall1h,
      rainfall3h: rainfall3h,

      // Other conditions
      humidity: data.main?.humidity ?? null,
      pressure: data.main?.pressure ?? null,
      windSpeed: data.wind?.speed ?? 0,
      windDeg: data.wind?.deg ?? 0,
      cloudiness: data.clouds?.all ?? 0,
      visibility: data.visibility ?? null,

      // Weather description
      condition: data.weather?.[0]?.main || 'Unknown',
      description: data.weather?.[0]?.description || 'Unknown',
      icon: data.weather?.[0]?.icon || '01d',

      // Metadata
      timestamp: new Date().toISOString(),
      sunrise: data.sys?.sunrise ? new Date(data.sys.sunrise * 1000).toISOString() : null,
      sunset: data.sys?.sunset ? new Date(data.sys.sunset * 1000).toISOString() : null,
    };
  } catch (error) {
    if (error.response) {
      // OpenWeather API returned an error
      const status = error.response.status;
      const msg = error.response.data?.message || 'Unknown API error';
      throw new Error(`OpenWeather API error (${status}): ${msg}`);
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Weather API request timed out');
    } else {
      throw new Error(`Weather fetch failed: ${error.message}`);
    }
  }
}

/**
 * Check if weather conditions indicate a severe event.
 * @param {Object} weather — output from getWeatherData()
 * @returns {Object} { isStorm, isDrought, isExtremeTemp, severity, reason }
 */
export function analyzeWeatherConditions(weather) {
  const isStorm = weather.rainfall >= 50 || ['Thunderstorm', 'Tornado'].includes(weather.condition);
  const isHeavyRain = weather.rainfall >= 20;
  const isDrought = weather.rainfall === 0 && weather.temperature >= 42 && weather.humidity < 20;
  const isExtremeHeat = weather.temperature >= 48;
  const isExtremeCold = weather.temperature <= -10;
  const isExtremeTemp = isExtremeHeat || isExtremeCold;

  let severity = 'normal';
  let reason = 'Weather conditions are normal';

  if (isStorm) { severity = 'critical'; reason = `Storm/Thunderstorm detected — Rainfall: ${weather.rainfall}mm`; }
  else if (isDrought) { severity = 'critical'; reason = `Drought conditions — Temp: ${weather.temperature}°C, Humidity: ${weather.humidity}%`; }
  else if (isExtremeHeat) { severity = 'warning'; reason = `Extreme heat — ${weather.temperature}°C`; }
  else if (isExtremeCold) { severity = 'warning'; reason = `Extreme cold — ${weather.temperature}°C`; }
  else if (isHeavyRain) { severity = 'warning'; reason = `Heavy rainfall — ${weather.rainfall}mm`; }

  return { isStorm, isDrought, isExtremeTemp, isHeavyRain, severity, reason };
}
