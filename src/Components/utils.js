
const dFormat = new Intl.DateTimeFormat(undefined, {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false, weekday:'short'});
const dFormatImperial = new Intl.DateTimeFormat(undefined, {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true, weekday:'short'});

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
 * @param currentWeather - {main: {}, wind: {}, clouds: {}};
 * @param useMetric - boolean if metric should be used;
 * @returns object of wind
 */
export function formatWindData(currentWeather, useMetric){
	let result = {windSpeed: "unknown", windGust: "unknown", windDeg: "unknown", windCompassDirection: ""};

	if( !currentWeather.hasOwnProperty("wind") )
		return result;

	let wind = currentWeather.wind;
	if(wind.hasOwnProperty("speed") ){
		result.windSpeed = useMetric ? Math.ceil(wind.speed*36.0)/10.0 : Math.ceil(wind.speed*10.0)/10.0;
	}
	if(wind.hasOwnProperty("deg") && !isNaN(parseFloat(wind.deg)) ){
		result.windDeg = parseFloat(wind.deg);
		result.windCompassDirection = getWindCompassDirectionFromDegrees(result.windDeg);
	}

	if(wind.hasOwnProperty("var_end") )
		result.windGust = wind.var_end;

	return result;
}

/**
 *
 * @param currentWeather - {main: {}, wind: {}, clouds: {}};
 * @param useMetric - boolean if metric should be used;
 * @returns
 */
export function formatTemperature(currentWeather, useMetric){
	let result = {value: "unknown", unit: ""};

	if( !currentWeather.hasOwnProperty("main") )
		return result;

	let mainW = currentWeather.main, temp;
	if( mainW.hasOwnProperty("temp") && !isNaN(parseFloat(mainW.temp)) ){
		temp = parseFloat(mainW.temp) - 273.15;// kelvin to celcius;
		if(useMetric !== true)
			temp = temp * 9.0/5.0 + 32.0;// celcius to kelvin;

		result.value = Math.floor(temp*10.0)/10.0;
	}

	result.unit = useMetric ? MEASUREMENTS.metric.temperature : MEASUREMENTS.imperial.temperature;
	return result;
}

/**
 *
 */
export function formatUpdateTime(weather, use24hrs){
	if( !weather.hasOwnProperty("time") )
		return false;

	let timeStr, date = new Date(parseInt(weather.time, 10) * 1000);// to milliseconds;
	if(use24hrs)
		timeStr = dFormat.format(date);
	else {
		timeStr = dFormatImperial.format(date);
	}

	return timeStr;
}

/**
 *
 */
export function formatCurrentWeatherConditions(weatherResponse){
	if( !weatherResponse.hasOwnProperty("weather") )
		return false;

	let weather = weatherResponse.weather, condition, result = {condition: "", desc: ""}, prop;
	if( Array.isArray(weather) && weather.length > 0){
		prop = weather[0];
		if(prop.hasOwnProperty("description") )
			result.desc = prop['description'];
	}

	condition = weather.reduce((acc, cv) => {
		acc += cv.main;
		return acc + " ";
	}, "").trim();

	result.condition = condition;
	return result;
}

/**
 * Returns the appropriate URL based on a weather icon string from weatherResponse object
 * @param {object} weatherResponse
 * @returns {string} a formatted URL based on weather icon string
 */
export function getWeatherIconURL(weatherResponse){
	if( !weatherResponse.hasOwnProperty("weather") )
		return false;

	let weather = weatherResponse.weather;
	if(!Array.isArray(weather) || weather.length < 1)
		return false;

	weather = weather[0];
	if( !weather.hasOwnProperty('icon') )
		return false;

	return "http://openweathermap.org/img/wn/" + weather.icon + "@2x.png";
}

export function formatAtmosphericPressure(currentWeather, useMetric){
	let result = {value: "unknown", unit: ""};

	if(useMetric)
		result.unit = MEASUREMENTS.metric.pressure;
	else
		result.unit = MEASUREMENTS.imperial.pressure;

	if( !currentWeather.hasOwnProperty("main") )
		return result;

	let mainW = currentWeather.main;
	if(mainW.hasOwnProperty("pressure") )
		result.value = mainW.pressure;

	return result;
}

export function formatHumidity(currentWeather){
	let humidity = "unknown";

	if( !currentWeather.hasOwnProperty("main") )
		return humidity;

	if(currentWeather.main.hasOwnProperty("humidity") )
		humidity = currentWeather.main.humidity;

	return humidity;
}

