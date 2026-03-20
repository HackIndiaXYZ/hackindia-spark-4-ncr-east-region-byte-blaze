import axios from 'axios';
import pool from '../db/connection.js';


export async function fetchWeatherData(latitude, longitude) {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: latitude,
        lon: longitude,
        appid: process.env.WEATHER_API_KEY,
        units: 'metric',
      },
    });

    const data = response.data;
    return {
      location: data.name,
      temperature: data.main.temp,
      temperatureMin: data.main.temp_min,
      temperatureMax: data.main.temp_max,
      rainfall: data.rain ? data.rain['1h'] || 0 : 0,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    throw error;
  }
}

/**
 * Store weather data in database
 */
export async function storeWeatherData(location, latitude, longitude, weatherData) {
  try {
    const result = await pool.query(
      `INSERT INTO weather_logs (location, latitude, longitude, rainfall, temperature, temperature_min, temperature_max)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [location, latitude, longitude, weatherData.rainfall, weatherData.temperature, weatherData.temperatureMin, weatherData.temperatureMax]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error storing weather data:', error.message);
    throw error;
  }
}

/**
 * Get latest weather data for a location
 */
export async function getLatestWeather(location) {
  try {
    const result = await pool.query(
      `SELECT * FROM weather_logs WHERE location = $1 ORDER BY created_at DESC LIMIT 1`,
      [location]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching latest weather:', error.message);
    throw error;
  }
}

/**
 * Get weather data within a date range
 */
export async function getWeatherDataRange(location, startDate, endDate) {
  try {
    const result = await pool.query(
      `SELECT * FROM weather_logs 
       WHERE location = $1 AND created_at BETWEEN $2 AND $3
       ORDER BY created_at DESC`,
      [location, startDate, endDate]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching weather range:', error.message);
    throw error;
  }
}
