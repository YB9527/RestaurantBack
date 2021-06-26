<template>
	<view>
		<view class="item">
			<text>总共餐桌数量</text>
			<input type="text" v-model="canzhuocount" placeholder="请输入" />
		</view>
		<view class="onebtnview">
			<button type="primary" @click="confirm">确定</button>
		
		</view>
	</view>
</template>

<script>
	import canZhuoApi from '@/api/canZhuoApi.js'
	export default {
		data() {
			return {
				canzhuocount:0,
				
			}
		},
		onLoad() {
			this.init();
		},
		
		methods: {
			init(){
				canZhuoApi.getCanZhuoCount().then(canzhuocount=>{
					if(canzhuocount){
						console.log(canzhuocount)
						this.canzhuocount = canzhuocount;
					}
				});
			},
			async confirm(){
				await canZhuoApi.setCanZhuoCount(this.canzhuocount);
				uni.showToast({
					title:"保存成功"
				})
			}
		}
	}
</script>

<style lang="scss">
	.item{
		display: flex;
		justify-content: space-between;
		margin-top: 50rpx;
		padding: 0 20rpx;
		text{
			font-size: $uni-font-size-lg;
			font-weight: 600;
		}
		input{
			border-bottom: 1px solid #555555;
		}
	}
	.onebtnview{
		margin-top: 50rpx;
		padding: 0 50rpx;
	}
</style>
