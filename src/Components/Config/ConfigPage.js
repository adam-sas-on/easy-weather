import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCities } from "../apis/ConfigAPI.js";
import ConfigOptions from "./ConfigOptions.js";
import "../../../electron/styles/main.css";

/**
 *	Component for a page where user can setup filters
 * like location (city) and format of displayed weather;
 *
 * @param images - array of strings with url path to images;
 * @returns {JSX.Element}
 */
function ConfigPage({ images, currentCity, currentMetric, is24hrsSet, goToCurrentForecast }){
	const [city, setCity] = useState("");
	const [cityList, setCityList] = useState([]);
	const [cityNodes, setCityNodes] = useState([]);
	const [citySelectedIndex, setCityIndex] = useState(-1);
	const [selectedCityLabel, setCityLabel] = useState("");
	const [buttonDisabled, disableButton] = useState(true);
	const [isMetricActive, setActiveMetric] = useState(currentMetric);
	const [is24hrs, setIs24hrs] = useState(is24hrsSet);
	const [autoRefresh, setIsAutoRefresh] = useState(true);
	const [imageIndex, setImageIndex] = useState(0);


	useEffect(() => {
		document.title = "Easy Weather - Configure City";

		let imgName = (Array.isArray(images) && images.length > 0) ? images[0] : "electron/img/backgrounds/background_003_blue_sea_sky.jpg";
		imgName = "url('" + imgName + "')";
		document.body.style.backgroundImage = imgName;// DEFAULT_BACKGROUND_IMAGE;
	}, []);/* componentDidMount */

	useEffect(() => {
		if(currentCity.hasOwnProperty("name") )
			setCity(currentCity.name);
	}, [currentCity]);


	const buildCityNodes = function(cities){
		let cityLi = cities.map(function(city, index){
			if(index == citySelectedIndex)
				return <li key={ city.id } data-index={ index } className="list-group-item city-item city-selected">{ city.cityName }</li>;
			else
				return <li key={ city.id } data-index={ index } className="list-group-item city-item">{ city.cityName }</li>;
		});
		return cityLi;
	};

	const renderCitySearchResults = (cities) => {
		let cityLi = buildCityNodes(cities);

		setCityList(cities);
		setCityNodes(cityLi);
	};

	const renderCitiesError = (message) => {
		console.log("renderCitiesError:", message);
		// let liErr = [<li key={ 0 } className="list-group-item city-item">{ message }</li>];
		// setCityList(liErr);
		disableButton(true);
	};

	function updateCity(e){
		setCity(e.target.value);
		setCityList([]);
		setCityNodes([]);
		disableButton(true);
		setCityIndex(-1);

		getCities(e.target.value, renderCitySearchResults, renderCitiesError);
	}


	const cityResultsListClick = (e) => {
		let index = parseInt(e.target.getAttribute("data-index"), 10);
		if(index < 0 || index >= cityList.length)
			return;

		let label = cityList[index].cityName + ", " +  cityList[index].state + " " + cityList[index].country;
		setCityLabel(label);
		setCityIndex(index);
		disableButton(false);
	};

	const saveButtonClick = function(e){
		if(buttonDisabled)
			return;

		disableButton(true);
		setCityIndex(-1);
		// todo: save selected city somewhere;
	}

	const closeConfigEnclosureClick = (e) => {
		disableButton(true);
		if(citySelectedIndex < 0){
			e.preventDefault();
			return;
		}
		// go to current-forecast.html;
		let selectedCity = (citySelectedIndex >= 0 && citySelectedIndex < cityList.length)? cityList[citySelectedIndex] : null ;
		goToCurrentForecast(selectedCity, isMetricActive, is24hrs, autoRefresh);
	};

	const backgroundImageEnclosureClick = (e) => {
		if(!Array.isArray(images) || images.length < 2)
			return;

		let newImageIndex = imageIndex + 1;
		if(newImageIndex >= images.length)
			newImageIndex = 0;
		// liveLoadBackgroundImage();
		document.body.style.backgroundImage = "url('" + e.target.src + "')";

		// refreshImages:
		let imagesCont = document.getElementsByClassName("options-bkg-img-thumbnail"), i, count = imagesCont.length;
		for(i = 0; i < count; i++){
			imagesCont[i].classList.remove("active-background-image-selected");
		}

		e.target.classList.add("active-background-image-selected");// toggleClass()?
		//setImageIndex(newImageIndex);
	};

	return (
	  <>
<div className="close-config-enclosure" onClick={ backgroundImageEnclosureClick }>
    <div className="close-settings-icon">
      <i className="fas fa-times"></i>
    </div>
  </div>
  <div className="configuration-container">
    <div className="card card-search-enclosure margin-left search-page-width-items">
      <div className="card-body">
        <h2 className="card-title">Search</h2>
        <p className="card-text">Start typing a city to search. Pick a city from results and hit 'Save'</p>
      </div>
      <div className="input-group input-group-sm mb-3">
        <input type="text" className="form-control city-search-box" aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-sm" onKeyUp={ updateCity } />
      </div>
    </div>
    <div>
      <p className=" h6 margin-left caption-label"> Search Results </p>
    </div>
    <div className="card city-results-container margin-left search-page-width-items">
      <ul className="list-group city-results-list" onClick={ cityResultsListClick }>
        { cityNodes }
      </ul>
    </div>
    <div>
      { /* Label that shows selected city */ }
      <p className="h6 selected-city-label margin-left caption-label">{ selectedCityLabel }</p>
    </div>
    <div className="save-city-div search-page-width-items margin-left">
      <button type="button" className="btn btn-primary sharp-button save-button" disabled={ buttonDisabled }>Add to favorites</button>
    </div>
    <div className="save-city-div search-page-width-items margin-left">
        <button type="button" className="btn btn-primary sharp-button save-button" onClick={ closeConfigEnclosureClick } disabled={ buttonDisabled }>Show weather</button>
    </div>
  </div>
  <ConfigOptions images={ images }
                 isMetricActive={ isMetricActive }
                 setActiveMetric={ setActiveMetric }
                 is24hrs={ is24hrs }
                 setIs24hrs={ setIs24hrs }
                 autoRefresh={ autoRefresh }
                 setIsAutoRefresh={ setIsAutoRefresh } />
	  </>
	);
}

export default ConfigPage;

