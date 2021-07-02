<template>
	<!-- 热门菜品 -->
	<view>
		<view>
			<!-- 销售金额排行榜 -->
		</view>
		<view class="chartitem">
			<!-- 销售金额饼图 -->
			<view class="charttitle">
				<text>菜品销售 金额 占比图如下：</text>
			</view>
			<view class="charts-box">
			  <qiun-data-charts
			    type="column"
			    :chartData="chart.foodPricePie"
			    background="none"
			  />
			</view>
		</view>
		<view class="chartitem">
			<!-- 销售份数饼图 -->
			<view class="charttitle">
				<text>菜品销售 份额 占比图如下：</text>
			</view>
			<view class="charts-box">
			  <qiun-data-charts
			    type="pie"
			    :chartData="chart.foodCountPie"
			    background="none"
			  />
			</view>
		</view>
		<view class="chartitem">
			<!-- 类型金额饼图 -->
			<view class="charttitle">
				<text>菜品分类销售 金额 占比图如下：</text>
			</view>
			<view class="charts-box">
			  <qiun-data-charts
			    type="pie"
			    :chartData="chart.foodTypePricePie"
			    background="none"
			  />
			</view>
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
				chart:{
					foodPricePie:{
					
					  categories:[],
					   series: [{data: [],	 name:"",
						}],
						tooltipFormat:(a,b)=>{
							console.log(1,a,b);
						}
					},
					foodCountPie:{
					  categories:[],
					   series: [{data: [],	  
						}]
					},
					foodTypePricePie:{
					  categories:[],
					   series: [{data: [],	  
						}]
					},
				}
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
				let foodPricePie = this.chart.foodPricePie;
				foodArray.forEach(item=>{
					foodPricePie.series[0].data.push({"name":item.label, "value":item.pricetotalsum});
                  foodPricePie.categories.push(item.label);
				});
				//console.log("foodPriceArray:",foodArray);
			},
			async findFoodCount(){
				let foodArray =await yyqkApi.findyearfoodcount();

				this.computedSum(foodArray);
				this.foodCountArray.push(...foodArray);
				//console.log("foodCountArray:",foodArray);
				let foodCountPie = this.chart.foodCountPie;
				foodArray.forEach(item=>{
					foodCountPie.series[0].data.push({"name":item.label, "value":item.countsum});
				  
				});
			},
			async findFoodTypePrice(){
				let foodArray =await yyqkApi.findyeartypeprice();
				this.computedSum(foodArray);
				this.foodTypefoodPriceArray.push(...foodArray);
				//console.log("foodTypefoodPriceArray:",foodArray);
				let foodTypePricePie = this.chart.foodTypePricePie;
				foodArray.forEach(item=>{
					foodTypePricePie.series[0].data.push({"name":item.foodtypelabel, "value":item.pricetotalsum});
				  
				});
				
			},
			async findFoodTypeCount(){
				let foodArray =await yyqkApi.findyeartypecount();
				this.computedSum(foodArray);
				this.foodTypefoodCountArray.push(...foodArray);
				//console.log("foodTypefoodCountArray:",foodArray);
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

<style lang="scss">
	.charttitle{
		font-weight: 600;
		font-size: $uni-font-size-lg2;
	}
	.chartitem{
		margin-bottom: 50rpx;
		background-color: #fff;
		padding: 20rpx 10rpx;
	}
</style>
