<template>
	<view class="container">
		<view class="header">
			<uni-search-bar :placeholder="hotKeyword" bgColor="#eeeeee" :readonly="true" @tap="onClickSearch" />
		</view>
		<view class="banner">
			<swiper circular :indicator-dots="true" :autoplay="true" :interval="2000" :duration="500">
				<swiper-item v-for="(item, index) in banners" :key="index" @tap="onClickBanner(index)">
					<image :src="item.bannerUrl" mode="widthFix" lazy-load="true" />
				</swiper-item>
			</swiper>
		</view>

		<uni-section title="最近上线" type="line" titleFontSize="16px" class="block" titleColor="#222">
			<template v-slot:right>
				<view class="all" @tap="onClickNew">
					查看全部
				</view>
			</template>
			<view class="block_content">
				<view class="block_content_item" v-for="(item, index) in latestList" :key="index"
					@tap="onClickItem(item)">
					<image :src="item.imageUrl" mode="aspectFill" lazy-load="true" />
					<text class="title">{{item.title}}</text>
					<text class="tip_top">NEW</text>
				</view>
			</view>
		</uni-section>

		<uni-section title="热播专区" type="line" titleFontSize="16px" class="block" titleColor="#222">
			<template v-slot:right>
				<view class="all" @tap="onClickCategory(-1)">
					查看全部
				</view>
			</template>
			<view class="block_content">
				<view class="block_content_item" v-for="(item, index) in highHitsList" :key="index"
					@tap="onClickItem(item)">
					<image :src="item.imageUrl" mode="aspectFill" lazy-load="true" />
					<text class="title">{{item.title}}</text>
					<text class="tip_top">HOT</text>
				</view>
			</view>
		</uni-section>

		<view v-for="(item, index) in topNavList" :key="index">
			<uni-section :title="item.channelName" type="line" titleFontSize="16px" class="block" titleColor="#222">
				<template v-slot:right>
					<view class="all" @tap="onClickCategory(index)">
						查看全部
					</view>
				</template>
				<view class="block_content">
					<view class="block_content_item" v-for="(block, bIndex) in item.blocks" :key="bIndex"
						@tap="onClickItem(block)">
						<image :src="block.imageUrl" mode="aspectFill" lazy-load="true" />
						<text class="title">{{block.title}}</text>
						<text class="tip_bottom">{{block.tip}}</text>
					</view>
				</view>
			</uni-section>
		</view>
		<Help></Help>
		<Footer></Footer>

		<uni-popup ref="PopupDialog" type="dialog">
			<image :src="bannerPopupQRCode" mode="widthFix" :show-menu-by-longpress="true">
			</image>
		</uni-popup>

	</view>
</template>

