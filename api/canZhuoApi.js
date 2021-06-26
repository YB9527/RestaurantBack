import api from './api.js';
var baseURL = api.baseURL;

import canZhuoFoodApi from './canZhuoFoodApi.js';

var getCanZhuoCount = function(){
	let url = baseURL+"/config/getzhuoshu";
	//console.log(url);
	return api.requestGETOneData({url}).then(data=>{
		return data.value;
	})
	
}
exports.getCanZhuoCount = getCanZhuoCount;

var findById = function(id){
	let url = baseURL+"/canzhuo/findbyid?id="+id;
	return api.requestGETOneData({url}).then(canzhuo=>{
		 return  canZhuoFoodApi.findcanzhuofoodbycanzhuoid([id])
		 .then(canzhuofoodarray =>{
			 computedCanZhuoFood(canzhuo,canzhuofoodarray);
			 return canzhuo;
		 })
	})
}
exports.findById = findById;

var findcanzhuoingbyzanzhuonum = function(canzhuonum){
	let url = baseURL+"/canzhuo/findcanzhuoingbyzanzhuonum?canzhuonum="+canzhuonum;
	return api.requestGET({url});
	
}
exports.findcanzhuoingbyzanzhuonum = findcanzhuoingbyzanzhuonum;

var setCanZhuoCount = function(canzhuocount){
	
	let url = baseURL+"/config/getzhuoshu";
	//console.log(url);
	return api.requestGETOneData({url}).then(data=>{
		url = baseURL+"/config/setzhuoshuo";
		data.value = canzhuocount;
		//sdebugger
		return api.requestPOST({url,data}).then(res=>{
			return res
		})
	})

}
exports.setCanZhuoCount = setCanZhuoCount;


var findCanZhuoHomeData = function(){
	
	let url = baseURL+"/canzhuo/canzhuohome";
	return api.requestGET({url})
		.then(datas=>{
			let canzhuomap = {};
			for(let data of datas){
				let canzhuonum = data.canzhuonum+"";
				let canzhuo = canzhuomap[canzhuonum];
				if(canzhuo){
					if(canzhuo.peopletotal < data.peopletotal){
						canzhuo.peopletotal =  data.peopletotal;
					}
					if(!data.ischeckout){
						data.ischeckout = 0;
					}
				}else{
					canzhuomap[canzhuonum] = JSON.parse(JSON.stringify(data));
				}
			}
			let results = [];
			for(let canzhuonum in canzhuomap){
				results.push(canzhuomap[canzhuonum]);
			}
			return results;
		});
}
exports.findCanZhuoHomeData = findCanZhuoHomeData;

/**
 * 计算餐桌上的食物
 * @param {Object} canzhuoArraye 可以是单个也可是数组
 * @param {Object} canfoodarray
 */
var computedCanZhuoFood = function (canzhuoArray,canfoodarray){
	
	if(canzhuoArray&& !(canzhuoArray instanceof Array)){
		canzhuoArray = [canzhuoArray];
	}
	//console.log("canzhuoArray",canzhuoArray);
	let canzhuofoodidMap = uni.vue.$Tool.groupByAttribute(canfoodarray,"canzhuoid");
	//console.log("canzhuofoodidMap",canzhuofoodidMap);
	canzhuoArray.forEach(canzhuo=>{
		let canzhuofoods = canzhuofoodidMap[canzhuo.id];
		canZhuoFoodApi.imageURLAddBase(canzhuofoods);
		canzhuo.isfoodover = 1;
		canzhuo.pricetotal = 0;
		if(canzhuofoods){
			
			canzhuo.canzhuofoodArray = canzhuofoods;
			for(let canzhuofood of canzhuofoods){
				if(!canzhuofood.isfinish){
					canzhuo.isfoodover = 0;
				}
				canzhuo.pricetotal += canzhuofood.price* canzhuofood.count;
			}
		}
	});
	//console.log("canzhuoArray",canzhuoArray);
}
exports.computedCanZhuoFood = computedCanZhuoFood;

var update = function(canzhuo){
	let url = baseURL+"/canzhuo/update";
	return api.requestPOST({url,data:canzhuo});
}
exports.update = update;
 var computedFinalChargeById =async function(id){
	let canzhuo =await findById(id);
	canzhuo.finalcharge =  canzhuo.pricetotal;
	await update(canzhuo);
}
exports.computedFinalChargeById = computedFinalChargeById;


 var historytablestatistics = function(){
	let url = baseURL+"/canzhuo/historytablestatistics";
	return api.requestGET({url});
}
exports.historytablestatistics = historytablestatistics;

 var historytabledetailsByCanzhuonum = function(canzhuonum){
	let url = baseURL+"/canzhuo/historytabledetails?canzhuonum="+canzhuonum;
	return api.requestGET({url});
}
exports.historytabledetailsByCanzhuonum = historytabledetailsByCanzhuonum;
