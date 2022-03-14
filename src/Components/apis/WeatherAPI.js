import { getPath } from "../utils.js";


// export function getForecastFromAPI(lat, lon, key, units, callback, callbackError){
	//const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}&units=${units}`;
// }

export function getForecastForCityFromAPI(cityId, units, callback, callbackError){
	let url = getPath(),
	    fetchProps = {method: "POST", headers: {"Accept":"application/json", "Content-Type":"application/x-www-form-urlencoded", "X-Requested-With": "XMLHttpRequest"}};

	fetchProps.body = "cityId=" + encodeURIComponent(cityId);

	fetch(url, fetchProps).then(res => {
		if(!res.ok)
			throw Error("Could not get weather data!");
		return res.json();
	}).then(data => {
		callback(data);
	}).catch(err => {
		callbackError(err.message);
	});

}

