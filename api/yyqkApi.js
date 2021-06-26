
import api from './api.js';
var baseURL = api.baseURL+"/yyqk";



//年营业情况
var findyyqkyear = function(years){
	let url = baseURL+"/year?years="+years;
	return api.requestGET({url});
}
exports.findyyqkyear = findyyqkyear;
//月营业情况
var findyyqkmonth = function(months){
	let url = baseURL+"/month?months="+months;
	return api.requestGET({url});
}
exports.findyyqkmonth = findyyqkmonth;
//天营业情况
var findyyqkday = function(days){
	let url = baseURL+"/day?days="+days;
	return api.requestGET({url});
}
exports.findyyqkday = findyyqkday;

//今年 菜品销售（金额）
var findyearfoodprice = function(days){
	let url = baseURL+"/yearfoodprice";
	return api.requestGET({url});
}
exports.findyearfoodprice = findyearfoodprice;

//今年 菜品销量（数量）
var findyearfoodcount = function(days){
	let url = baseURL+"/yearfoodcount";
	return api.requestGET({url});
}
exports.findyearfoodcount = findyearfoodcount;
//今年 菜类销售（数量）
var findyeartypecount = function(days){
	let url = baseURL+"/yeartypecount";
	return api.requestGET({url});
}
exports.findyeartypecount = findyeartypecount;
//今年 菜类销售（金额）
var findyeartypeprice = function(days){
	let url = baseURL+"/yeartypeprice";
	return api.requestGET({url});
}
exports.findyeartypeprice = findyeartypeprice;