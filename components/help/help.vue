<template>
	<view class="help">
		<image class="icon" src="/static/images/help.png" @tap="onClickContactUs"></image>

		<view class="qr_code">
			<uni-popup ref="PopupDialog" type="dialog">
				<image :src="bannerPopupQRCode" mode="widthFix" :show-menu-by-longpress="true">
				</image>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		name: "help",
		data() {
			return {
				isShow: false,
				bannerPopupQRCode: ''
			};
		},
		onLoad() {
			this.bannerPopupQRCode = '/static/images/wechat_qrcode.jpeg'
			// this.bannerPopupQRCode = getApp().globalData.BASE_URL + '/images/wechat_group.jpeg'
		},
		methods: {
			onClickContactUs() {
				this.$refs.PopupDialog.open()
				// uni.navigateTo({
				// 	url: '/pages/me/contactus/index'
				// })
			}
		}
	}
</script>

<style lang="scss">
	.help {
		position: absolute;

		.icon {
			width: 80px;
			height: 80px;
			position: fixed;
			bottom: 20px;
			right: 5px;
			z-index: 10;
		}

		.qr_code {
			position: fixed;
			z-index: 100;
		}

	}
</style>
