<template>
	<view class="foodcontent" v-if="showdata">
		
		<view>
			<button type="primary" v-if="showsavebtn" @click="update">保存</button>
		</view>
		<view class="row graytext">
			<view ><text>人数：</text> <text class="peoplecount">{{canzhuo.peopletotal}}</text></view>
			<view><text>消费金额：￥</text><text class="money" :class="canzhuo.pricetotal !=canzhuo.finalcharge?'delmoney':'' ">{{canzhuo.pricetotal}}</text> </view>
			<view @click="setMoney"><text>结算金额：￥</text><text class="money finalcharge"  >{{canzhuo.finalcharge}}</text> </view>
		</view>
		<view class="row ">
			<view class="graytext"><text>用餐时间：{{canzhuo.date}} </text></view>
			<view class="tip"><text >双击完成烹饪 </text></view>
		</view>
		<view class="row " >
			<view>
				<text class="graytext">结账情况:</text>
				<text :class="canzhuo.ischeckout?'checkout':'nocheckout'">{{canzhuo.ischeckout?'已完成':'未结账'}}</text>
			</view>
			<view >
				<text>用餐完毕:</text>
				 <switch @change="canzhuofinish" :checked="canzhuo.isfinish !=1 ?false:true" color="#4CD964" />
			</view>
		</view>
		<view class="list " >
			<view class="box">
				<view class="item" v-for="food in  canzhuo.canzhuofoodArray">
					<view @longpress="editstate = !editstate" @click="finishfood(food)"> <image :src="food.baseimageurl"></image> </view>
					<view >
						<view :class="food.isfinish?'':'price'"><text>{{food.isfinish?"完成":'烹饪中...'}}</text></view>
						<view><text>{{food.label}}</text></view>
						
						<view v-if="!editstate || canzhuo.isfinish"><text>{{food.count}}{{food.unit | foodUnitFilter}}</text></view>
						<numcombox :unit="food.unit"  @change="foodCountChange" v-else class="countset" :data="food" prop="count"></numcombox>
						
						<view ><text>￥{{food.pricetotal}}</text></view>
					</view>
				</view>
			</view>
		</view>
		
		<uni-popup ref="popup" type="dialog" :animation="false" >
		    <uni-popup-dialog @confirm="setMoneyOk"  mode="input" message="成功消息" :duration="2000"></uni-popup-dialog>
		</uni-popup>
		
	</view> 
</template>

