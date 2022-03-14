<?php

class WeatherApi {
	private $dbConnection;
	private $dbParams;
	private $userTable;
	private $cityTable;
	private $throughTable;
	private $dbOpened;

	private $isAjax;
	private const IMAGES_DIR = "/electron/img/backgrounds/";
	private const DATA_LIST_FILE = "electron/public/data/weather_bulk_CZ_DE_PL_UA.json";

	public function __construct($server, array $database, $userTable, $cityTable, $throughTable){
		$this->dbParams = array('hostname' => $database['hostname'],
							'username' => $database['username'],
							'password' => $database['password'],
							'database' => $database['database']);

		$this->userTable = ( !empty($userTable) )? $userTable : "weather_user";
		$this->cityTable = $cityTable;
		$this->throughTable = $throughTable;
		$this->dbOpened = FALSE;

		$this->isAjax = ( !empty($server['HTTP_X_REQUESTED_WITH']) && strtolower($server['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')?TRUE:FALSE;
	}


	/**
	 *	Tries to get city\-ies from database. If error occurs then the file is being read;
	 */
	public function get($cityName = ""){
		$this->dbConnection = new mysqli($this->dbParams['hostname'], $this->dbParams['username'], $this->dbParams['password'], $this->dbParams['database']);
		if($this->dbConnection->connect_error)
			return $this->getFromFile($cityName);

		$this->dbOpened = TRUE;
		$sql_query = "SELECT * FROM ". $this->cityTable;
		if(strlen($cityName) > 0){
			$sql_query .= " WHERE name LIKE ?";
			$sql_statement = $this->dbConnection->prepare($sql_query);
			if($sql_statement === FALSE)
				return $this->getFromFile($cityName);

			$cityNameSql = "%".$cityName."%";
			$sql_statement->bind_param("s", $cityNameSql);
			$sql_statement->execute();
			$results = $sql_statement->get_result();
		} else {
			$results = $this->dbConnection->query($sql_query);
		}

		$cities = array();
		while($row = $results->fetch_assoc() ){
			$city = $this->cityPrototype($row);
			$cities[] = $city;
		}

		return $cities;
	}

	private function getFromFile($cityName = ""){
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

		return $cities;
	}

	public function getWeatherByCityId($cityId){
		$data_file = file_get_contents(WeatherApi::DATA_LIST_FILE);
		$data_file = json_decode($data_file, true);

		$weather = array();

		foreach($data_file as $city_object){
			if( !isset($city_object['city']) || empty($city_object['city']) )
				continue;

			$city = $city_object['city'];
			if( !empty($city['id']) && $city['id'] == $cityId){
				$weather = $this->weatherPrototype($city_object, $city['name']);
				break;
			}
		}

		return $weather;
	}

	/**
	 *	Tries to get city and its weather closest to coordinates $lon and $lat;
	 *
	 * @param $lon - longitude
	 * @param $lat - latitude
	 * @return - associative array with city and weather;
	 */
	public function getByCoord($lon, $lat, $distance = 2.0){
		$this->dbConnection = new mysqli($this->dbParams['hostname'], $this->dbParams['username'], $this->dbParams['password'], $this->dbParams['database']);
		if($this->dbConnection->connect_error)
			return $this->getByCoordFromFile($lon, $lat, $distance);

		$this->dbOpened = TRUE;
		$sql_query = "SELECT *, ST_Distance_Sphere(POINT(longitude, latitude), POINT(?, ?)) AS dist FROM weather_cities ORDER BY dist LIMIT 1";
		$sql_statement = $this->dbConnection->prepare($sql_query);
		if($sql_statement === FALSE)
			return $this->getByCoordFromFile($lon, $lat, $distance);

		$sql_statement->bind_param("dd", $lon, $lat);
		$sql_statement->execute();
		$results = $sql_statement->get_result();
		$city = $results->fetch_assoc();

		if( empty($city) )
			return $this->getByCoordFromFile($lon, $lat, $distance);

		$cityId = ( !empty($city['weather_id']) ) ? $city['weather_id'] : $city['id'];
		$city = $this->cityPrototype($city);

		$weather = $this->getWeatherByCityId($cityId);

		if( empty($weather) )
			return $this->getByCoordFromFile($lon, $lat, $distance);

		return array('city' => $city, 'weather' => $weather);
	}

	/**
	 *	Same as above but it gets from file;
	 *
	 * @param $lon - longitude
	 * @param $lat - latitude
	 * @return - associative array with city and weather;
	 */
	private function getByCoordFromFile($lon, $lat, $distance = 2.0){
		$data_file = file_get_contents(WeatherApi::DATA_LIST_FILE);
		$data_file = json_decode($data_file, true);

		$city = array();
		$weather = array();
		$isFirst = TRUE;
		$dist_smallest = 0.0;
		$city_ob = array();


		foreach($data_file as $city_object){
			$coord = $this->getCoordsFromCityObject($city_object);
			if($coord === FALSE)
				continue;

			$dLon = $coord['lon'] - $lon;
			$dLat = $coord['lat'] - $lat;
			if($isFirst){
				$dist_smallest = $dLon*$dLon + $dLat*$dLat;
				$city_ob = $city_object;
				$isFirst = FALSE;
			} else {
				$dist = $dLon*$dLon + $dLat*$dLat;
				if($dist < $dist_smallest){
					$dist_smallest = $dist;
					$city_ob = $city_object;
				}
			}
		}

		if(!isset($city_ob['city']) )
			return array();

		$city = $city_ob['city'];
		$city_name = ( isset($city['name']) )?$city['name']:"";
		$weather = $this->weatherPrototype($city_ob, $city_name);

		return array('city' => $city, 'weather' => $weather);
	}

	/**
	 *	Tries to get city and its weather closest to coordinates $lon and $lat;
	 *
	 * @param $root - directory of file where this method is called;
	 * @return - list of image paths;
	 */
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

	private function cityPrototype($rawCityArray){
		$prototype = array('id' => 0, 'name' => "", 'findname' => "", 'country' => "PL",
		              'coord' => array('lon' => 0.0, 'lat' => 0.0)
		        );

		if( !empty($rawCityArray['weather_id']) )
			$prototype['id'] = $rawCityArray['weather_id'];
		else
			$prototype['id'] = $rawCityArray['id'];

		$prototype['name'] = $rawCityArray['name'];
		$prototype['findname'] = $rawCityArray['findname'];
		$prototype['country'] = $rawCityArray['country'];
		$prototype['coord']['lon'] = $rawCityArray['longitude'];
		$prototype['coord']['lat'] = $rawCityArray['latitude'];

		return $prototype;
	}

	private function weatherPrototype($city_object, $city_name){
		$weather = array('time' => 0, 'current' => array(), 'weather' => array(), 'cityName' => $city_name);
		if( isset($city_object['weather']) )
			$weather['weather'] = $city_object['weather'];

		if( isset($city_object['time']) )
			$weather['time'] = $city_object['time'];

		foreach($city_object as $key => $value){
			if($key == "city" || $key == "time" || $key == "weather")
				continue;

			$weather['current'][$key] = $value;
		}
		return $weather;
	}

	private function getCoordsFromCityObject($city_ob){
		if(!isset($city_ob['city']) || empty($city_ob['city'])){
			return FALSE;
		}

		$city = $city_ob['city'];
		if(!isset($city['coord']) || empty($city['coord']))
			return FALSE;

		$coord = $city['coord'];
		if(!isset($coord['lon']) || empty($coord['lon']) || !isset($coord['lat']) || empty($coord['lat']) )
			return FALSE;

		return $coord;
	}

	function __destruct(){
		if($this->dbOpened)
			$this->dbConnection->close();
	}
}

