<template>
	<view>
		
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
				
				for (var i = startday +1; i < this.days; i++) {
					let index = 0;
					let yyqkday = yyqkdays[index+1];
					if(!yyqkday){
						let date =  this.$Tool.dateChange(-i,this.currentDate);
						yyqkdays.push({formatdate:date,finalchargesum:0});
						continue;
					}
					let start =  this.$Tool.str2Date(yyqkdays[index].formatdate);
					let end =  this.$Tool.str2Date(yyqkdays[++index].formatdate);
					let xiangcha = parseInt((end - start)/this.onedaytime) -1 ;
					//console.log("相差："+xiangcha);
					for (var j = 0; j < xiangcha; j++) {
						let date =  this.$Tool.dateChange(-i+j+1,this.currentDate);
						yyqkdays.splice(index+j,0,{formatdate:date,finalchargesum:0});
					}
				}
				console.log("yyqkdays:",yyqkdays);
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
				for (var i = startMonth +1; i < this.months; i++) {
					let index = 0;
					let yyqkMonth = yyqkmonths[index+1];
					if(!yyqkMonth){
						let date = this.$Tool.addMonth(-i,currentDate);
						console.log(date);
						yyqkmonths.push({formatdate:date,finalchargesum:0});
						continue;
					}
					let start =  this.$Tool.str2Date(yyqkmonths[index].formatdate);
					let end =  this.$Tool.str2Date(yyqkmonths[++index].formatdate);
					let xiangcha =this.$Tool.computedMonth(startDate,this.currentDate);
					for (var j = 0; j < xiangcha-1; j++) {
						let date =  this.$Tool.addMonth(j+1,start);
						yyqkmonths.splice(index+j,0,{formatdate:date,finalchargesum:0});
						i++;
					}
				}
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
					let index = 0;
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

<style>

</style>
