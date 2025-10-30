import React, { useState } from "react";

function WeatherNowApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    setError("");
    setWeather(null);

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found!");
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        city: name,
        country,
        temp: weatherData.current_weather.temperature,
        wind: weatherData.current_weather.windspeed,
        condition: weatherData.current_weather.weathercode,
      });
    } catch (err) {
      setError("Error fetching weather data.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🌤 Weather Now</h2>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button style={styles.button} onClick={fetchWeather}>
          Search
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {weather && (
        <div style={styles.card}>
          <h3>
            {weather.city}, {weather.country}
          </h3>
          <p>🌡 Temperature: {weather.temp}°C</p>
          <p>💨 Wind Speed: {weather.wind} km/h</p>
          <p>☁ Condition Code: {weather.condition}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "30px",
    background: "#f1f5f9",
    minHeight: "100vh",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  inputContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    width: "200px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  card: {
    marginTop: "20px",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    display: "inline-block",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};

export default WeatherNowApp;
