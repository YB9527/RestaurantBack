<template>
	<view class="foodmanager">
		<view class="food">
			<view class="imgitem">
				<text>食物图片</text>
				
				<view class="imgcontent">
					<uni-file-picker  ref="upload"
						@delete="deleteUniFile"
						@select="select" :url="uploadAttr.url" :auto-upload="false"
						 v-model="uploadAttr.imageValue" file-mediatype="image" mode="grid"
						file-extname="jpeg,png,jpg" :limit="1" :readonly="uploadAttr.readonly" />
				</view>
				
			</view>
			
			<view class="item">
				<text class="label">食物名称</text>
				<input type="text" v-model="food.label" placeholder="请输入名称" />
			</view>
			<view class="item">
				<text class="label">价格￥</text>
				<input type="number"  v-model="food.price" placeholder="请输入价格" />
			</view>
			
			
		</view>
		
		
		
	</view>
</template>

<script>
	import ldSelect from '@/components/ld-select/ld-select.vue'
	import foodApi from '@/api/foodApi.js'
	export default {
		components: {
			ldSelect
		},
		data() {
			return {
				foodtypeid:"",
				imageValue:[],
				uploadAttr: {
					readonly: false,
					url: "http://baidu.com",
					imageValue: [],
				},
				food: {
					id:"",
					imageurl: "",
					label: "",
					price: 0,
					unit: 0,
					state: 0,
					describe: "",
				},
				foodstatearray: [{
						value: 0,
						label: "停卖"
					},
					{
						value: 1,
						label: "售卖"
					},
					{
						value: 2,
						label: "售完"
					},
				],
				unitarray: [{
						value: 0,
						label: "斤"
					},
					{
						value: 1,
						label: "份"
					},
					{
						value: 2,
						label: "个"
					},
				],
			}
		},
		onLoad(option) { //option为object类型，会序列化上个页面传递的参数
			let foodid = option.foodid; //打印出上个页面传递的参数。
			let foodtypeid = option.foodtypeid; //打印出上个页面传递的参数。
		
			if(foodid){
				//查找食物
				this.food.id = foodid;
				this.findFoodById(foodid);
				
			}else{
				this.foodtypeid = foodtypeid;
			}
			
		},
		methods: {
			findFoodById(foodid){
				foodApi.findFoodById(foodid)
				.then(food=>{
					//console.log(food);
					this.food = food;
					let url =  this.$Api.imgpriewurl+food.imageurl;
					console.log(url);
					this.uploadAttr.imageValue.push({path:url});
				});
			},
			addFood() {
				let imgfile;
				if(this.uploadAttr.imageValue.length > 0){
					imgfile = this.uploadAttr.imageValue[0];
				}
				//保存图片，拿到
				let food = this.food;
				food.foodtypeid = this.foodtypeid;
				food.id = this.$Tool.uuid();
				foodApi.saveFood(food,imgfile.path).then(()=>{
					uni.navigateBack({
						delta:1
					})
				});
				
			},
			updateFood(){
				let imgfile;
				if(this.uploadAttr.imageValue.length > 0){
					imgfile = this.uploadAttr.imageValue[0];
				}
				let food = this.food;
				console.log(1,imgfile);
				
				foodApi.updateFood(food,imgfile?imgfile.path:'').then(()=>{
					uni.navigateBack({
						delta:1
					})
				});
			},
			deleteFood(){
				 this.$refs.popup.open();
			},
			deleteConfirm(){
				
				foodApi.deleteFood(this.food)
					.then(res=>{
						console.log(res);
						uni.navigateBack({
							delta:1
						})
					});
			},
			selectChange: function(val) {
				this.food.state = val
			},
			deleteUniFile({tempFile,tempFilePath}){
				for (var i = 0; i < this.uploadAttr.imageValue.length; i++) {
					this.uploadAttr.imageValue[i] === tempFile && this.uploadAttr.imageValue.splice(i,1);
				}
			},
			// 获取上传状态
			select(e) {
				//console.log(e);
				this.uploadAttr.imageValue = [...this.uploadAttr.imageValue, ...e.tempFiles, ];
			},
			unitSelectChange(val){
				this.food.unit = val;
			}
		}
	}
</script>

<style lang="scss">
	.foodmanager {
		
		padding: 20rpx;
		background-color: #FFFFFF;
		height: 100%;
		
		text{
			font-size: $uni-font-size-lg;
			font-weight: 600;
			padding-left: 20rpx;
		}
		.item {
			width: 700rpx;
			display: flex;
			
			border-bottom: 1px solid #cacaca;
			height: 100rpx;
			line-height: 120rpx;
			.label{
				width: 200rpx;
				margin-right: 50rpx;
			}
		}
		.imgcontent{
			margin-top: 20rpx;
		}
		
		.main{
			margin-top: 10rpx;
			
		}
		.onebtnview{
			margin-top: 50rpx;
			padding: 0 50rpx;

		}
		
		uni-input{
			height: 100%;
		}
	}
	
</style>
