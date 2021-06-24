
import api from './api.js';
var baseURL = api.baseURL+"/foodtype";


var saveFoodType = function(foodtype){
	let url = baseURL+"/add";
	return api.requestPOST({url,data:foodtype});
}
exports.saveFoodType = saveFoodType;

var updateFoodType = function(foodtype){
	let url = baseURL+"/update";
	return api.requestPOST({url,data:foodtype});
}
exports.updateFoodType = updateFoodType;

var findAll = function(){
	let url = baseURL+"/findall";
	return api.requestGET({url});
}
exports.findAll = findAll;


var deleteFoodType = function(foodtype){
	let url = baseURL+"/delete";
	return api.requestPOST({url,data:foodtype});
}
exports.deleteFoodType = deleteFoodType;


var findallandfoodcount = function(){
	let url = baseURL+"/findallandfoodcount";
	return api.requestGET({url});
}
exports.findallandfoodcount = findallandfoodcount;

