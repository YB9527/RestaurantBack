<template>
	<view class="historytablefood">
		<view class="list">
			<view class="item box" 
				v-for="item in foodArray" 
				:key="item.id"
				>
				<view class="row ">
					<image mode="aspectFill" :src="item.baseimageurl"></image>
					<view>
						<view class="foodname">
							<text>{{item.label}}</text>
						</view>
						<view class="row">
							<view class="label">
								<text > 单价：</text>
							</view>
							<view class="value">
								<text >{{item.price}}/{{item.unit | foodUnitFilter}}</text>
							</view>
							
						</view>
						<view class="row">
							<view class="label">
								<text > 共：</text>
							</view>
							<view class="value">
								<text >{{item.count}}{{item.unit | foodUnitFilter}}</text>
							</view>
							
							
						</view>
						<view class="row">
							<view class="label">
								<text>合计：</text>
							</view>
							<view class="value">
								<text class="price">￥{{item.price*item.count}}</text>
							</view>
							
							
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
				canzhuoid:"",
				canzhuo:"",
				foodArray:[],
			}
		},
		onLoad(option) {
			this.canzhuoid = option.canzhuoid;
			this.init();
		},
		methods:{
			async init(){
				let canzhuoid = this.canzhuoid;
				if(canzhuoid === undefined){
					return;
				}
				
				//餐桌该餐桌所有就餐情况
				let canzhuo = await canZhuoApi.findById(canzhuoid);
				//设置标题
				uni.setNavigationBarTitle({
				    title: canzhuo.canzhuonum+"号桌"+canzhuo.date
				});
				//查找每次的就餐统计
				console.log(canzhuo);
				
				this.canzhuo= canzhuo;
				this.foodArray = canzhuo.canzhuofoodArray;
			},
			
		}
	}
</script>

<style lang="scss">
	.historytablefood{
		padding: 20rpx;
		.item{
			margin-bottom: 20rpx;
			padding: 20rpx;
			color: #999999;
		
			.foodname{
				color: #333333;
				font-weight: 600;
			}
			.label{
				width: 90rpx;
			}
			image{
				border-radius: 8rpx;
				width: 200rpx;
				height: 200rpx;
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
