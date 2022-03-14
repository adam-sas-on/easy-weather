<?php
include dirname(__FILE__)."/local_settings.php";
include dirname(__FILE__)."/modules/weatherApi.php";

$weatherApi = new WeatherApi($_SERVER, $db, $user_table, $city_table, $through_table);

if( $weatherApi->isAjaxReq() ){
	$responseAjax = array();

	if( !empty($_POST['cityName']) )
		$responseAjax = $weatherApi->get($_POST['cityName']);
	elseif( !empty($_POST['images']) ){
		$responseAjax['files'] = $weatherApi->getImages(dirname(__FILE__));
	} elseif( !empty($_POST['cityId']) ){
		$responseAjax = $weatherApi->getWeatherByCityId($_POST['cityId']);
	} elseif( !empty($_POST['longitude']) && !empty($_POST['latitude']) ){
		$responseAjax = $weatherApi->getByCoord($_POST['longitude'], $_POST['latitude']);
	}

	echo json_encode($responseAjax);
	exit();
}


?><!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Latest compiled and minified JavaScript -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
    integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
  <!-- Optional theme -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css"
    integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
  <script src="electron/scripts/jquery.min.js"></script>
  <script async src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
    integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous" async>
  </script>
  <!-- <script async src="electron/scripts/index.js"></script> -->
  <title>ez-Weather</title>
</head>

<body class="main-window">
	<div id="root"></div>
<script type="text/javascript" src="electron/scripts/react/main.js"></script>
</body>
</html>
