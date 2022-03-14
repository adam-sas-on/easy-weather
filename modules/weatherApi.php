<?php

class WeatherApi {
	private $isAjax;
	private const IMAGES_DIR = "/electron/img/backgrounds/";
	private const DATA_LIST_FILE = "electron/public/data/weather_bulk_CZ_DE_PL_UA.json";

	public function __construct($server){
		$this->isAjax = ( !empty($server['HTTP_X_REQUESTED_WITH']) && strtolower($server['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')?TRUE:FALSE;
	}

	public function get($cityName = ""){
		$data_file = file_get_contents(WeatherApi::DATA_LIST_FILE);
		$data_file = json_decode($data_file, true);

		$cities = array();
		foreach($data_file as $city_object){
			if( !isset($city_object['city']) || empty($city_object['city']) )
				continue;

			$city = $city_object['city'];
			if( empty($cityName) || $cityName == "" || stripos($city['name'], $cityName) !== FALSE){
				$cities[] = $city;
			}
		}

		/*$city = array('id' => 756135, 'name' => "Warsaw", 'state' => "", 'country' => "PL",
		              'original_name' => "Warsaw",
		              'coord' => array('lon' => 21.01178, 'lat' => 52.229771)
		        );

		if( empty($cityName) || $cityName == "" || stripos($city['name'], $cityName) !== FALSE){
			$cities[] = $city;
		}*/

		return $cities;
	}

	public function getWeatherByCityId($cityId){
		$data_file = file_get_contents(WeatherApi::DATA_LIST_FILE);
		$data_file = json_decode($data_file, true);

		$found = FALSE;
		$weather = array();

		foreach($data_file as $city_object){
			if( !isset($city_object['city']) || empty($city_object['city']) )
				continue;

			$city = $city_object['city'];
			if( !empty($city['id']) && $city['id'] == $cityId){
				$weather = array('time' => 0, 'current' => array(), 'weather' => array(), 'cityName' => $city['name']);
				if( isset($city_object['weather']) )
					$weather['weather'] = $city_object['weather'];
				if( isset($city_object['time']) )
					$weather['time'] = $city_object['time'];

				foreach($city_object as $key => $value){
					if($key == "city" || $key == "time" || $key == "weather")
						continue;

					$weather['current'][$key] = $value;
				}
				break;
			}
		}

		return $weather;
	}

	public function getByCoord($lon, $lat, $distance = 2.0){
		return array();
	}

	public function getImages($root){
		$files = array();

		$full_dir = $root . WeatherApi::IMAGES_DIR;
		$fs = scandir($full_dir);
		foreach($fs as $file){
			if( is_file($full_dir . $file) )
				$files[] = WeatherApi::IMAGES_DIR . $file;
		}
		return $files;
	}

	public function isAjaxReq(){
		return $this->isAjax;
	}
}

