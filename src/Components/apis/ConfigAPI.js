import { getPath } from "../utils.js";
import { removeDiacritics } from "../../../electron/scripts/diacritics.js";
import codes from "../../../electron/public/data/country-codes.json";

function getFullCountryFromISOCode(ISOCode) {
	let results = codes.filter(code => code['alpha-2'] === ISOCode);

	if(results && results.length > 0){
		return results[0].name;
	}
	return "Country name not found";
}

export function getCities(cityName, callback, callbackError){
	let url,
	    fetchProps = {method: "POST", headers: {"Accept":"application/json", "Content-Type":"application/x-www-form-urlencoded", "X-Requested-With": "XMLHttpRequest"}};

	if(typeof cityName === "string" && cityName.length > 0){
		fetchProps.body = "cityName=" + encodeURIComponent(cityName);
	}

	url = getPath();

	fetch(url, fetchProps).then(res => {
		if(!res.ok)
			throw Error("Could not get cities!");
		return res.json();
	}).then(data => {
		let cities = data.map(function(city){
			return {
				id: city.id,
				cityName: removeDiacritics(city.name),
				state: ( city.hasOwnProperty("state") ) ? city.state.trim() : "",
				country: ( city.hasOwnProperty("country") ) ? getFullCountryFromISOCode(city.country) : "N.A.",
				lat: city.coord.lat,
				lon: city.coord.lon
			};
		});
		callback(cities);
	}).catch(err => {
		callbackError(err.message);
	});
}

