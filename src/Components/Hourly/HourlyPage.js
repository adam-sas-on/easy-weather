import React/*, { useState, useEffect }*/ from "react";
import { Link/*, useLocation, useParams*/ } from "react-router-dom";
import "../../../electron/styles/weather.css";

/**
 *
 * @returns {JSX.Element}
 */
function HourlyPage(){


	return (
	  <>
	<div className="close-config-enclosure enclosure">
    <Link to="/" className="close-settings-icon" style={{ visibility: "visible" }}>
      &times; <i className="fas fa-times"> </i>
    </Link>
	</div>
	  {/* We'll use an unordered list to render the hourly forecasts */}
	  <div className="hourly-forecast-enclosure">
	    <table className="hourly-list-table-master table">
      <tbody className="hourly-forecast-table-body">
        <tr className="tr-class-row-light">
          <td>Hourly Info</td>
        </tr>
        <tr className="tr-class-row-dark">
          <td>Hourly Info</td>
        </tr>
      </tbody>
	    </table>
	  </div>
	  <div className="pagination"></div>
	  </>
	);
}

export default HourlyPage;

