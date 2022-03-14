import React, { useState, useEffect } from "react";
// import "../../../electron/styles/main.css";


function ConfigOptions({ images, isMetricActive, setActiveMetric, is24hrs, setIs24hrs, autoRefresh, setIsAutoRefresh }){
	const [allImages, setAllImages] = useState([]);
	const [imageIndex, setImageIndex] = useState(0);


	useEffect(() => {
		refreshBackgroundImageThumbnails(6);
	}, [images]);/* componentDidMount */


	const refreshBackgroundImageThumbnails = function(max){
		if(!Array.isArray(images) || images.length < 1)
			return;

		let imageNodes = [], i;
		imageNodes.push(<img key={ 0 } src={ images[0] } className="options-bkg-img-thumbnail active-background-image-selected" />);

		for(i = 1; i < images.length && i < max; i++){
			imageNodes.push(<img key={ i } src={ images[i] } className="options-bkg-img-thumbnail" />);
		}

		setAllImages(imageNodes);
	}

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
  <div className="options-container">
    <div>
      <p className="h4 settings-header"> Background Image </p>
    </div>
    <div className="options-change-background-image-enclosure" onClick={ backgroundImageEnclosureClick } >
      { allImages /* This guy displays thumbnails of the background image options */}
    </div>
    <div className="options-change-measurement-units-enclosure enclosure-inline">
      <div>
        <p className="h4 settings-header"> Units </p>
      </div>
      <div className="btn-group btn-group-toggle" data-toggle="buttons">
        <label className={`btn btn-secondary metric ${isMetricActive ? "active" : ""}`} onClick={() => {setActiveMetric(true)} }>
          <input type="radio" name="options" id="option_metric" /> Metric
        </label>
        <label className={`btn btn-secondary imperial ${isMetricActive ? "" : "active"}`} onClick={() => {setActiveMetric(false)} }>
          <input type="radio" name="options" id="option_imperial" /> Imperial
        </label>
      </div>
    </div>
    <div className="options-change-time-measurement-enclosure enclosure-inline">
      <div>
        <p className="h4 settings-header"> Time format </p>
      </div>
      <div className="btn-group btn-group-toggle" data-toggle="buttons">
        <label className={`btn btn-secondary twenty-four-hour ${is24hrs ? "active" : ""}`} onClick={() => {setIs24hrs(true)}}>
          <input type="radio" name="options" id="option_twenty_four" /> 24-hour
        </label>
        <label className={`btn btn-secondary twelve-hour ${is24hrs ? "" : "active"}`} onClick={() => {setIs24hrs(false)}}>
          <input type="radio" name="options" id="option_twelve" /> 12-hour
        </label>
      </div>
    </div>
    {/* auto refresh options */}
    <div className="auto-refresh-options-enclosure enclosure-inline">
      <div>
        <p className="h4 settings-header"> Auto-refresh </p>
      </div>
      <div className="btn-group btn-group-toggle" data-toggle="buttons">
        <label className={`btn btn-secondary auto-refresh-on ${autoRefresh ? "active" : ""}`} onClick={() => {setIsAutoRefresh(true)}}>
          <input type="radio" name="options" id="auto-refresh-on" /> On
        </label>
        <label className={`btn btn-secondary auto-refresh-off ${autoRefresh ? "" : "active"}`} onClick={() => {setIsAutoRefresh(false)}}>
          <input type="radio" name="options" id="auto-refresh-on-off" /> Off
        </label>
      </div>
    </div>
  </div>
  <div className="options-save-cancel-button-enclosure"></div>
	  </>
	);
}

export default ConfigOptions;

