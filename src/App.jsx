import { useState } from "react";
import "./App.css";

const API_KEY = "insert your key";

const getBackgroundClass = (weatherMain) => {
  switch (weatherMain) {
    case "Clear":
      return "bg-gradient-to-b from-blue-400 to-blue-100";
    case "Clouds":
      return "bg-gradient-to-b from-gray-400 to-gray-200";
    case "Rain":
      return "bg-gradient-to-b from-blue-900 to-blue-400";
    case "Snow":
      return "bg-gradient-to-b from-gray-100 to-white";
    case "Thunderstorm":
      return "bg-gradient-to-b from-gray-700 to-gray-400";
    case "Drizzle":
      return "bg-gradient-to-b from-blue-300 to-blue-100";
    case "Mist":
    case "Fog":
      return "bg-gradient-to-b from-gray-300 to-gray-100";
    default:
      return "bg-blue-100";
  }
};

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&units=metric&appid=${API_KEY}`
      );
      if (!res.ok) {
        throw new Error("City not found");
      }
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const bgClass = getBackgroundClass(weather?.weather?.[0]?.main);

  return (
    <div
      className={`${bgClass} min-h-screen flex flex-col items-center justify-center p-6`}
    >
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Weather App</h1>
      <div className="flex gap-2 mb-6 max-w-md w-full">
        <input
          type="text"
          placeholder="Enter City Name"
          className="flex-grow p-3 rounded-l-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key == "Enter" && fetchWeather()}
        />
        <button
          className="bg-blue-600 rounded-r-lg text-white px-6 hover:bg-blue-700 transition"
          onClick={fetchWeather}
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading</p>}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {weather && (
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">
            {weather.name},{weather.sys.country}
          </h2>
          <p className="text-5xl font-bold mb-2 text-gray-700">
            {Math.round(weather.main.temp)}°C
          </p>
          <p className="capitalize text-gray-700 mb-4">
            {weather.weather[0].description}
          </p>
          <img
            className="mx-auto"
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          ></img>

          <div className="grid grid-cols-2 gap-4 mt-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-700 mb-4">
                {weather.main.humidity}%
              </p>
              <p className="text-lg text-gray-500">Humidity</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-700 mb-4">
                {weather.wind.speed} m/s
              </p>
              <p className="text-lg text-gray-500">Wind Speed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
