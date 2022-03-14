import React, { useState, useEffect } from "react";
import { Link/*, useLocation, useParams*/ } from "react-router-dom";
import { getForecastForCityFromAPI } from "../apis/WeatherAPI.js";
import { formatWindData,
         formatTemperature,
         formatUpdateTime,
         formatCurrentWeatherConditions,
         getWeatherIconURL,
         formatAtmosphericPressure,
         formatHumidity, MEASUREMENTS } from "../utils.js";
import "../../../electron/styles/weather.css";


/**
 *
 */
function CurrentForecast({ city, isMetricActive, is24hrs, goToConfig }){
	const [windData, setWindData] = useState({windSpeed: "", windGust: "", windDeg: "", windCompassDirection: ""});
	const [temperature, setTemperature] = useState("");
	const [pressure, setPressure] = useState("");
	const [humidity, setHumidity] = useState("");
	const [dateTime, setDateTime] = useState("date:time");
	const [currentWeatherCond, setCurrentWeatherCond] = useState("Test condition");
	const [currentWeatherDesc, setCurrentWeatherDesc] = useState("Test condition");
	const [cityName, setCityName] = useState("_");
	const [currentConditionsIcon, setCurrentConditionsIcon] = useState("");
	const [autoRefresh, setIsAutoRefresh] = useState(true);
	const [speedUnit, setSpeedUnit] = useState("km/h");
	const [temperatureUnit, setTemperatureUnit] = useState("");
	const [pressureUnit, setPressureUnit] = useState("");
	//const { cityId } = useParams();
	//const location = useLocation();// location.state.


	useEffect(() => {
		document.title = "Current Forecast";
	}, []);/* componentDidMount */


	useEffect(() => {
		if(location.hasOwnProperty("state") )
			setUpParams(location.state);

		let unitsName = isMetricActive ? "metric" : "imperial", cityId = city.hasOwnProperty("id") ? city.id : -1;
		setSpeedUnit(MEASUREMENTS[unitsName].wind);
		getForecastForCityFromAPI(cityId, unitsName, renderRequestedWeather, requestedWeatherError);
	}, [city]);/* componentDidMount */


	const setUpParams = (params) => {
		let newAutoRefresh = true;

		if( params.hasOwnProperty("autoRefresh") )
			newAutoRefresh = (params.autoRefresh == false) ? false : true;

		setIsAutoRefresh(newAutoRefresh);
	}

	const renderRequestedWeather = function(weather){
		let dataElement;
		if( weather.hasOwnProperty("current") ){
		 	dataElement = formatWindData(weather.current, isMetricActive);
		 	setWindData(dataElement);

			dataElement = formatTemperature(weather.current, isMetricActive);
			setTemperature(dataElement.value);
			setTemperatureUnit(dataElement.unit);

			dataElement = formatAtmosphericPressure(weather.current, isMetricActive);
			setPressure(dataElement.value);
			setPressureUnit(dataElement.unit);

			dataElement = formatHumidity(weather.current);
			setHumidity(dataElement);
		 }

		dataElement = formatUpdateTime(weather, is24hrs);
		if(dataElement)
			setDateTime(dataElement);

		dataElement = formatCurrentWeatherConditions(weather);
		if(dataElement){
			setCurrentWeatherDesc(dataElement.desc);
			setCurrentWeatherCond(dataElement.condition);
		}

		dataElement = getWeatherIconURL(weather);
		if(dataElement)
			setCurrentConditionsIcon(dataElement);

		// todo: sunrise, sunset;
		

		if( weather.hasOwnProperty("cityName") ){
			setCityName(weather.cityName);
		 }

		console.log(weather);
	};

	const requestedWeatherError = (message) => {
		console.log(message);
	}

	const goBack = (e) => {
		e.preventDefault();
		goToConfig();
	};


	return (
  <div className="main-enclosure">
    <div className="top-strip">
      <div className="current-conditions-icon" style={ currentConditionsIcon.length > 0 ? { backgroundImage: "url('" + currentConditionsIcon + "')" } : {}}></div>
      <div className="city-temp-enclosure enclosure">
        <div className="city-name">{ cityName }</div>
        <div className="temp-enclosure enclosure">
          <div className="temperature-actual">{ temperature } { temperatureUnit }</div>
          <div className="temperature-feels-like">_</div>
        </div>
        <div className="current-weather-conditions"><p>{ currentWeatherCond }</p>
        </div>
        <div className="weather-condition-description"><p>{ currentWeatherDesc }</p>
        </div>
        <div className="date-time">{ dateTime }</div>
      </div>
      {/* This enclosure will have status like wind speed, direction, humidity */}
      <div className="other-stats-enclosure enclosure">
        <div className="wind-main-enclosure enclosure">
          <div className="category"> Wind </div>
          <div className="separator"> | </div>
          <div className="wind-speed">Speed: { windData.windSpeed } { speedUnit } { windData.windCompassDirection }</div>
          <div className="separator"> | </div>
          <div className="wind-gust">Gust: { windData.windGust } { speedUnit } || -</div>
        </div>
        <div className="pressure-main-enclosure enclosure">
          <div className="category"> Pressure </div>
          <div className="separator"> | </div>
          <div className="atmospheric-pressure">{ pressure } { pressureUnit }</div>
        </div>
        <div className="humidity-main-enclosure enclosure">
          <div className="category"> Humidity </div>
          <div className="separator"> | </div>
          <div className="humidity">{ humidity }</div>
        </div>
        <div className="sunrise-set-enclosure enclosure">
          <div className="category"> Sun </div>
          <div className="separator"> | </div>
          <div className="sun-sunrise"></div>
          <div className="separator"> | </div>
          <div className="sun-sunset"></div>
        </div>
        <div className="weather-forecast-auto-update"></div>
      </div>
      <div className="special-features-section">
        <a className="link-radar special-features-button" href="#">(Radar.html)</a>
      </div>
      <div className="options-settings-enclosure enclosure">
        <div className="refresh-forecast-icon settings-inline">
          <i className="fas fa-sync-alt" alt="refresh"></i>
        </div>
        <a href="#" className="settings-icon settings-inline" onClick={ goBack }>
          &times;<i className="fas fa-wrench"> </i>
        </a>
        {/* <div className="settings-icon settings-inline"><i className="fas fa-wrench"></i></div> */}
      </div>
    </div>
    <div className="bottom-strip">
      <div className="error-message">Connection Error</div>
      {/* This strip will have forecast weather 'cards' */}
      <div className="hourly-menu-enclosure">
        <Link to="/hourly" className="hourly-view-link"> Hourly </Link>{/* <a className="hourly-view-link" href="hourly.html"> Hourly </a> */}
        <a className="five-day-header"> 5-day </a>
      </div>
      <div className="twelve-hour-section">
        <div className="forecast-cards-enclosure enclosure">
          {/* Forecast cards go here */}
        </div>
      </div>
      <div className="daily-section">
        <div className="daily-forecast-cards-enclosure enclosure">
          {/* Forecast cards go here */}
        </div>
      </div>
    </div>
  </div>
	)
}

export default CurrentForecast;

