<template>
	<view class="shopMallcontent">
		<view class="shopMall">
			<view class="left">
				 <scroll-view scroll-y="true">
					 <view
					 v-for="(foodtype,index) in foodtypeList"
					 :key="foodtype.id"
					 :class="'foodtype ' + (foodtype.id === currentfoodtypeid?'foodtypeactive':'')" 
					 @click="foodtypeclick(index,foodtype)"
					 >
					 	<text>{{foodtype.label}}</text>
					 </view>
					 <image src="/static/imgs/addsymbol.png" class="addType" @click="openAddTypeDialog"></image>
				 </scroll-view>
			</view>
			<view class="right">
				<scroll-view scroll-y="true">
					<view 
					v-for="(food,index) in foodList"
					:key="food.id"
					@click="gotoFoodManager(food.id)"
					class="food">
						<image :src="food.url" mode="aspectFit"></image>
						<view class="content">
							<view class="top" >
								<text class="label">{{food.label}}</text>
								<text class="price">￥{{food.price}}/{{food.unit | foodUnitFilter}}</text>
								<view class="menu-add" v-show="haseCount(food,orderFoodList)" >
									<image mode="aspectFit" @click="setFoodCount(index,-1,food)" src="/static/images/subtract.png">
								</view>
								
							</view>
							<view class="bottom">
								<text >状态：</text>
								<text :class="'foodstate'+food.state">{{food.state | foodStateFilter}}</text>
							</view>
							<view class="bottom">
								<text>销量：500{{food.unit | foodUnitFilter}}</text>
							</view>
							<view class="bottom">
								<text>金额：￥18520</text>
							</view>
						</view>
					</view >
					<view class="addfood"> 
						  <button   type="primary" @click="gotoAddFood(currentfoodtypeid)">添加食物</button>
					</view>
					<view  class="deletetype" v-if="!foodList || foodList.length === 0">
						<button  type="warn" @click="deleteType(currentfoodtypeid)">删除类型</button>
					 </view>
				</scroll-view>
			</view> 
			
		</view>
		<uni-popup ref="popup" type="dialog" :animation="false" >
		    <uni-popup-dialog placeholder="请输入食物类型" @confirm="addFodType"  mode="input"  message="成功消息" :duration="2000"></uni-popup-dialog>
		</uni-popup>
		
	</view>
</template>

