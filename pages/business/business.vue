<template>
	<view>
<!-- 		营业详情
		查看每天、每月、每年、营业详情,
		查看点餐菜品数量点击排行榜 -->
		<yyqk></yyqk>
		<thisyear></thisyear>
	</view>
</template>

<script>
	import yyqk from './yyqk.vue'
	import thisyear from './thisYear.vue'
	export default {
		components:{yyqk,thisyear},
		data() {
			return {
				
			}
		},
		onLoad() {
			this.init();
		},
		methods: {
			 init(){
				
			},
			
		}
	}
</script>

<style lang="scss">

</style>
