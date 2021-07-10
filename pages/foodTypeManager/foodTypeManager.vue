<template>
	<view class="shopMallcontent">
		
		<view class="list">
			<view class="item" v-if="isedit">
				<button type="primary" @click="editOk">保存</button>
			</view>
			<view class="item box"
				v-for="(foodtype,index) in foodtypeList"
				:key="foodtype.id">
				<view class="itemmargin sprow" >
					<view class="row">
						<view @click="editType(foodtype)" class="foodlabel"><text >{{foodtype.label}}</text></view>
						<view @click="deleteType(foodtype.id)" v-if="!foodtype.foodcount"><text class="cuIcon-close delete"></text></view>
					</view>
					
					<view class="switch" v-if="isedit">
						<view @click="itemMove(foodtypeList,foodtype,-1)" v-if="index != 0"><text class="cuIcon-fold"> </text></view>
						<view @click="itemMove(foodtypeList,foodtype,+1)" v-if="index != foodtypeList.length-1"> <text  class="cuIcon-unfold"></text></view>
					</view>
				</view>
				<view class="itemmargin sprow">
					<view class="foodcount" @click="gotoFoodArray(foodtype)">
						<text>菜品数量：</text>
						<text>{{foodtype.foodcount?foodtype.foodcount :0 }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<view>
			<uni-fab
				horizontal="right"
				vertical="bottom"
				:content="content"
				@trigger="trigger"
			></uni-fab>
		</view>
		
		<inputdialog  ref="dialog":dialog="dialog" @confirm="addFodType"></inputdialog>
		<!-- <uni-popup v-if="popshow" ref="popup" type="dialog" :animation="false" >
		   <uni-popup-dialog :title="dialog.title" placeholder="请输入食物类型" @confirm="addFodType"  mode="input"   :value="dialog.foodtype.label"></uni-popup-dialog>
		</uni-popup> -->
		
	</view>
</template>

<script>
	import foodTypeApi from '@/api/foodTypeApi.js'
	import foodApi from '@/api/foodApi.js'
	import inputdialog from '@/components/inputDialog.vue'
	export default {
		components:{inputdialog},
		data() {
			return {
				content:[
					{iconPath:"/static/images/edit.png",text:"编辑"},
					{iconPath:"/static/images/add.png",text:"添加"},
				],
				isedit:false,
				deleteFoodTypeArray:[],
				dialog:{
					addtitle:"添加类型",
					edittitle:"编辑类型",
					title:"",
					isadd:true,
					foodtype:{},
				},
				cartFoodListShow:false,
				currentfoodtypeid:"",
				foodtype:{},//foodtype
				orderFoodCount:0,
				orderFoodList:[],//点的{菜品food、数量count}
				foodtypeList:[
					{id:1,label:"主菜"},
					{id:2,label:"配菜"},
					{id:21,label:"酒水"},
					{id:3,label:"小吃"},
	
				],
				foodList:[],
			}
		},
		filters: {
			computedAmount(orderFoodList){
				if(!orderFoodList){
					return 0;
				}
				let amount = 0; 
				for (let orderFood of orderFoodList) {
					amount += orderFood.food.price * orderFood.count;
				}
				
				return amount;
			},
			foodCount(food, orderFoodList){
				for (let orderFood of orderFoodList) {
				
					if(orderFood.food.id === food.id){
						return orderFood.count;
					}
				}
				return "";
			}
		},
		created() {
			this.init();
			
		},
		onShow() {
			this.init();
		},
		onPullDownRefresh() {
			this.init();
			uni.stopPullDownRefresh();
		},
		methods: {
			async init(){
				this.isedit = false;
				let foodtypeList = await foodTypeApi.findallandfoodcount();
				this.foodtypeList = foodtypeList;
				//console.log(foodtypeList);
			},
			//保存编辑
			async editOk(){
				for (var i = 0; i < this.foodtypeList.length; i++) {
					this.foodtypeList[i].seq = i;
				}
				await  foodTypeApi.updateFoodType(this.foodtypeList);
				uni.showToast({
					title:"保存成功"
				});
				tihs.isedit =false;
			},
			//条目移动
			itemMove(list,item,value){
				let index = list.indexOf(item);
				let tem =list[index];
				let tem2 =list[index+value];
				list.splice(index,1,tem2);
				list.splice(index+value,1,tem);
			},
			
			gotoFoodArray(foodtype){
				let url = "/pages/foodManager/foodList?foodtypeid="+foodtype.id+"&foodtypelabel="+foodtype.label;
				uni.navigateTo({
					url
				})
			},
			findAllFoodType(){
				return foodTypeApi.findAll();
			},
			//打开添加食物类型的窗口
			openAddTypeDialog(){
				
				let dialog = this.dialog;
				dialog.isadd = true;
				this.dialog.title = this.dialog.isadd?this.dialog.addtitle:this.dialog.edittitle;
				let foodType = {label:"",seq:this.foodtypeList.length};
				this.dialog.foodtype=foodType;
				dialog.value = "";
				this.$refs.dialog.open();
				
				console.log(1,dialog.show);
			},
			trigger(item){
				
					switch(item.index){
						case 0:
							this.isedit = !this.isedit;
							break;
						case 1:
							this.openAddTypeDialog();
							break;
					}
			},
			/**
			 * 添加食物类型
			 */
			async addFodType(newtypevalue){
				
				//foodtype/add
				let foodtype = this.dialog.foodtype;
				foodtype.label = newtypevalue;
				if(foodtype.id){
					await foodTypeApi.updateFoodType(foodtype);
					this.replaceFoodType(foodtype);
				}else{
					foodtype.id = this.$Tool.uuid(),
					await foodTypeApi.saveFoodType(foodtype);
					this.foodtypeList.push(foodtype);
				}
				
				
			},
			replaceFoodType(foodtype){
				let foodtypeList = this.foodtypeList;
				for (var i = 0; i < foodtypeList.length; i++) {
					if(foodtypeList[i].id === foodtype.id){
						//foodtypeList[i] = foodtype;
						foodtypeList.splice(i,1,foodtype);
					}
				}
				
			},
			editType(foodtype){
				
				let dialog = this.dialog;
				dialog.isadd = false;
				dialog.title = dialog.isadd?dialog.addtitle:dialog.edittitle;
				dialog.foodtype =this.$Tool.copy(foodtype);
				dialog.value = dialog.foodtype.label;
				this.$refs.dialog.open();
			},
			
			deleteType(typeid){
				foodTypeApi.deleteFoodType({id:typeid})
					.then(()=>{
						for (var i = 0; i < this.foodtypeList.length; i++) {
								if(this.foodtypeList[i].id === typeid){
									this.foodtypeList.splice(i,1);
									break;
								}
						}
						this.currentfoodtypeid =  this.foodtypeList.length > 0 ?this.foodtypeList[0].id:"";
						this.init();
					})
			},
			//到编辑食物页面
			gotoFoodManager(foodid){
				uni.navigateTo({
					url:"/pages/foodManager/foodManager?foodid="+foodid,
				})
			},
			
			
			
			//此食物有数量吗？
			haseCount(food, orderFoodList){
				for (let orderFood of orderFoodList) {
					if(orderFood.food.id === food.id){
						return true;
					}
				}
				return false;
			},
			//菜类被点击
			foodtypeclick(index,foodtpe){
				if(this.currentfoodtypeid === foodtpe.id){
					return;
				}
				this.currentfoodtypeid = foodtpe.id;
				this.foodtype = foodtpe;
				//console.log(1,this.currentfoodtypeid)
				this.findFoodByTypeId(foodtpe.id);
			},
			//根据食物类型获取所有食物
			findFoodByTypeId(typeid){
				foodApi.findFoodByTypeId(typeid)
					.then(foods=>{
						
						for (let food of foods) {
							food.url = this.$Api.imgpriewurl+food.imageurl;
							//console.log(food.url);
						}
						if(this.foodList && this.foodList.length > 0){
							this.foodList.splice(0,this.foodList.length);
						}
						this.foodList.push(...foods);
					});
			},
			
			
		}
	}
</script>

<style lang="scss" scoped>
	.shopMallcontent{
		width: 100%;
		height: 100%;
		.sprow{
			align-items:  center;
		}
		.list{
			padding: 20rpx;
			.item{
				margin-bottom: 20rpx;
				padding: 20rpx;
				.delete{
					color: #ED1C24;
					font-weight: 600;
					size: $uni-font-size-lg2;
				}
				.foodlabel{
					
					width: 150rpx;
					margin-right: 20rpx;
					text{
						
						font-size: $uni-font-size-lg2;
						font-weight: 600;
						border-bottom: 1px solid #999999;;
					}
				}
				.foodcount{
					border-bottom: 1px solid #bbbb;;
				}
				.switch{
					display: flex;
					view{
						text{
							font-size: $uni-font-size-lg2;
							font-weight: 600;
							color: #DD524D;
						}
						margin-left: 20rpx;
						width: 100rpx;
						text-align: center;
						height: 50rpx;

					}
				}
			}
			
		}
	
	}
</style>
