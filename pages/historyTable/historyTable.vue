<template>
	<!-- 历史餐桌，认定为完成本桌，isfinish -->
	<view class="historytable">
		<view class="list">
			<view class="item box" 
				v-for="item in canzhuoArray" 
				:key="item.canzhuonum"
				@click="gotoHistoryDetails(item)">
				<view class="row title">
					<view class="label">
						<text >餐桌:</text>
					</view>
					<view class="value">
						<text >{{item.canzhuonum}}号</text>
					</view>
					
				</view>
				<view class="row ">
					<view class="label">
						<text >结账金额:</text>
					</view>
					<view class="value price">
						<text >￥{{item.finalchargesum}}</text>
					</view>
					
					
					
				</view>
				<view class="sprow ">
					<view class="row">
						<view class="label">
							<text >就餐次数:</text>
						</view>
						<view class="value ">
							<text >{{item.timessum}}次</text>
						</view>
					</view>
					
					<view class="row">
						<view class="label">
							<text >就餐人数:</text>
						</view>
						<view class="value ">
							<text >{{item.peopletotalsum}}人</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import canZhuoApi from '@/api/canZhuoApi.js'
	export default {
		data() {
			return {
				canzhuoArray:[],
			}
		},
		onLoad(option) {
			this.init();
		},
		onPullDownRefresh() {
			this.init();
			uni.stopPullDownRefresh();
		},
		methods: {
			async init(){
				//查询以餐桌为主体的就餐量
				let canzhuoArray  = await canZhuoApi.historytablestatistics();
				this.canzhuoArray = canzhuoArray;
				//console.log(canzhuoArray);
			},
			//到餐桌详情
			gotoHistoryDetails(canzhuo){
				this.$mRouter.navigateTo("historyTableDetails",
				{canzhuonum:canzhuo.canzhuonum},
				)
			}
		}
	}
</script>

<style lang="scss">
	.historytable{
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
		}
		.row{
			line-height: 50rpx;
		}
	}
</style>
