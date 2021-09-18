<template>
	<view class="foodlist">
		<view style="margin-bottom: 10rpx;" v-if="isedit">
			<button type="primary" @click="editOk">保存</button>
		</view>
		
		<view class="list">
			<view class="item box" 
				v-for="(food,index) of foodArray" :key="food.id"
				>
				<image  @click="gotoFoodManager(food.id)" :src="food.baseimageurl" mode="aspectFill"></image>
				<view class="content">
					<view class="top sprow" >
						<view>
							<text class="label" @click="gotoFoodManager(food.id)">{{food.label}}</text>
							<text class="price">￥{{food.price}}/{{food.unit | foodUnitFilter}}</text>
						</view>
						<view @click="deleteFood(index,food)"  v-if="isedit">
							<text class="cuIcon-close delete"></text>
						</view>
					</view>
					<view class="bottom">

						<view class="label"><text >状态：</text></view>
						<text :class="'foodstate'+food.state">{{food.state | foodStateFilter}}</text>
					</view>
					<view class="bottom row">
						
						<view class="label"><text >销量：</text></view>
						<text class="value">{{food.countsum?food.countsum:0}}{{food.unit | foodUnitFilter}}</text>
					
					</view>
					<view class="bottom sprow">
						<view class="row">
							<view class="label"><text >销售金额：</text></view>
							<text class="value">￥{{food.countsum*food.price}}</text>
						</view>
						<view class="switch row" v-if="isedit">
							<view @click="itemMove(foodArray,food,-1)" v-if="index != 0"><text class="cuIcon-fold"> </text></view>
							<view @click="itemMove(foodArray,food,+1)" v-if="index != foodArray.length-1"> <text  class="cuIcon-unfold"></text></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view>
			<uni-fab
				horizontal="right"
				vertical="bottom"
				:content="content"
				@trigger="trigger"
			></uni-fab>
		</view>
		<!-- <view>
			<button type="primary" @click="gotoAddFood(foodtypeid)">添加食物</button>
		</view> -->
	</view>
</template>

<script>
	import foodApi from '@/api/foodApi'
	import foodTypeApi from '@/api/foodTypeApi'

	export default{
		data(){
			return{
				content:[
					{iconPath:"/static/images/edit.png",text:"编辑"},
					{iconPath:"/static/images/add.png",text:"添加"},
				],
				isedit:true,
				foodArray:"",
				deleteFoodArray:[],
				foodtypeid:"",
			}
		},
		onShow() {
			if(this.foodtypeid){
				this.init(this.foodtypeid);
			}
		},
		onLoad(option) {
			let foodtypeid = option.foodtypeid;
			let foodtypelabel = option.foodtypelabel;
			this.foodtypeid = foodtypeid;
			this.init();
			
			uni.setNavigationBarTitle({
			    title: foodtypelabel
			});
		},
		onPullDownRefresh() {
			
			this.init();
			uni.stopPullDownRefresh();
		},
		methods:{
			async init(){
				this.isedit = false;
				this.deleteFoodArray = [];
				let foodtypeid = this.foodtypeid;
				//查询此类型下所有的食物
				let foodArray =await foodApi.findFoodByTypeId(foodtypeid);
				//console.log(foodArray);
				this.foodArray= foodArray;
				foodArray.forEach(item=>{
					item.baseimageurl =  this.$Api.imgpriewurl+item.imageurl;
				})
				//console.log(foodArray);
			},
			//保存编辑
			async editOk(){
				for (var i = 0; i < this.foodArray.length; i++) {
					this.foodArray[i].seq = i;
				}
				await  foodApi.updateFood(this.foodArray);
				await  foodApi.updateFood(this.deleteFoodArray);
				
				uni.showToast({
					title:"保存成功"
				})
				this.isedit = false;
			},
			deleteFood(index,food){
				this.deleteFoodArray.push(food);
				this.foodArray.splice(index,1);
				food.seq = 100;
				food.isdelete = 1;
			},
			//条目移动
			itemMove(list,item,value){
				let index = list.indexOf(item);
				let tem =list[index];
				let tem2 =list[index+value];
				list.splice(index,1,tem2);
				list.splice(index+value,1,tem);
			},
			//到编辑食物页面
			gotoFoodManager(foodid){
				uni.navigateTo({
					url:"/pages/foodManager/foodManager?foodid="+foodid,
				})
			},
			//到添加食物页面
			gotoAddFood(){
				let foodtypeid = this.foodtypeid;
				uni.navigateTo({
					url:"/pages/foodManager/foodManager?foodtypeid="+foodtypeid,
				})
			},
			trigger(item){
				switch(item.index){
					case 0:
						this.isedit = !this.isedit;
						break;
					case 1:
						this.gotoAddFood();
						break;
				}
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	
	.switch{
		display: flex;
		view{
			text{
				font-size: $uni-font-size-lg2;
				font-weight: 600;
				color: #DD524D;
			}
			margin-left: 20rpx;
			width: 50rpx;
			text-align: center;
			height: 50rpx;
	
		}
	}
	
	.foodlist{
		padding: 20rpx;
		width: 100%;
		height: 100%;
			
		.list{
			.delete{
				color: #ED1C24;
				font-weight: 600;
				size: $uni-font-size-lg2;
			}
			.item{
					padding: 20rpx;
					margin-bottom: 20rpx;
					width: 100%;
					display: flex;
					image{						width: 200rpx;
						height: 200rpx;
						border-radius: 4px;
						margin-right: 10rpx;
					}
					/* .label{
						width: 140rpx;
						text-align: right;
					} */
					.row{
						
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
						width: 500rpx;
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
