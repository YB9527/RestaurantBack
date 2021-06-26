<template>
	<view class="historytabledetails">
		<view class="list">
			<view class="item box" 
				v-for="item in canzhuoArray" 
				:key="item.id"
				@click="gotoFoodDetails(item)">
				<view class="row ">
					<view class="label">
						<text >就餐时间:</text>
					</view>
					<view class="value">
						<text >{{item.date}}</text>
					</view>
				</view>
				<view class="sprow ">
					<view class="row">
						<view class="label">
							<text >结账时间:</text>
						</view>
						<view class="value ">
							<text >{{item.checkdate}}</text>
						</view>
					</view>
					<view class="row">
						<view class="label">
							<text >耗时:</text>
						</view>
						<view class="value ">
							<text >{{item.date | minuteCompted(item.checkdate)}} 分钟</text>
						</view>
					</view>
				</view>
				<view class="row ">
					<view class="label">
						<text >用户手机:</text>
					</view>
					<view class="value ">
						<text >{{item.checkuserid}}</text>
					</view>
				</view>
				<view class="sprow ">
					<view class="row" v-if="item.pricetotal != item.finalcharge">
						<view class="label">
							<text >消费金额:</text>
						</view>
						<view class="value deleteprice">
							<text >￥{{item.pricetotal}}</text>
						</view>
					</view>
					
					<view class="row">
						<view class="label">
							<text >结算金额:</text>
						</view>
						<view class="value price">
							<text >￥{{item.finalcharge}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	import canZhuoApi from '@/api/canZhuoApi.js'
	export default{
		data(){
			return{
				canzhuonum:"",
				canzhuoArray:[],
			}
		},
		onLoad(option) {
			this.canzhuonum = option.canzhuonum;
			this.init();
		},
		onPullDownRefresh() {
			this.init();
			uni.stopPullDownRefresh();
		},
		methods:{
			async init(){
				let canzhuonum = this.canzhuonum;
				if(canzhuonum === undefined){
					return;
				}
				//设置标题
				uni.setNavigationBarTitle({
				    title: +canzhuonum+"号桌历史详情"
				});
				//餐桌该餐桌所有就餐情况
				let canzhuoArray = await canZhuoApi.historytabledetailsByCanzhuonum(canzhuonum)
				//查找每次的就餐统计
				console.log(canzhuoArray);
				this.canzhuoArray= canzhuoArray;
			},
			gotoFoodDetails(canzhuo){
				this.$mRouter.navigateTo("historyTableFood",{canzhuoid:canzhuo.id})
			}
		}
	}
</script>

<style lang="scss">
	.historytabledetails{
		padding: 20rpx;
		.item{
			margin-bottom: 20rpx;
			padding: 20rpx;
			color: #999999;
			.label{
				margin-right: 20rpx;
				
			}
			.title{
				.value{
					font-size: $uni-font-size-lg2;
					font-weight: 600;
					color: #333333;
				}
			}
			.price{
				color: #DD514C;
			}
			.deleteprice{
				text-decoration:line-through;
			}
		}
		.row{
			line-height: 50rpx;
		}
		
	}
</style>
