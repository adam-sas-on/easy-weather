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