<script>
	import {
		getIndex,
		getTopNav,
		getChannelContent
	} from '/api/common.js'
	import Footer from '@/components/footer/footer.vue'
	import Help from '@/components/help/help.vue'
	export default {
		data() {
			return {
				hotKeyword: '搜索',
				banners: [],
				blockList: [],
				latestList: [],
				highHitsList: [],
				topNavList: [],
				bannerPopupQRCode: '/static/images/wechat_qrcod.jpeg',
			}
		},
		components: {
			Footer,
			Help
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			uni.showShareMenu({
				withShareTicket: false,
				menus: ["shareAppMessage", "shareTimeline"]
			})
			// #endif

			this.banners.push({
				bannerUrl: '/static/images/banner_find.png'
			})

			getIndex().then(res => {
				this.latestList = res.data.latestList
				this.highHitsList = res.data.highHitsList
			})

			getTopNav().then(res => {
				this.topNavList = res.data
				getApp().globalData.topNavList = this.topNavList
				for (let i of this.topNavList) {
					getChannelContent(i.id, 1, 6).then(res => {
						i.blocks = res.data;
					})
				}
			})

			this.loadInterstitialAd()
		},
		onPullDownRefresh() {
			getIndex().then(res => {
				this.latestList = res.data.latestList
				this.highHitsList = res.data.highHitsList
			})
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		onReachBottom() {
			if (this.topNavList === null || this.topNavList.length === 0) {
				getTopNav().then(res => {
					this.topNavList = res.data
					getApp().globalData.topNavList = this.topNavList
					for (let i of this.topNavList) {
						getChannelContent(i.id, 1, 6).then(res => {
							i.blocks = res.data;
						})
					}
				})
			}
		},
		onShareAppMessage() {

		},
		onShareTimeline() {
			return {
				title: '首页 - 奈飞影视',
				path: '/pages/index/index'
			}
		},
		methods: {
			onClickSearch(item) {
				uni.navigateTo({
					url: "/pages/search/index"
				})
			},
			onClickBanner(index) {
				if (index == 0) {
					this.bannerPopupQRCode = '/static/images/wechat_qrcode.jpeg'
					// this.bannerPopupQRCode = getApp().globalData.BASE_URL + '/images/wechat_group.jpeg'
				} else if (index == 1) {
					this.bannerPopupQRCode = '/static/images/wechat_office.jpeg'
				}
				this.$refs.PopupDialog.open()
			},
			onClickCollectAll() {
				uni.switchTab({
					url: "/pages/collect/index"
				})
			},
			onClickSubject(index) {
				if (index == 0) {
					// 奈飞热播
					getApp().globalData.fromIndex = true
					getApp().globalData.categoryTabCurrent = 1
				} else if (index == 1) {
					// 韩剧专区
					getApp().globalData.fromIndex = true
					getApp().globalData.categoryTabCurrent = 2
				} else if (index == 2) {
					// 动漫专区
					getApp().globalData.fromIndex = true
					getApp().globalData.categoryTabCurrent = 6
				} else if (index == 3) {
					// 纪录片
					getApp().globalData.fromIndex = true
					getApp().globalData.categoryTabCurrent = 7
				}
				uni.switchTab({
					url: "/pages/category/index"
				})
			},
			onClickItem(item) {
				uni.navigateTo({
					url: '/pages/content/index?channelId=' + item.channelId + "&contentId=" + item.id
				})
			},
			onClickNew() {
				uni.switchTab({
					url: "/pages/new/index"
				})
			},
			onClickCategory(index) {
				getApp().globalData.fromIndex = true
				getApp().globalData.categoryTabCurrent = index + 1
				uni.switchTab({
					url: "/pages/category/index"
				})
			},
			onClickContact() {
				uni.navigateTo({
					url: '/pages/me/contactus/index'
				})
			},
			loadInterstitialAd() {
				if (getApp().globalData.platform == 'mp-weixin' && getApp().globalData?.appConfig?.isFlowMaster === 1) {
					console.log('广告。。。。');
					// 在页面中定义插屏广告
					let interstitialAd = null
					let adUnitId = getApp().globalData?.appConfig?.dialogVideoAdId
					// 在页面onLoad回调事件中创建插屏广告实例
					if (wx.createInterstitialAd) {
						interstitialAd = wx.createInterstitialAd({
							adUnitId
						})
						interstitialAd.onLoad(() => {})
						interstitialAd.onError((err) => {})
						interstitialAd.onClose(() => {})
					}

					// 在适合的场景显示插屏广告
					if (interstitialAd) {
						interstitialAd.show().catch((err) => {
							console.error(err)
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		mmin-height: 100vh;
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: white;
		height: initial;
		overflow-y: initial;
		overflow-x: hidden;

		.banner {
			height: 80px;
			margin: 10px 10px 10px 10px;
			border-radius: 10px;

			swiper {
				width: 100%;
				height: 100%;

				image {
					width: 100%;
					height: 100%;
					border-radius: 10px;
				}

			}
		}

		.subject {
			height: 100px;
			display: flex;
			flex-direction: row;
			margin-bottom: 10px;

			.item {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				image {
					width: 60px;
					height: 60px;
					margin-bottom: 5px;
				}

				text {
					font-size: 14px;

				}
			}

		}

		.collect {
			width: 100%;
			white-space: nowrap;
			margin-bottom: 10px;

			.item {
				width: 80px;
				margin: 10px;
				display: inline-block;
				text-align: center;

				image {
					width: 60px;
					height: 60px;
					object-fit: fill;
					border-radius: 50%;
				}

				.title {
					font-size: 16px;
					font-weight: 500;
					margin-bottom: 5px;
				}

			}

		}

		.block {
			width: 100%;
			margin-bottom: 10px;

			.decoration {
				width: 6px;
				height: 6px;
				margin-right: 4px;
				border-radius: 50%;
				background-color: $theme-color;
			}

			.all {
				color: $theme-color;
			}

			.block_content {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-around;

				.block_content_item {
					width: 32%;
					height: $video-cover-height;
					display: flex;
					flex-direction: column;
					margin: 10px 0;
					border-radius: 3px;
					position: relative;

					image {
						width: 100%;
						height: 100%;
						margin-bottom: 10px;
						border-radius: 3px;
					}

					.title {
						width: 100% !important;
						font-weight: 500;
						overflow: hidden;
						word-break: break-all;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						white-space: nowrap;
					}

					.tip_top {
						padding: 2px 5px;
						background-color: #f43f5e;
						position: absolute;
						z-index: 99;
						text-align: center;
						border-radius: 2px;
						font-weight: 500;
						font-size: 10px;
						color: white;
						right: 5px;
						top: 0;
					}

					.tip_bottom {
						position: absolute;
						z-index: 99;
						font-weight: 500;
						font-size: 10px;
						color: white;
						right: 5px;
						bottom: 35px;
					}
				}

				/* 如果最后一行是1个元素 */
				.block_content_item:last-child:nth-child(3n - 2) {
					margin-right: calc(64% + 4% / 3);
				}

				/* 如果最后一行是2个元素 */
				.block_content_item:last-child:nth-child(3n - 1) {
					margin-right: calc(32% + 4% / 3);
				}
			}
		}



	}
</style>
