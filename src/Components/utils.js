
export const MEASUREMENTS = {
  metric: {
    temperature: " °C",
    wind: " km/h",
    pressure: " kPa"
  },
  imperial: {
    temperature: " °F",
    wind: " m/h",
    pressure: " mb"
  }
};


export function getPath(){
	var url = window.location.href;
	//if(!window.location.origin){
	//	url = window.location.protocol +"//"+ window.location.host;
	//} else url = window.location.origin;

	//if(url===null || !(url) || (typeof url==='string' && url=='null')) url="";
	//let rrs=/\/$/.test(url);
	//if(!rrs) url=url+"/";
	return url;
}

/**
 */
export function getGeoLocation(callback){
	var location = {latitude: null, longitude: null};

	navigator.geolocation.getCurrentPosition(function(position){
		location.latitude = position.coords.latitude;
		location.longitude = position.coords.longitude;
		callback(location);
	});
	return location;
}

/**
 *	Converts degrees into text representing geographical direction (compass direction);
 * @returns String
 */
export function getWindCompassDirectionFromDegrees(degrees){
	const compassDirections = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
	const value = ((degrees / 22.5) + 0.5);
	return compassDirections[Math.floor(value % 16)];
}

/**
 *
 * @param currentWeather: {main: {}, wind: {}, clouds: {}};
 * @returns object of wind
 */
export function formatWindData(currentWeather){
	let result = {windSpeed: "unknown", windGust: "unknown", windDeg: "unknown", windCompassDirection: ""};

	if( !currentWeather.hasOwnProperty("wind") )
		return result;

	let wind = currentWeather.wind;
	if(wind.hasOwnProperty("speed") )
		result.windSpeed = wind.speed;
	if(wind.hasOwnProperty("deg") && !isNaN(parseFloat(wind.deg)) ){
		result.windDeg = parseFloat(wind.deg);
		result.windCompassDirection = getWindCompassDirectionFromDegrees(result.windDeg);
	}

	if(wind.hasOwnProperty("var_end") )
		result.windGust = wind.var_end;

	return result;
}

