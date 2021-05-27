<template>
	
		  <scroll-view class="mainscroll"  scroll-y="true" >
		             <uni-grid :column="3" :showBorder="false"  :square="false">
		             	<uni-grid-item v-for="(canzhuonum,index) in canzhuomax">
		             		<view v-if="!canzhuonummap[index+1]" class="item" @click="canZhuoInfo(index+1)">
		             			<image  src="/static/imgs/canzhuo_wait.png" ></image>
		             			<text class="zhuohao">{{index+1}}号桌</text>
		             			<text class="peoplecont"></text>
		             		</view>
		             		<view v-else class="item" @click="canZhuoInfo(index+1)" >
		             			<image v-if="canzhuonummap[canzhuonum].isfinish" src="/static/imgs/canzhuo_finish.png"></image>
		             			<image v-else src="/static/imgs/canzhuo_ing.png"></image>
		             			<text class="zhuohao">{{index+1}}号桌</text>
		             			<text class="peoplecont">{{canzhuonummap[index+1].peoplecount}}人</text>
		             		</view>
		             		
		             	</uni-grid-item>
		             </uni-grid>
		             <view class="foodcontent" >
		             	<view class="title">
		             		<text v-if="currentcanzhuo" >{{currentcanzhuo.num}}号桌菜品</text>
		             		<text v-else >未入座</text>
		             	</view>
		             	<uni-grid v-if="currentcanzhuo && currentcanzhuo.foods" :column="3" :showBorder="false"  :square="false">
		             		<uni-grid-item  v-for="canzhuo_food in currentcanzhuo.foods">
		             			<view  class="item" >
		             				<image  :src="canzhuo_food.imageurl"></image>
		             				<text>{{canzhuo_food.count +canzhuo_food.unit+ canzhuo_food.label}}</text>
		             				<image v-if="canzhuo_food.isfinish" class="finishimg" src="/static/imgs/foodfinish.png"></image>
		             			</view>
		             		</uni-grid-item>
		             	</uni-grid>
		             </view>   
			</scroll-view>
		

</template>

<script>
	
	export default {
		data() {
			return {
				 scrollTop: 0,
				old: {
					scrollTop: 0
				},
				currentcanzhuo:"",//当前餐桌
				canzhuomax:10,//总共餐桌数量
				canzhuonummap:{},
				canzhuoArray:[
					{id:1,num:1,peoplecount:4,isfinish:false,foods:[
						{id:2,isfinish:true, count:"4",label:"羊肉汤",unit:"斤",describe:"",price:100,imageurl:"https://qcloud.dpfile.com/pc/9CTG3egYVhA4qDEGPZysOWm-CMHWxdqKtHOfGwwz2KJ3SQvBEuZcM3cJ5XDTpMvP5g_3Oo7Z9EXqcoVvW9arsw.jpg"},
						{id:1,isfinish:false,count:"1",label:"牛肉",unit:"份",describe:"",price:38,imageurl:"https://qcloud.dpfile.com/pc/EgOYGoX6cUY42YoeOsr3gBzxSl7EJ-GEy_OaLloqJuVzMT5nCQRqO7l_onbFDiHq5g_3Oo7Z9EXqcoVvW9arsw.jpg"},
						{id:3,isfinish:false,count:"1",label:"鸭肠",unit:"份",describe:"",price:22,imageurl:"https://qcloud.dpfile.com/pc/3HHHfRFJIXkCc2NNVj3yENqeSoFGZUw_rfmojNWPSe6umY1XpOkGMGNh02O5O4g-5g_3Oo7Z9EXqcoVvW9arsw.jpg"},
						{id:4,isfinish:false,count:"1",label:"鹅肠",unit:"份",describe:"",price:22,imageurl:"https://p1.meituan.net/poirichness/menu_808644_446406954.jpg@130w_130h_1e_1c"},
						{id:5,isfinish:false,count:"1",label:"金针菇",unit:"份",describe:"",price:10,imageurl:"https://p1.meituan.net/shaitu/99dd843cacf39925b39f8a60058a9c9a1497525.jpg"},
						{id:5,isfinish:false,count:"1",label:"金针菇",unit:"份",describe:"",price:10,imageurl:"https://p1.meituan.net/shaitu/99dd843cacf39925b39f8a60058a9c9a1497525.jpg"},
						{id:5,isfinish:false,count:"1",label:"金针菇",unit:"份",describe:"",price:10,imageurl:"https://p1.meituan.net/shaitu/99dd843cacf39925b39f8a60058a9c9a1497525.jpg"},
						{id:5,isfinish:false,count:"1",label:"金针菇",unit:"份",describe:"",price:10,imageurl:"https://p1.meituan.net/shaitu/99dd843cacf39925b39f8a60058a9c9a1497525.jpg"},
					]},
					{id:1,num:3,peoplecount:2,isfinish:true},
					{id:1,num:8,peoplecount:6,isfinish:false},
					{id:1,num:9,peoplecount:6,isfinish:true},
				]
			}
		},
		created() {
			this.canzhuonummap = this.$Tool.groupByAttributeSingle(this.canzhuoArray,"num");
			console.log(this.canzhuonummap);
			this.currentcanzhuo = this.canzhuoArray[0];
		},
		methods: {
			canZhuoInfo(canzhuonum){
				this.currentcanzhuo = this.canzhuonummap[canzhuonum];
				if(!this.currentcanzhuo){
					this.currentcanzhuo = "";
				}
				console.log("canzhuonummap",this.canzhuonummap[canzhuonum]);
			},
			
		}
	}
</script>

<style lang="scss">
	.mainscroll{
		height: 100%;
	}
	.uni-grid-item {
		.item{
			display: flex;
			flex-direction: column;
			text-align: center;
			margin-top: 50rpx;
			image {
				width: 100rpx;
				height: 100rpx;margin: 0 auto;
			}
			text {
				font-size: $uni-font-size-lg;
			}
			.peoplecont{
				position: relative;
				top: -175rpx;
			}
			.zhuohao{
				position: relative;
				top: -15rpx;
			}
		}
	}
	.foodcontent{
		margin-top: 50rpx;
		min-height: 200rpx;
		.title{
			text{
				font-size: 50rpx;
				font-weight: 600;
				margin-left: 50rpx;
			}
		}
		.item{
			font-size:  $uni-font-size-lg;
			font-weight: 600;
			.finishimg{
				position: relative;
				top: -40rpx;
				margin-top: -100rpx;
			}
		}
	}
</style>
