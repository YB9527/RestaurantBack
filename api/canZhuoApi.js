import api from './api.js';
var baseURL = api.baseURL;


var getCanZhuoCount = function(){
	let url = baseURL+"/config/getzhuoshu";
	//console.log(url);
	return api.requestGETOneData({url}).then(data=>{
		return data.value;
	})
	
}
exports.getCanZhuoCount = getCanZhuoCount;

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
			console.log(datas);
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