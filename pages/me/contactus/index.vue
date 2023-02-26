<template>
	<view class="container">
		<view class="qrcode">
			<image src="/static/images/wechat_qrcode.jpeg" mode="widthFix" :show-menu-by-longpress="true"></image>
			<text>{{tipTxt}}</text>
		</view>

		<uni-list style="margin-bottom: 20px;">
			<uni-list-item showArrow title="加入群聊" @tap="onClickWorkWechatGroup" />
			<uni-list-item showArrow title="官方邮箱" :rightText="email" @tap="onClickCopyEmail" />
		</uni-list>

		<uni-list style="margin-bottom: 20px;">
			<button open-type="contact">
				<uni-list-item showArrow title="联系客服" />
			</button>
			<button open-type="feedback">
				<uni-list-item showArrow title="意见反馈" />
			</button>
		</uni-list>

		<uni-popup ref="PopupDialog" type="dialog">
			<image src="/static/images/wechat_group_qrcode.jpeg" mode="widthFix" :show-menu-by-longpress="true">
			</image>
		</uni-popup>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				email: "maoxiantv@qiadao.net",
				tipTxt: "长按添加微信，免费帮你找电影",
				qrcode: "/static/images/wechat_group_qrcode.jpeg",
			};
		},
		onLoad() {
			uni.showShareMenu({
				withShareTicket: false,
				menus: ["shareAppMessage", "shareTimeline"]
			})
			this.qrcode = getApp().globalData.BASE_URL + '/images/wechat_group.jpeg'
		},
		onShareAppMessage() {

		},
		methods: {
			onClickWorkWechatGroup() {
				this.$refs.PopupDialog.open()
			},
			onClickCopyEmail() {
				uni.setClipboardData({
					data: this.email,
					success: function() {
						uni.showToast({
							title: '复制成功'
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: $background-color;

		.qrcode {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			margin-top: 20px;
			margin-bottom: 20px;

			image {
				width: 50%;
			}

			text {
				color: #777;
				margin-top: 15px;
				font-size: 14px;
			}
		}

		button {
			display: inline-block;
			width: 100%;
			margin: 0;
			padding: 0;
			background: transparent;
			border: none;
			text-align: left;
			font-size: 14px;
			color: #3b4144;
			overflow: hidden;
			line-height: 20px;
		}

		button::hover {
			border: none;
		}
	}
</style>
