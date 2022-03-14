import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from "react-router-dom";
import ConfigPage from "./Components/Config/ConfigPage.js";
import CurrentForecast from "./Components/CurrentForecast/CurrentForecast.js";
import { getImages } from "./Components/apis/MainAPI.js";
import { getGeoLocation } from "./Components/utils.js";


function App(){
	const [location, updateLocation] = useState({location: 0, location: 0});
	const [images, setImages] = useState([]);
	const [loadConfig, setConfigLoading] = useState(true);


	useEffect(() => {
		let loc = getGeoLocation(updateLocation);
	}, []);/* componentDidMount */

	useEffect(() => {
		document.body.style.backgroundSize = "cover";
		getImages(setImagesCallback, imagesErrorCallback);
	}, []);/* componentDidMount */




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
			<Route path="/currentForecast/:cityId" element={ <CurrentForecast /> } />
			<Route path="/" element={ <ConfigPage images={ images } /> } />
		</Routes>
	</HashRouter>
	);
}

export default App;

