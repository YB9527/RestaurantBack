import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

import store from './store'
Vue.prototype.$store = store

import Tool from '@/common/Tool.js'
Vue.prototype.$Tool = Tool;

import Api from '@/api/api.js'
Vue.prototype.$Api = Api;

import sysApi from '@/api/sysApi.js'
Vue.prototype.$SysApi = sysApi;

import storeConfigApi from '@/api/storeConfigApi.js'
Vue.prototype.$StoreConfigApi = storeConfigApi;

import $mRouter from '@/utils/router';
Vue.prototype.$mRouter = $mRouter;
			
Vue.filter('foodUnitFilter',unit=>{
	let str = unit;
	switch(unit){
		case 0:
			str = "斤";
			break;
		case 1:
			str = "份";
			break;
	}
	return str;
});

Vue.filter('foodStateFilter',state=>{
	let str = state
	switch(state){
		case 0:
			str = "停卖";
			break;
		case 1:
			str = "售卖";
			break;
		case 2:
			str = "售完";
			break;
	}
	return str;
});
/**
 * 计算用时分钟
 */
Vue.filter('minuteCompted',(start,end)=>{
	if(typeof(start) === "string"){
		start = Tool.str2Date(start);
		
	}
	if(typeof(end) === "string"){
		end = Tool.str2Date(end);
	}
	if(start && end){
		return  Math.round((end - start)/1000/60);
	}
	return "";
});


const app = new Vue({
	store,
    ...App
})
app.$mount()
