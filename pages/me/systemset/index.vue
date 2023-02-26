<template>
	<view class="container">
		<uni-list>
			<uni-list-item showArrow title="清理缓存" @tap="onClickClearCache" />
		</uni-list>

		<view style="height: 1000px;">

		</view>
		<Footer></Footer>
	</view>
</template>

<script>
	import Footer from '@/components/footer/footer.vue'
	export default {
		components: {
			Footer
		},
		data() {
			return {}
		},
		onLoad() {
			uni.showShareMenu({
				withShareTicket: false,
				menus: ["shareAppMessage", "shareTimeline"]
			})
		},
		onShow() {

		},
		onHide() {

		},
		onShareAppMessage() {

		},
		methods: {
			onClickClearCache() {
				uni.showLoading({
					title: '清理中'
				});
				setTimeout(() => {
					uni.hideLoading()
					uni.showToast({
						title: "清理完成"
					})
				}, 1500)
			}
		}
	}
</script>

<style>

</style>
