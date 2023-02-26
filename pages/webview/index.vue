<template>
	<view class="container">
		<web-view :src="url" :webview-styles="webviewStyles"></web-view>b
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: null,
				webviewStyles: {
					progress: {
						color: '#8b5cf6'
					}
				}
			};
		},
		onShareAppMessage() {

		},
		onLoad(options) {
			uni.showShareMenu({
				withShareTicket: false,
				menus: ["shareAppMessage", "shareTimeline"]
			})
			this.url = options.url;
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		min-height: 100vh;
		height: 100%;
	}
</style>
