<template>
	<view>
		<view class="chartitem">
			<!-- 销售金额饼图 -->
			<view class="charttitle">
				<text>近{{days}}天销售额如下：</text>
			</view>
			<view class="charts-box">
			  <qiun-data-charts
			    type="line"
			    :chartData="chart.yyqkdaysline"
			    background="none"
			  />
			</view>
		</view>
		<view class="chartitem">
			<!-- 销售金额饼图 -->
			<view class="charttitle">
				<text>近{{months}}个月销售额如下：</text>
			</view>
			<view class="charts-box">
			  <qiun-data-charts
			    type="line"
			    :chartData="chart.yyqkmonthsline"
			    background="none"
			  />
			</view>
		</view>
	</view>
</template>

<script>
	import yyqkApi from '@/api/yyqkApi.js'
	export default {
		data() {
			return {
				onedaytime:1*24*60*60*1000,
				onemonthtime:30*1*24*60*60*1000,
				currentDate:"",
				days:7,
				months:6,
				years:5,
				chart:{
					yyqkdaysline:{
					  categories:[],
					   series: [{data: [],	name:"",  }]
						
					},
					yyqkmonthsline:{
					  categories:[],
					   series: [{data: [],	 name:"",   
						}]
					},
					yyqkyearsline:{
					  categories:[],
					   series: [{data: [],	name:"",    
						}]
					},
				}
			}
		},
		created() {
			this.init();
		},
		methods: {
			 async init(){
				this.currentDate =await this.$SysApi.getSystemDateTime();
				this.currentDate = this.$Tool.str2Date(this.currentDate);
				//console.log(this.currentDate);
				this.statisticsYYQK();
			},
			async statisticsYYQK(){
				let yyqkdays = await yyqkApi.findyyqkday(this.days);
				let yyqkmonths = await yyqkApi.findyyqkmonth(this.months);
				let yyqkyears = await yyqkApi.findyyqkyear(this.years);
				//console.log("yyqkdays:",yyqkdays);
				//console.log("yyqkmonths:",yyqkmonths);
				//console.log("yyqkyears:",yyqkyears);
				this.computedDays(yyqkdays);
				this.computedMonths(yyqkmonths);
				this.computedYears(yyqkyears);
			},
			computedDays(yyqkdays){
				if(!yyqkdays || yyqkdays.length === 0){
					return;
				}
			
				let startDate = this.$Tool.str2Date(yyqkdays[0].formatdate);
				//console.log(this.currentDate);
				//开始天数
				var startday=this.days - parseInt((this.currentDate - startDate)/(this.onedaytime));
				//console.log("开始天数：",parseInt((this.currentDate - startDate)/(this.onedaytime)));
				
				for (var i = startday +1; i <= this.days; i++) {
					let index = i-startday-1;
					let yyqkday = yyqkdays[index+1];

					if(!yyqkday){
						let start =  this.$Tool.str2Date(yyqkdays[index].formatdate);
						let date =  this.$Tool.dateChange(1,start);
						yyqkdays.push({formatdate:date,finalchargesum:0});
						continue;
					}
					
					let start =  this.$Tool.str2Date(yyqkdays[index].formatdate);
					let end =  this.$Tool.str2Date(yyqkdays[index+1].formatdate);
					let xiangcha = parseInt((end - start)/this.onedaytime) -1 ;
					//console.log("相差："+xiangcha);
					for (var j = 0; j < xiangcha; j++) {
						let date =  this.$Tool.dateChange(j+1,start);
						yyqkdays.splice(index+j+1,0,{formatdate:date,finalchargesum:0});
					}
				}
				
				let yyqkdaysline = this.chart.yyqkdaysline;
				yyqkdays.forEach(item=>{
					
					yyqkdaysline.series[0].data.push({"name":item.formatdate, "value":item.finalchargesum});
					yyqkdaysline.categories.push(item.formatdate.substring(5));
					//console.log(item.formatdate.substring(5));
				});
				//console.log("yyqkdays:",yyqkdays);
			},
			computedMonths(yyqkmonths){
				if(!yyqkmonths || yyqkmonths.length === 0){
					return;
				}
				let currentDate = this.currentDate;
				let startDate = this.$Tool.str2Date(yyqkmonths[0].formatdate);
				//console.log(startDate);
				
				//开始月份
				var startMonth=this.months  - this.$Tool.computedMonth(startDate,this.currentDate);
				let index = 0;
				for (var i = startMonth +1; i < this.months; i++) {
					index = i-startMonth -1;
					let yyqkMonth = yyqkmonths[index+1];
					if(!yyqkMonth){
						let date = this.$Tool.addMonth(-i,currentDate);
						console.log(date);
						yyqkmonths.push({formatdate:date,finalchargesum:0});
						continue;
					}
					let start =  this.$Tool.str2Date(yyqkmonths[index].formatdate);
					let end =  this.$Tool.str2Date(yyqkmonths[index+1].formatdate);
					let xiangcha =this.$Tool.computedMonth(start,end);
					for (var j = 0; j < xiangcha-1; j++) {
						
						let date =  this.$Tool.addMonth(j+1,start);
						//console.log(date);
						yyqkmonths.splice(index+j+1,0,{formatdate:date,finalchargesum:0});
						
					}
					
				}
				let yyqkmonthsline = this.chart.yyqkmonthsline;
				 yyqkmonths.forEach(item=>{
					let label = parseInt(item.formatdate.substring(5))+"月";
					yyqkmonthsline.series[0].data.push({"name":item.formatdate, "value":item.finalchargesum});
					yyqkmonthsline.categories.push(label);
					//console.log(item.formatdate.substring(5));
				});
				console.log("yyqkmonths:",yyqkmonths); 
			},
			computedYears(yyqkyears){
				if(!yyqkyears || yyqkyears.length === 0){
					return;
				}
				let currentDate = this.currentDate;
				
				let Tool = this.$Tool;
				let startYear =parseInt(yyqkyears[0].formatdate) ;
				let endYear = currentDate.getFullYear();
				//console.log(startYear,endYear);
				for (var i =  startYear+1; i < endYear; i++) {
					let index = i-startYear-1;
					let start = yyqkyears[index].formatdate*1;
					let end = yyqkyears[index+1].formatdate*1;
					
					while(end - start > 1){
						yyqkyears.splice(index+1,0,{formatdate:i+"",finalchargesum:0});
						start++;
						index++;
					}
				}
				console.log("yyqkyears:",yyqkyears);
			},
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
