<template>
	<view class="container">
		<view class="top_bg">
			<image src="/static/images/me_top_bg.png" mode="widthFix"></image>
		</view>

		<uni-list style="margin-bottom: 10px;">
			<uni-list-item showArrow title="我的收藏" @tap="onClickCollection"
				thumb="/static/images/collection_default.png" />
			<uni-list-item showArrow title="联系我们" @tap="onClickContatUs" thumb="/static/images/contactus.png" />
			<uni-list-item showArrow title="系统设置" @tap="onClickSystemSet" thumb="/static/images/systemset.png" />
		</uni-list>
	</view>
</template>

<script>
	import Footer from '@/components/footer/footer.vue'
	export default {
		components: {
			Footer
		},
		data() {
			return {
				user: null,
				isNeedLogin: true,
				platform: null,
			}
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			uni.showShareMenu({
				withShareTicket: false,
				menus: ["shareAppMessage", "shareTimeline"]
			})
			// #endif
			this.platform = getApp().globalData.platform
		},
		onShareAppMessage() {

		},
		methods: {
			onClickSystemSet() {
				uni.navigateTo({
					url: "/pages/me/systemset/index"
				})
			},
			onClickContatUs() {
				uni.navigateTo({
					url: "/pages/me/contactus/index"
				})
			},
			onClickCollection() {
				uni.navigateTo({
					url: "/pages/me/collection/index"
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: $background-color;

		.top_bg {
			width: 100%;

			image {
				width: 100%;
				height: 100%;
			}

		}

		.uni-list {
			border-radius: 10px;

			.uni-list-item {
				height: 65px;
			}
		}

		.bottom {
			width: 100%;
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
		}

	}
</style>
