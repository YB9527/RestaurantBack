


export default {
	// 权限路由 在main.js可实现路由拦截 所以路由都需要注册 待完善
	defaultAuth:true,
	auths:{
		requiresAuth:[
			{name: 'index',label:"点餐",path: '/pages/index/index',},
			{name: 'canZhuo',label:"餐桌",path: '/pages/canZhuo/canZhuo',},
			{name: 'canZhuoFood',label:"餐桌上的食物",path: '/pages/canZhuo/canZhuoFood',},
			{name: 'foodTypeManager',label:"食物类型管理",path: '/pages/foodTypeManager/foodTypeManager',},
			{name: 'foodManager',label:"食物管理",path: '/pages/foodManager/foodManager',},
			{name: 'foodList',label:"食物列表",path: '/pages/foodManager/foodList',},
			
			{name: 'evaluateManger',label:"评论管理",path: '/pages/evaluateManger/evaluateManger',},
			{name: 'business',label:"营业详情",path: '/pages/business/business',},
			{name: 'restaurantConfig',label:"餐馆配置",path: '/pages/restaurantConfig/restaurantConfig',},
			
			

		],
		// 非权限路由
		noAuth:[
			{name: 'login',label:"登录",path: '/pages/login/login'},

		],
	}
};
