<template>
	<!-- 热门菜品 -->
	<view>
		<view>
			<!-- 销售金额排行榜 -->
		</view>
		<view>
			<!-- 销售金额饼图 -->
		</view>
		<view>
			<!-- 销售份数饼图 -->
		</view>
		<view>
			<!-- 类型金额饼图 -->
		</view>
		
	</view>
</template>

<script>
	import yyqkApi from '@/api/yyqkApi.js'
	export default{
		data(){
			return{
				max:5,
				foodPriceArray:[],
				foodCountArray:[],
				foodTypefoodPriceArray:[],
				foodTypefoodCountArray:[],
			}
		},
		created() {
			this.init();
		},
		methods:{
			 init(){
				 this.clearData();
				
				this.findFoodPrice();
				this.findFoodCount();
				this.findFoodTypePrice();
				this.findFoodTypeCount();
			},
			clearData(){
				if(this.foodPriceArray.length > 0){
									 this.foodPriceArray.splice(0,this.foodPriceArray.length);
				}
				if(this.foodCountArray.length > 0){
					this.foodCountArray.splice(0,this.foodCountArray.length);
				}
				if(this.foodTypefoodPriceArray.length > 0){
					this.foodTypefoodPriceArray.splice(0,this.foodTypefoodPriceArray.length);
				}
				if(this.foodTypefoodCountArray.length > 0){
					this.foodTypefoodCountArray.splice(0,this.foodTypefoodCountArray.length);
				}
			},
			async findFoodPrice(){
				let foodArray =await yyqkApi.findyearfoodprice();
				//console.log("foodArray:",foodArray);
				this.computedSum(foodArray);
				this.foodPriceArray.push(...foodArray);
				console.log("foodPriceArray:",foodArray);
			},
			async findFoodCount(){
				let foodArray =await yyqkApi.findyearfoodcount();
				//console.log("foodArray:",foodArray);
				this.computedSum(foodArray);
				this.foodCountArray.push(...foodArray);
				console.log("foodCountArray:",foodArray);
			},
			async findFoodTypePrice(){
				let foodArray =await yyqkApi.findyeartypeprice();
				//console.log("foodArray:",foodArray);
				this.computedSum(foodArray);
				this.foodTypefoodPriceArray.push(...foodArray);
				console.log("foodTypefoodPriceArray:",foodArray);
			},
			async findFoodTypeCount(){
				let foodArray =await yyqkApi.findyeartypecount();
				//console.log("foodArray:",foodArray);
				this.computedSum(foodArray);
				this.foodTypefoodCountArray.push(...foodArray);
				console.log("foodTypefoodCountArray:",foodArray);
			},
			computedSum(foodArray){
				let max = this.max - 1;
				if(foodArray.length > this.max){
					let food = {label:"其他",pricetotalsum:0,countsum:0};
					for (var i = max; i < foodArray.length; i++) {
						if(foodArray[i].pricetotalsum){
							food.pricetotalsum = food.pricetotalsum*1 +foodArray[i].pricetotalsum*1;
						}
						if(foodArray[i].countsum){
							food.countsum = food.countsum*1 +foodArray[i].countsum*1;
						}
					
					}
					foodArray.splice(max,foodArray.length - max,food);
				}
				
			}
		}
	}
</script>

<style>
</style>
