import { useState } from "react";
import "./index.css";

const API_KEY = "aed40af872a74ba2f3cf2dfa03cf2dda";

function App() {
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("Place, Country");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  // Date text
  const getDateText = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  // Fetch weather + forecast
  const fetchWeather = async () => {
    if (!city) return;

    try {
      // CURRENT WEATHER
      const res1 = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const current = await res1.json();

      if (current.cod !== 200) {
        alert("City not found");
        return;
      }

      setLocation(`${current.name}, ${current.sys.country}`);
      setWeather(current);

      // FORECAST (5 days / 3 hour)
      const res2 = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await res2.json();

      setForecast(forecastData.list);
    } catch (error) {
      alert("Error fetching weather data");
    }
  };

  return (
    <div className="app">

      {/* HEADER */}
      <div className="header">
        <div className="search">

          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button onClick={fetchWeather}>Get Weather</button>
        </div>

        <div className="locate">
        <p>📍 {location}</p>
        <p>{getDateText()}</p>
        </div>

      </div>

      {/* MAIN SECTION */}
      <div className="main">

        {/* CURRENT WEATHER */}
        <div className="currentweather">
          {!weather ? (
            <h3>Search for a city</h3>
          ) : (
            <>
              <div className="tempe">
                <h1>{Math.round(weather.main.temp)}°C</h1>
                <p className="condition">
                  {weather.weather[0].description}
                </p>

                <div className="extra">
                  <span>💨 {weather.wind.speed} km/h</span>
                  <span>💧 {weather.main.humidity}%</span>
                </div>
              </div>

              <div className="icon">⛈️</div>
            </>
          )}
        </div>

        {/* WEEKLY FORECAST (RIGHT CARD) */}
        <div className="weekly">
          {forecast
            .filter((_, index) => index % 8 === 0)
            .slice(0, 5)
            .map((item, index) => (
              <div key={index} className="day">
                <span className="text">
                  {new Date(item.dt_txt).toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </span>
                <span className="image">🌧️</span>
                <span className="temp">{Math.round(item.main.temp)}°C</span>
              </div>
            ))}
        </div>
      </div>

      {/* HOURLY TIMELINE */}
      <div className="hourly">
        {forecast.slice(0, 6).map((item, index) => (
          <div key={index} className="hours">
            <p>
              {new Date(item.dt_txt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>{Math.round(item.main.temp)}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
