<template>
	<view class="fotter">
		<view class="one" @tap="onClickContactUs">
			<text decode="true">联系我们&nbsp;&nbsp;&nbsp;</text>|
			<text decode="true">&nbsp;&nbsp;&nbsp;投诉建议</text>
		</view>
		<view class="two">《奈飞影视》，只有最新的影视剧</view>
		<view class="two">内容来源于网络，如有侵权，请联系我们</view>
		<view style="height: 20rpx;"></view>
	</view>
</template>

<script>
	export default {
		name: "footer",
		data() {
			return {

			};
		},
		methods: {
			onClickContactUs() {
				uni.navigateTo({
					url: '/pages/me/contactus/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	.fotter {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 20rpx 0;

		.one {
			margin-bottom: 10rpx;
			font-size: 24rpx;
		}

		.two {
			color: $uni-text-color-grey;
			font-size: 20rpx;
		}
	}
</style>
