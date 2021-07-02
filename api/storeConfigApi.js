
import api from './api.js';
var baseURL = api.baseURL+"/config";

var findConfig = function(){
	let url = baseURL+"/findconfig";
	return api.requestGETOneData({url}).then(data=>{
		return data;
	})
}
exports.findConfig = findConfig;

var updateConfig = function(data){
	let url = baseURL+"/update";
	return api.requestPOST({url,data});
}
exports.updateConfig = updateConfig;


var addConfig = function(data){
	let url = baseURL+"/add";
	return api.requestPOST({url,data});
}
exports.addConfig = addConfig;