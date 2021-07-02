<template>
	<view>
			
	
		<button type="primary" @click="readIconInCss">读取图标文件</button>
		<view class="iconcontent">
			<view  class="item" v-for="(item,index) in iconArray" :key="index" @click="copy(item)">
			   <text :class="item" class="iconview"></text>
			   <text :selectable="true" :user-select="true">{{item}}</text>
			</view>
		</view>
		 
	</view>
</template>

<script>
	 //在需要解密的页面引用该文件
	 
	export default {
		data() {
			return {
				iconArray:[],
			}
		},
		onShow() {
		
		},
		methods: {
			
			
			copy(value){
				uni.setClipboardData({
				    data: value,
				    success: function () {
				        console.log('success');
				    }
				});
				 console.log('<text  class="'+value+'"></text>' );
				/*		
				uni.setClipboardData({
					data:value,//要被复制的内容
					success:()=>{//复制成功的回调函数
					  uni.showToast({//提示`
						title:'复制成功'
					  })
					}
				  }); 
				  */
			},
			//读取图标文件
			readIconInCss(){
				let filePath = "/static/css/colorui/icon.css";
				let xhr = null, okStatus = document.location.protocol === 'file' ? 0 : 200
				xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')      
				xhr.open('GET', filePath, false);
				
				xhr.overrideMimeType('text/html;charset=utf-8')
				xhr.send(null)
				let  text =  xhr.status === okStatus ? xhr.responseText : null;
				let start = text.indexOf(".")+1;
				let end = text.indexOf("{",start)
				while(start !== 0 && end !== -1 ){
					let cl = text.substring(start,end);
					
					if(cl.indexOf("cuIcon") !== -1){
						if(cl.indexOf(":") !== -1){
							end = text.indexOf(":",start)
							cl = text.substring(start,end);
						}
						if(cl.length < 15){
							this.iconArray.push(cl);
						}
						
					}
					start =  text.indexOf(".",end)+1;
					end =  text.indexOf("{",start);
				}
			
				
				//console.log(this.iconArray)
			}
		}
	}
</script>

<style lang="scss">
	.wxicon{
		font-size: 50rpx;
		color: red;
	}
	.iconcontent{
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		.item{
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 30%;
			margin-bottom: 30rpx;
		}
	}
	.iconview{
		font-size: 30px;
		
	}
</style>