<script>
		import foodTypeApi from '../common/foodTypeApi.js'
		import foodApi from '../common/foodApi.js'
	export default {
		data() {
			return {
				cartFoodListShow:false,
				currentfoodtypeid:"",
				orderFoodCount:0,
				orderFoodList:[],//点的{菜品food、数量count}
				foodtypeList:[
					{id:1,label:"主菜"},
					{id:2,label:"配菜"},
					{id:21,label:"酒水"},
					{id:3,label:"小吃"},
	
				],
				foodList:[],
			}
		},
		filters: {
			
			computedAmount(orderFoodList){
				if(!orderFoodList){
					return 0;
				}
				let amount = 0; 
				for (let orderFood of orderFoodList) {
					amount += orderFood.food.price * orderFood.count;
				}
				
				return amount;
			},
			foodCount(food, orderFoodList){
				for (let orderFood of orderFoodList) {
				
					if(orderFood.food.id === food.id){
						return orderFood.count;
					}
				}
				return "";
			}
		},
		created() {
			this.init();
			
		},
		onShow() {
			this.init();
		},
		methods: {
			init(){
				this.findAllFoodType()
					.then((foodtypeList)=>{
						this.foodtypeList = foodtypeList;
						if(foodtypeList.length > 0 &&!this.currentfoodtypeid ){
							this.currentfoodtypeid = foodtypeList[0].id;
						}
						this.findFoodByTypeId(this.currentfoodtypeid);
					});
			
			},
			findAllFoodType(){
				return foodTypeApi.findAll();
			},
			//打开添加食物类型的窗口
			openAddTypeDialog(){
				 this.$refs.popup.open();
			},
			/**
			 * 添加食物类型
			 */
			addFodType(newtypevalue){
				//foodtype/add
				let foodType = {id:this.$Tool.uuid(),label:newtypevalue};
				foodTypeApi.saveFoodType(foodType)
					.then(res=>{
						this.foodtypeList.push(foodType)
					})
			},
			deleteType(typeid){
				foodTypeApi.deleteFoodType({id:typeid})
					.then(()=>{
						for (var i = 0; i < this.foodtypeList.length; i++) {
								if(this.foodtypeList[i].id === typeid){
									this.foodtypeList.splice(i,1);
									break;
								}
						}
						this.currentfoodtypeid =  this.foodtypeList.length > 0 ?this.foodtypeList[0].id:"";
						this.init();
					})
				
			},
			//到编辑食物页面
			gotoFoodManager(foodid){
				uni.navigateTo({
					url:"/pages/foodManager/foodManager?foodid="+foodid,
				})
			},
			//到添加食物页面
			gotoAddFood(foodtypeid){
				uni.navigateTo({
					url:"/pages/foodManager/foodManager?foodtypeid="+foodtypeid,
				})
			},
			//清空购物车
			clearOrderCart(){
				let orderFoodList = this.orderFoodList;
				if(orderFoodList.length > 0){
					orderFoodList.splice(0,orderFoodList.length);
				}
				this.cartFoodListShow = false;
			},
			//打开购物清单
			openCartInfo(){
				this.cartFoodListShow = !this.cartFoodListShow;
				
			},
			//此食物有数量吗？
			haseCount(food, orderFoodList){
				for (let orderFood of orderFoodList) {
					if(orderFood.food.id === food.id){
						return true;
					}
				}
				return false;
			},
			//菜类被点击
			foodtypeclick(index,foodtpe){
				if(this.currentfoodtypeid === foodtpe.id){
					return;
				}
				this.currentfoodtypeid = foodtpe.id;
				//console.log(1,this.currentfoodtypeid)
				this.findFoodByTypeId(foodtpe.id);
			},
			//根据食物类型获取所有食物
			findFoodByTypeId(typeid){
				/* if(typeid === 1){
					this.foodList  = [
						{id:2,label:"羊肉汤",unit:"斤",describe:"",price:100,imageurl:"https://qcloud.dpfile.com/pc/9CTG3egYVhA4qDEGPZysOWm-CMHWxdqKtHOfGwwz2KJ3SQvBEuZcM3cJ5XDTpMvP5g_3Oo7Z9EXqcoVvW9arsw.jpg"},
						{id:1,label:"牛肉",unit:"份",describe:"",price:38,imageurl:"https://qcloud.dpfile.com/pc/EgOYGoX6cUY42YoeOsr3gBzxSl7EJ-GEy_OaLloqJuVzMT5nCQRqO7l_onbFDiHq5g_3Oo7Z9EXqcoVvW9arsw.jpg"},
						{id:3,label:"鸭肠",unit:"份",describe:"",price:22,imageurl:"https://qcloud.dpfile.com/pc/3HHHfRFJIXkCc2NNVj3yENqeSoFGZUw_rfmojNWPSe6umY1XpOkGMGNh02O5O4g-5g_3Oo7Z9EXqcoVvW9arsw.jpg"},
						{id:4,label:"鹅肠",unit:"份",describe:"",price:22,imageurl:"https://p1.meituan.net/poirichness/menu_808644_446406954.jpg@130w_130h_1e_1c"},
						{id:5,label:"金针菇",unit:"份",describe:"",price:10,imageurl:"https://p1.meituan.net/shaitu/99dd843cacf39925b39f8a60058a9c9a1497525.jpg"},
						{id:6,label:"糍粑",unit:"份",describe:"",price:12,imageurl:"https://p1.meituan.net/shaitu/7b9e90a902edef95123d8124c4fe513f2103547.jpg"},
						{id:7,label:"糍粑",unit:"份",describe:"",price:12,imageurl:"https://p1.meituan.net/shaitu/7b9e90a902edef95123d8124c4fe513f2103547.jpg"},
						{id:8,label:"糍",unit:"份",describe:"",price:12,imageurl:"https://p1.meituan.net/shaitu/7b9e90a902edef95123d8124c4fe513f2103547.jpg"},
					];
				}else{
					
				} */
				//console.log(1,foodApi.findFoodByTypeId(typeid));
				foodApi.findFoodByTypeId(typeid)
					.then(foods=>{
						
						for (let food of foods) {
							food.url = this.$Api.imgpriewurl+food.imageurl;
							//console.log(food.url);
						}
						if(this.foodList && this.foodList.length > 0){
							this.foodList.splice(0,this.foodList.length);
						}
						this.foodList.push(...foods);
					});
			},
			//点菜
			setFoodCount(index,foodcount,food){
				let orderFoodList = this.orderFoodList;
				//设置菜的数量
				let have = false;
				for (var i = 0; i < orderFoodList.length; i++) {
					if(orderFoodList[i].food.id === food.id){
						  orderFoodList[i].count +=  foodcount;
						  have = true;
					}
				}
				if(!have){
					orderFoodList.push({food,count:1});
				}
				this.orderFoodCount = 0;
				//清除不要的菜
				for (var i = 0; i < orderFoodList.length; i++) {
					if(orderFoodList[i].count <= 0){
						orderFoodList.splice(i,1);
					}else{
						this.orderFoodCount += orderFoodList[i].count;
					}
					
				}
			}
			
		}
	}
