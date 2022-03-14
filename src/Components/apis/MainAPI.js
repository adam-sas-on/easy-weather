import { getPath } from "../utils.js";


export function getImages(callback, callbackError){
	let url,
	    fetchProps = {method: "POST", headers: {"Accept":"application/json", "Content-Type":"application/x-www-form-urlencoded", "X-Requested-With": "XMLHttpRequest"}};

	fetchProps.body = "images=1";

	url = getPath();

	fetch(url, fetchProps).then(res => {
		if(!res.ok)
			throw Error("Could not get images!");
		return res.json();
	}).then(data => {
		let images = [];
		if(data.hasOwnProperty('files') ){
			images = data.files.map(function(fileName, index){
				let newFileName = fileName;
				if(fileName.length > 0 && fileName.charAt(0) == '/')
					newFileName = fileName.substr(1);
				return newFileName;
			});
		}
		callback(images);
	}).catch(err => {
		callbackError(err.message);
	});
}

/**
 * @param {object} location - {location: Number, location: Number};
 * @param {function} callback - function to call when success;
 * @param {function} callbackError - function to call when error occurs;
 */
export function getCityAndWeatherByLocation(location, callback, callbackError){
	if(isNaN(parseFloat(location.longitude)) || isNaN(parseFloat(location.latitude)) ){
		return;
	}

	let url = getPath(),
	    fetchProps = {method: "POST", headers: {"Accept":"application/json", "Content-Type":"application/x-www-form-urlencoded", "X-Requested-With": "XMLHttpRequest"}};

	fetchProps.body = "longitude=" + encodeURIComponent(location.longitude) + "&latitude=" + encodeURIComponent(location.latitude);

	fetch(url, fetchProps).then(res => {
		if(!res.ok)
			throw Error("Could not get city and weather!");
		return res.json();
	}).then(data => {
		if(!data.hasOwnProperty("city") || !data.hasOwnProperty("weather") ){
			callbackError("Wrong format of data!");
			return;
		}
		callback(data);
	}).catch(err => {
		callbackError(err.message);
	});
}

