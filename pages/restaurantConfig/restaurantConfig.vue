<template>
	<view>
		<view class="item">
			<text>总共餐桌数量：</text>
			<input type="text" v-model="store.canzhuocount" placeholder="请输入" />
		</view>
		<!-- <view class="item">
			<text>设置营业时间段：</text>
			<input type="text" v-model="store.canzhuocount" placeholder="请输入" />
		</view> -->
		<!-- <view class="item">
			<text>店铺名称：</text>
			<input type="text" v-model="store.storename" placeholder="请输入" />
		</view> -->
		<view class="onebtnview" >
			<button type="primary" @click="confirm">确定</button>
		</view>
	</view>
</template>

<script>
	import canZhuoApi from '@/api/canZhuoApi.js'
	export default {
		data() {
			return {
				store:{},
			}
		},
		onLoad() {
			this.init();
		},
		
		methods: {
			async init(){
				
				uni.showLoading({
					title:""
				});
				let store = await this.$StoreConfigApi.findConfig();
				if (store) {
					this.store = store;
				}
				uni.hideLoading();
			},
			async confirm(){
				let store = this.store;
				if(store.id){
					this.$StoreConfigApi.updateConfig(store);
				}else{
					this.$StoreConfigApi.addConfig(store);
				}
				
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
