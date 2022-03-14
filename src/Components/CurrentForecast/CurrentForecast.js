import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getForecastForCityFromAPI } from "../apis/WeatherAPI.js";
import { formatWindData, MEASUREMENTS } from "../utils.js";
import "../../../electron/styles/weather.css";


function CurrentForecast(){
	const [windData, setWindData] = useState({windSpeed: "", windGust: "", windDeg: "", windCompassDirection: ""});
	const [city, setCityName] = useState("_");
	const [isMetricActive, setActiveMetric] = useState(true);
	const [is24hrs, setIs24hrs] = useState(true);
	const [autoRefresh, setIsAutoRefresh] = useState(true);
	const [speedUnit, setSpeedUnit] = useState("km/h");
	const { cityId } = useParams();
	const location = useLocation();// location.state.


	useEffect(() => {
		document.title = "Current Forecast";
	}, []);/* componentDidMount */


	useEffect(() => {
		if(location.hasOwnProperty("state") )
			setUpParams(location.state);

		let unitsName = isMetricActive ? "metric" : "imperial";
		setSpeedUnit(MEASUREMENTS[unitsName].wind);
		getForecastForCityFromAPI(cityId, unitsName, renderRequestedWeather, requestedWeatherError);
	}, [cityId]);/* componentDidMount */


	const setUpParams = (params) => {
		let newIsMetricActive = true, newIs24hrs = true, newAutoRefresh = true;
		if( params.hasOwnProperty("isMetricActive") )
			newIsMetricActive = (params.isMetricActive == false) ? false : true;

		if( params.hasOwnProperty("is24hrs") )
			newIs24hrs = (params.is24hrs == false) ? false : true;

		if( params.hasOwnProperty("autoRefresh") )
			newAutoRefresh = (params.autoRefresh == false) ? false : true;

		setActiveMetric(newIsMetricActive);
		setIs24hrs(newIs24hrs);
		setIsAutoRefresh(newAutoRefresh);
	}

	const renderRequestedWeather = function(weather){
		let dataElement;
		if( weather.hasOwnProperty("current") ){
		 	dataElement = formatWindData(weather.current);
		 	setWindData(dataElement);
		 }

		if( weather.hasOwnProperty("cityName") ){
			setCityName(weather.cityName);
		 }

		console.log(weather);
	};

	const requestedWeatherError = (message) => {
		console.log(message);
	}

	return (
  <div className="main-enclosure">
    <div className="top-strip">
      <div className="current-conditions-icon"></div>
      <div className="city-temp-enclosure enclosure">
        <div className="city-name">{ city }</div>
        <div className="temp-enclosure enclosure">
          <div className="temperature-actual"></div>
          <div className="temperature-feels-like">_</div>
        </div>
        <div className="current-weather-conditions"><p>Test condition</p>
        </div>
        <div className="weather-condition-description"><p>Test condition</p>
        </div>
        <div className="date-time">date:time</div>
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
          <div className="atmospheric-pressure"></div>
        </div>
        <div className="humidity-main-enclosure enclosure">
          <div className="category"> Humidity </div>
          <div className="separator"> | </div>
          <div className="humidity"></div>
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
        <a className="link-radar special-features-button" href="radar.html">Radar</a>
      </div>
      <div className="options-settings-enclosure enclosure">
        <div className="refresh-forecast-icon settings-inline">
          <i className="fas fa-sync-alt" alt="refresh"></i>
        </div>
        <Link to="/" className="settings-icon settings-inline">
          &times;<i className="fas fa-wrench"> </i>
        </Link>
        {/* <div className="settings-icon settings-inline"><i className="fas fa-wrench"></i></div> */}
      </div>
    </div>
    <div className="bottom-strip">
      <div className="error-message">Connection Error</div>
      {/* This strip will have forecast weather 'cards' */}
      <div className="hourly-menu-enclosure">
        <a className="hourly-view-link" href="hourly.html"> Hourly </a>
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

