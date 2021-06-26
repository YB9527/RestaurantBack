<template>
	<view>
		<view class="top">
			<view @click="screenCanZhuoClick(item)" :class="item.isactive?'acitve '+ item.value: item.value"
				v-for="item in screenCanZhuoArray" :key="item.label">
				<text>{{item.label}}</text>
			</view>

		</view>
		<scroll-view class="mainscroll" scroll-y="true">
			<view class="list" v-if="isshowdata">
				<view v-if="showcanzhuonummap[index+1]" class="item" v-for="(canzhuonum,index) in canzhuomax"
					:key="index" @click="canZhuoInfo(index+1)">
					<view class="zhuonum"><text>{{index+1}}号桌</text></view>
					<view>
						<image mode="aspectFill" v-if="!canzhuonummap[index+1]" src="/static/images/free.png">
						</image>
						<image mode="aspectFill" v-else-if="canzhuonummap[index+1].ischeckout"
							src="/static/images/checkout2.png"></image>
						<image mode="aspectFill" v-else-if="canzhuonummap[index+1].isfoodover"
							src="/static/images/dishfinish.png"></image>
						<image mode="aspectFill" v-else src="/static/images/dish.png"></image>
					</view>
					<view class="peoplecount" v-if="canzhuonummap[index+1]">
						<text>{{canzhuonummap[index+1].peopletotal}}人</text>
					</view>
				</view>
			</view>


		</scroll-view>
	</view>



</template>

<script>
	import canZhuoApi from '@/api/canZhuoApi.js'
	import canZhuoFoodApi from '@/api/canZhuoFoodApi.js'
	export default {
		data() {
			return {
				screenCanZhuoArray: [{
						label: "空桌",
						value: "kongzhuo",
						isactive: false
					},
					{
						label: "正在上菜",
						value: "shangcai",
						isactive: false
					},
					{
						label: "菜品上齐",
						value: "shangqi",
						isactive: false
					},
					{
						label: "已结账",
						value: "jiezhang",
						isactive: false
					},
				],
				isshowdata: false,
				canzhuomax: 10, //总共餐桌数量
				showcanzhuonummap: {},
				canzhuonummap: {},
				canzhuoArray: []
			}
		},
		created() {
			
		},
		onShow() {
			this.init();
		},
		onPullDownRefresh() {
			this.init();
			uni.stopPullDownRefresh();
		},
		methods: {
			init() {
				this.findcanZhuoCount();
				this.findCanZhuoState();
			},
			//查找总桌数
			findcanZhuoCount() {
				canZhuoApi.getCanZhuoCount().then(canzhuocount => {
					if (canzhuocount) {
						//console.log(1,canzhuocount)
						this.canzhuomax = canzhuocount * 1;
					}
				});
			},
			//查找所有餐桌的状态及人数
			findCanZhuoState() {
				this.isshowdata = false;
				canZhuoApi.findCanZhuoHomeData()
					.then(canzhuoArray => {
						this.canzhuoArray = canzhuoArray;
						this.canzhuonummap = this.$Tool.groupByAttributeSingle(canzhuoArray, "canzhuonum");
						let idArray = [];
						canzhuoArray.forEach(item => {
							idArray.push(item.id);
						});
						//console.log("idArray",idArray);
						canZhuoFoodApi.findcanzhuofoodbycanzhuoid(idArray).then(canfoodarray => {
							canZhuoApi.computedCanZhuoFood(canzhuoArray, canfoodarray);
							//this.isshowdata = true;
							this.screenCanZhuoClick();
						})
					});
			},

			canZhuoInfo(canzhuonum) {
				let canzhuo = this.canzhuonummap[canzhuonum];
				if (canzhuo) {
					let url = "/pages/canZhuo/canZhuoFood?canzhuonum=" + canzhuonum;
					uni.navigateTo({
						url
					})
				} else {
					uni.showToast({
						title: "不要着急",
						icon: "none"
					})
				}


			},
			//点击的餐桌
			showNoCanZhuo(canzhuonum) {
				uni.showToast({
					title: canzhuonum + "号桌无人",
					icon: "none"
				})
			},
			screenCanZhuoClick(item) {

				if (item) {
					item.isactive = !item.isactive;
				}
				this.isshowdata = false;
				let showcanzhuonummap = this.showcanzhuonummap;
				let flag = false;
				for (var i = 0; i < this.canzhuomax ; i++) {
					let canzhuonum = i + 1 + "";
					let canzhuo = this.canzhuonummap[canzhuonum];
					showcanzhuonummap[canzhuonum] = false;
					for (let screenCanZhuo of this.screenCanZhuoArray) {
						//如果已经显示了，就不用看其他情况了
						if (showcanzhuonummap[canzhuonum]) {
							break;
						}
						//如果没有选择任何情况就所有的都不显示了
						if(screenCanZhuo.isactive){
							flag = true;
						}
						switch (screenCanZhuo.value) {
							case "kongzhuo":
								if (!canzhuo) {
									showcanzhuonummap[canzhuonum] = screenCanZhuo.isactive;
								}
								break;
							case "shangcai":
								if (canzhuo && !canzhuo.isfoodover) {
									showcanzhuonummap[canzhuonum] = screenCanZhuo.isactive;
								}
								break;
							case "shangqi":
								if (canzhuo && canzhuo.isfoodover) {
									showcanzhuonummap[canzhuonum] = screenCanZhuo.isactive;
								}
								break;
							case "jiezhang":
								if (canzhuo && canzhuo.ischeckout) {
									showcanzhuonummap[canzhuonum] = screenCanZhuo.isactive;
								}
								break;
						
					}

				}
				if(!flag){
					//没有选择，就显示全部
					for(let num in showcanzhuonummap){
						showcanzhuonummap[num] = true;
					}
				}
			}
			//console.log(showcanzhuonummap);
			this.isshowdata = true;
		}

	}
	}
</script>

<style lang="scss">
	.mainscroll {
		height: 100%;

		.list {
			display: flex;
			flex-wrap: wrap;

			.zhuonum {
				font-size: $uni-font-size-lg;
				font-weight: 600;
			}

			.peoplecount {
				margin-top: -6rpx;
			}
		}

		.item {
			text-align: center;
			width: 25%;
			margin-top: 50rpx;

			image{			width: 100rpx;
				height: 100rpx;
			}

			.finishimg {
				position: relative;
				top: -40rpx;
				margin-top: -100rpx;
			}
		}
	}

	.top {
		color: #333333;
		height: 100rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;

		view {
			width: 20%;
			text-align: center;
			border: 1px dashed #C0C0C0;
			height: 60rpx;
			line-height: 60rpx;
		}

		.acitve {
			background-color: #DD524D;
		}

		.kongzhuo {
		
		}

		.shangcai {
			
		}

		.shangqi {
			
		}

		.jiezhang {
			
			background-size: 100%;
		}
	}
</style>