</script>

<style lang="scss">
	.shopMallcontent{
		width: 100%;
		height: 100%;
		.left{
			text-align: center;
			.addType{
				width: 50rpx;
				height: 50rpx;
			}
		}
		.dialogback{
			position: absolute;
			bottom: 0px;
			height: 15000rpx;
			width: 100%;
			background-color: rgba($color: #7F7F7F, $alpha: 0.5);
		}
		.cart-food-list {
			position: absolute;
			width: 100%;
			bottom: 0px;
			background:#FFFFFF;
			.foodlist{
				min-height: 300rpx;
				
				/deep/ .uni-scroll-view{
					max-height: 600rpx;
				}
				.food{
					padding: 20rpx;
					width: 100%;
					display: flex;
					image {
						width: 200rpx;
						height: 200rpx;
						border-radius: 4px;
						margin-right: 10rpx;
					}
					.content{
						width: 300rpx;
						display: flex;
						flex-direction: column;
						.top{
							text{
								font-size: 32rpx;
								font-weight: 600;
							}
						}
						.bottom {
							.price{
								font-weight: 600;
								color: #DE2A34;
							}
							display:flex;
							img {
								width: 45rpx;
								height: 45rpx;
							
							}
						}
					}
				}
			}
			.top{
				
				padding: 10rpx 20rpx;
				display: flex;
				
			}
		}
		.fix-cart{
			display: flex;
			color:#FFFFFF;
			width: 100%;
			height: 50px;
			background: rgba(0,0,0,.9);
			
		}
		.cart-part{
			width: 50px;
			height: 50px;
			line-height: 50px!important;
			flex: 3;
			text-align: center;
		}
		.cart-part view{
			position: relative;
			top:-10px;
			width: 50px;
			height: 50px;
			display: block;
			background: #353535;
			margin:0 auto;
			border-radius: 50%;
			line-height: 50px;
				z-index: 2;
		}
		.cart-part text{
			position: relative;
			top:-67px;
			font-weight: 400;
			font-size: 20px;
			z-index: 2;
			color: #ffffff;
		}
		.cart-part img{
			width: 32px;
			height: 32px;
			vertical-align: middle;
		}
		.cart-btn{
			flex: 3;
			background: #2C2C2C;
			text-align: center;
			font-size: 20px;
			line-height: 50px!important;
		}
		.cart-price{
			flex: 4;
			font-size: 25px;
			line-height: 50px!important;
		}
		.cart-count{
			flex: 2;
			font-size: 16px;
			line-height: 50px!important;
		}
		.red{
			background: #DE2A35;
		}
	}
	.shopMall{
		display: flex;
		width: 100%;
		height: 100%;
		scroll-view{
			width: 200rpx;
			height: 100%;
			.foodtype{
				text-align: center;
				line-height: 120rpx;
				text{
					font-size: 28rpx;
				}
			}
			.foodtypeactive {
				background-color: #FFFFFF;
			}
		}
		.right{
			min-height: 100%;
			.addfood{
				padding: 20rpx 40rpx;
			}
			.deletetype{
				position: absolute;
				bottom: 50rpx;
				right: 50rpx;
			}
			scroll-view{
				width: 100%;
			}
			width: 550rpx;
			background-color: #FFFFFF;
			.food{
				padding: 20rpx;
				width: 100%;
				display: flex;
				image {
					width: 200rpx;
					height: 200rpx;
					border-radius: 4px;
					margin-right: 10rpx;
				}
				.foodstate0{
					color: $uni-color-error;
				}
				.foodstate1{
					color: $uni-color-success;
				}
				.foodstate2{
					color: $uni-color-warning;
				}
				.content{
					width: 300rpx;
					display: flex;
					flex-direction: column;
					
					.top{
						text{
							font-size: 32rpx;
							font-weight: 600;
						}
						.price{
							margin-left: 20rpx;
							font-weight: 600;
							color: #DE2A34;
						}
					} 
					.bottom {
						margin-top: 10rpx;
						display:flex;
						img {
							width: 45rpx;
							height: 45rpx;
						}
					}
				}
			}
		}
	
	}
</style>
