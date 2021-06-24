import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

import Tool from '@/common/Tool.js'
Vue.prototype.$Tool = Tool;

import Api from '@/api/api.js'
Vue.prototype.$Api = Api;


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


const app = new Vue({
    ...App
})
app.$mount()
