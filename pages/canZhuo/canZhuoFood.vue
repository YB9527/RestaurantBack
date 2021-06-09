<template>
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
</template>

<script>
	export default{
		data(){
			return{
				canzhuonum:"",
			}
		},
		onLoad(option) {
			let canzhuonum = option.canzhuonum;
			this.canzhuonum = canzhuonum;
			uni.setNavigationBarTitle({
			    title: '王氏羊肉（'+canzhuonum+"号桌）"
			});
			this.init();
		},
		methods:{
			init(){
				//查找餐桌上的食物
				let canzhuonum = this.canzhuonum;
				
			}
		}
	}
</script>

<style>
</style>