<script>
	import canZhuoApi from '@/api/canZhuoApi.js'
	import canZhuoFoodApi  from '@/api/canZhuoFoodApi.js'
	import numcombox from '@/components/numcombox.vue'
	export default{
		components:{numcombox},
		data(){
			return{
				finalcharge:100,
				showdata:false,
				canzhuo:"",
				editstate:false,
				lastTapDiffTime:0,
				showsavebtn:false,
			}
		},
		onLoad(option) {
			let canzhuoid = option.canzhuoid;
			this.canzhuoid = canzhuoid;
			//查询该餐桌
			if(canzhuoid){
				this.init(canzhuoid);
			}
		},
		onShow() {
			let canzhuoid = this.canzhuoid;
			if(canzhuoid){
				this.init(canzhuoid);
			}
		},
		 onPullDownRefresh() {
		      let canzhuoid = this.canzhuoid;
		      if(canzhuoid){
		      	this.init(canzhuoid);
				uni.stopPullDownRefresh();
		      }
		 },
		methods:{
			update(){
				let canzhuo = this.canzhuo;
				let self = this;
				if(!canzhuo.ischeckout && canzhuo.isfinish){
					uni.showModal({
					    title: '提示',
					    content: '确定用餐完毕？'+(canzhuo.ischeckout?'':'还没有结账哦'),
					    success:  (res)=> {
					        if (res.confirm) {
					          self.updateOk();
					        } else if (res.cancel) {
					           canzhuo.isfinish  = 0;
					        }
					    }
					});
				}else{
					this.updateOk();
				}
				
			},
			async updateOk(){
				let canzhuo = this.canzhuo;
				uni.showLoading({
					title:"稍等..."
				});
				//如果有数量为0的就删除
				let canzhuofoodArray = canzhuo.canzhuofoodArray;
				if(!canzhuofoodArray){
					canzhuofoodArray = [];
				}
				let deletecanzhuofoodArray =[];
				let updatecanzhuofoodArray =[];
				for (var i = 0; i < canzhuofoodArray.length; i++) {
					 let canzhuofood=canzhuofoodArray[i];
					 if(canzhuofood.count === 0){
						 deletecanzhuofoodArray.push(canzhuofood);
					 }else{
						  updatecanzhuofoodArray.push(canzhuofood);
					 }
				}
				
				if(updatecanzhuofoodArray.length > 0 ){
					await canZhuoFoodApi.update(updatecanzhuofoodArray);
					
				}
				if(deletecanzhuofoodArray.length > 0 ){
					await canZhuoFoodApi.deleteFood(deletecanzhuofoodArray);
				}
				
				
				
				canZhuoApi.update(canzhuo).then(()=>{
					this.showsavebtn = false;
					this.init(canzhuo.id);
					uni.hideLoading();
				});
			},
			setMoney(){
				 this.$refs.popup.open();
			},
			setMoneyOk(money){
				if(Number(money) != NaN){
					money = parseFloat(money);
					this.canzhuo.finalcharge = money;
					this.showsavebtn = true;
				}else{
					uni.showToast({
						title:"请输入数字",
						icon:"none"
					})
				}				
			},
			//用餐状态切换
			canzhuofinish(e){
				let canzhuo = this.canzhuo;
				let flag = e.target.value;
				canzhuo.isfinish = flag ? 1:0;
				this.showdata  =true;
				this.showsavebtn = true;
			},
			async init(canzhuoid){
				this.showdata = false;
				this.editstate = false;
				this.showsavebtn = false;
				let canzhuo = await canZhuoApi.findById(canzhuoid);
				this.canzhuo = canzhuo;
				//console.log(canzhuo)
				 uni.setNavigationBarTitle({
				    title: '王氏羊肉（'+canzhuo.canzhuonum+"号桌）"
				});
				this.showdata = true;
			},

			// 双击
			finishfood(food) {
				
			  let _this = this;
			  let curTime = new Date().getTime();
			  let lastTime = _this.lastTapDiffTime;
			  _this.lastTapDiffTime = curTime;
			  //两次点击间隔小于300ms, 认为是双击
			  let diff = curTime - lastTime;
			  if (diff < 300) {
			   	food.isfinish  = 1;
				this.showsavebtn = true;
			   	//保存到数据库中
			   //	
			 } 		
			},
			foodCountChange(data){
				let canzhuo = this.canzhuo;
				let updatecanzhuofoodArray = canzhuo.canzhuofoodArray;
				canZhuoApi.computedCanZhuoFood(canzhuo,updatecanzhuofoodArray);
				canzhuo.finalcharge = canzhuo.pricetotal;
				this.showsavebtn = true;
			}
		}
	}
</script>

<style lang="scss">
	.foodcontent{
		padding: 10rpx 0;
	}
	switch{
		transform: scale(0.7,0.7)
	}
	
	.row{
		padding: 0 20rpx;
		display: flex;
		justify-content: space-between;
		border-bottom: 1px dashed rgba($color: #999999, $alpha: 0.3);
		margin-top: 20rpx;
		.peoplecount,.money{
			font-size: $uni-font-size-max;
			font-weight: 600;
			color: #333333;
		}
		.finalcharge{
			text-decoration:underline;
			color: #DD524D;
		}
	}
	
	.delmoney{
		text-decoration:line-through;
	}
	.nocheckout{
		color: #DD524D;
	}
	.checkout{
		color: green;
	}
	.tip{
		text{
			font-size: $uni-font-size-lg;
			color: #999999;
		}
		
	}
	.graytext{
		
			font-size: $uni-font-size-base;
			color: #999999;
		
	}
	.list{
		
		
		.box{
			display: flex;
			
			flex-wrap: wrap;
		}
		
		.item{
			display: flex;
			margin-top: 20rpx;
			width: 370rpx;
			image{
				width: 150rpx;
				height: 150rpx;
				border-radius: 4px;
				margin-right: 15rpx;
			}
			text{
				font-size: $uni-font-size-lg;
				color: #333333;
			}
			.price{
				text{
					color:#DD524D;
					font-weight:600;
				}
				
			}
			.countset{
				width: 180rpx;
				
			}
		}
	}
	
</style>
