import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from "react-router-dom";
import ConfigPage from "./Components/Config/ConfigPage.js";
import CurrentForecast from "./Components/CurrentForecast/CurrentForecast.js";
import HourlyPage from "./Components/Hourly/HourlyPage.js";
import { getImages, getCityAndWeatherByLocation } from "./Components/apis/MainAPI.js";
import { getGeoLocation } from "./Components/utils.js";


function App(){
	const [location, updateLocation] = useState({latitude: null, longitude: null});
	const [images, setImages] = useState([]);
	const [loadConfig, setConfigLoading] = useState(true);
	const [city, setCity] = useState({});
	const [isMetricActive, setActiveMetric] = useState(true);
	const [is24hrs, setIs24hrs] = useState(true);
	const [autoRefresh, setIsAutoRefresh] = useState(true);


	useEffect(() => {
		let loc = getGeoLocation(updateLocation);
	}, []);/* componentDidMount */

	useEffect(() => {
		document.body.style.backgroundSize = "cover";
		getImages(setImagesCallback, imagesErrorCallback);
	}, []);/* componentDidMount */

	useEffect(() => {
		getCityAndWeatherByLocation(location, callbackForCityAndWeather, callbackErrorForCityAndWeather);
	}, [location]);


	const goToCurrentForecast = (city, newIsMetricActive, newIs24hrs, newAutoRefresh) => {
		if(typeof newIsMetricActive === 'boolean')
			setActiveMetric(newIsMetricActive);
		if(typeof newIs24hrs === 'boolean')
			setIs24hrs(newIs24hrs);
		setIsAutoRefresh(newAutoRefresh);
		console.log(newIsMetricActive, newIs24hrs, newAutoRefresh);

		if(city !== null){
			setCity(city);
			setConfigLoading(false);
		}
	};

	const goToConfig = function(){
		setConfigLoading(true);
	};

	const callbackForCityAndWeather = (response) => {
		setCity(response.city);
		setConfigLoading(false);
	};

	const callbackErrorForCityAndWeather = function(message){
		console.log(message);
	}

	const setImagesCallback = (imagesList) => {
		let defaultImage = "electron/img/backgrounds/background_003_blue_sea_sky.jpg", i;
		for(i = imagesList.length - 1; i > 0; i--){
			if(imagesList[i] === defaultImage){
				imagesList[i] = imagesList[0];
				imagesList[0] = defaultImage;
				break;
			}
		}

		setImages(imagesList);
	}
	const imagesErrorCallback = (message) => {
		console.log(message);
		setImages(["electron/img/backgrounds/background_003_blue_sea_sky.jpg"]);
	}

	return (
	<HashRouter>
		<Routes>
			<Route path="/" element={
			loadConfig === true ? (
				<ConfigPage images={ images } currentCity={ city } currentMetric={ isMetricActive } is24hrsSet={ is24hrs } goToCurrentForecast={ goToCurrentForecast } />
			) : (
				<CurrentForecast city={ city } isMetricActive={ isMetricActive } is24hrs={ is24hrs } goToConfig={ goToConfig } />
			)} />
			<Route path="/hourly" element={ <HourlyPage goToCurrentForecast={ goToCurrentForecast } /> } />
		</Routes>
	</HashRouter>
	);
}

export default App;

