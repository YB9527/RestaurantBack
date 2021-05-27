<template>
	<view class="indexcontent">
		<uni-grid :column="3" :showBorder="false"  :square="false">
		    <uni-grid-item >
				<view class="item" @click="goto('/pages/canZhuo/canZhuo')">
					<image  src="/static/logo.png"></image>
					<text class="text">餐桌界面</text>
				</view>
		    </uni-grid-item>
		    <uni-grid-item >
				<view class="item"  @click="goto('/pages/foodTypeManager/foodTypeManager')">
					<image src="/static/logo.png"></image>
					<text class="text">菜类管理</text>
				</view>
		    </uni-grid-item>
		    <uni-grid-item >
				<view class="item" @click="goto('/pages/evaluateManger/evaluateManger')">
					<image  src="/static/logo.png"></image>
					<text class="text">评价管理</text>
				</view>
			</uni-grid-item>
			<uni-grid-item >
				<view class="item" @click="goto('/pages/restaurantConfig/restaurantConfig')">
					<image src="/static/logo.png"></image>
					<text class="text">店铺配置</text>
				</view>
				
			</uni-grid-item>
			<uni-grid-item >
				<view class="item" @click="goto('/pages/business/business')">
					<image src="/static/logo.png"></image>
					<text class="text">营业详情</text>
				</view>
			</uni-grid-item>
			<uni-grid-item>
				<view class="item">
					<image src="/static/logo.png"></image>
					<text class="text">文本</text>
				</view>
			</uni-grid-item>
		</uni-grid>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
			goto(url){
				console.log(url)
				uni.navigateTo({
				    url
				});
			}
		}
	}
</script>

<style lang="scss">
	.uni-grid-item {
		.item{
			display: flex;
			flex-direction: column;
			text-align: center;
			margin-top: 200rpx;
			image {
				width: 100rpx;
				height: 100rpx;margin: 0 auto;
			}
			text {
				font-size: $uni-font-size-lg;
			}
		}
		
	}
	/* .indexcontent {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		
		
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	} */
</style>
