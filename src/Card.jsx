import { useState } from "react";

const Card = () => {
    const apiKey = import.meta.env.VITE_REACT_APP_API_KEY;
    const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
    const [city, setCity] = useState("");
    const [weatherData, setWeatherData] = useState(null);
    const [gradientColor, setGradientColor] = useState("linear-gradient(135deg, #F7CAC9, #92A8D1)");
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        setCity(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            checkWeather();
        }
    };

    const updateGradientColor = (weather) => {
        const colors = {
            Clouds: "linear-gradient(160deg,#6e6ecb,#71a7f1,#a7c8f6)",
            Clear: "linear-gradient(135deg, #dccee2, #F5B041)",
            Rain: "linear-gradient(135deg, #0B3954,#4a7690 ,#696565)",
            Drizzle: "linear-gradient(175deg, #f4a65d,#eed4bb, #BBD2C5, #688497, #304352)",
            Mist: "linear-gradient(135deg, #f7bebd, #92A8D1)",
            Snow: "linear-gradient(160deg,#e8ebee,#b2e7f1,#50c6de, #78dff3)",
        };

        setGradientColor(colors[weather] || "linear-gradient(135deg, #F7CAC9, #92A8D1)");
    };


    const checkWeather = async () => {
        try {
            const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
            const data = await response.json();

            if (response.status === 404) {
                setError(true);
                setWeatherData(null);
            } else {
                setWeatherData(data);
                updateGradientColor(data.weather[0].main);
                setError(false);
            }
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setError(true);
            setWeatherData(null);
        }
    };


    const renderWeather = () => {
        if (error) {
            return <div className="error"><p>Invalid City Name</p></div>;
        }

        if (!weatherData) {
            return null;
        }

        const { main, name, weather, wind } = weatherData;

        return (
            <div className="weather">

                <img src={`./src/assets/${getWeatherIcon(weather[0].main)}.png`} className="weather-icon" alt=""></img>
               
                <h1 className="temp">{Math.round(main.temp)}°C</h1>

                <h2 className="city">{name}</h2>

                <div className="details">
                    <div className="col">
                        <img src="images/humidity.png" alt=""></img>
                        <div>
                            <p className="humidity">{main.humidity}%</p>
                            <p>Humidity</p>
                        </div>
                    </div>
                    <div className="col">
                        <img src="images/wind.png" alt=""></img>
                        <div>
                            <p className="wind">{wind.speed} km/h</p>
                            <p>Wind Speed</p>
                        </div>
                    </div>
                </div>

            </div>
        );
    };

    const getWeatherIcon = (weather) => {
        const icons = {
            Clouds: 'clouds',
            Clear: 'clear',
            Rain: 'rain',
            Drizzle: 'drizzle',
            Mist: 'mist',
            Snow: 'snow',
        };

        return icons[weather] || 'clouds';
    };

    return (
        <div>
            <div className="card" style={{ background: gradientColor }}>
                <div className="search">
                    <input
                        type="text"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Search city..."
                        name="city"
                        value={city}
                        spellCheck="false"
                    ></input>
                    <button onClick={checkWeather}><img src="./src/assets/search.png" alt=""></img></button>
                </div>
                {renderWeather()}
            </div>
        </div>
    );
};

export default Card;
