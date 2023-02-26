<template>
	<view class="container">
		<view class="header">
			<uni-search-bar :placeholder="hotKeyword" bgColor="#eeeeee" :readonly="true" @tap="onClickSearch" />
			<fui-tabs :current="current" :tabs="tabs" @change="onClickTabs" scroll="true"></fui-tabs>
		</view>

		<view class="ad">

		</view>

		<view class="content">
			<view class="block_content_item" v-for="(item, index) in contentList" :key="index" @tap="onClickItem(item)">
				<image :src="item.imageUrl" mode="aspectFill" lazy-load="true" />
				<text class="title">{{item.title}}</text>
				<text class="tip_bottom">{{item.tip}}</text>
			</view>
		</view>
		<Help></Help>
		<Footer></Footer>
	</view>
</template>

<script>
	import {
		getChannelContent,
		getTopNav
	} from '/api/common.js'
	import Footer from '@/components/footer/footer.vue'
	import Help from '@/components/help/help.vue'
	export default {
		data() {
			return {
				tabs: [],
				hotKeyword: '搜索',
				topNavList: [],
				contentList: [],
				current: 0,
				page: 1,
			}
		},
		components: {
			Help,
			Footer
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			uni.showShareMenu({
				withShareTicket: false,
				menus: ["shareAppMessage", "shareTimeline"]
			})
			// #endif

			this.topNavList = getApp().globalData.topNavList
			this.contentList = []
			if (this.topNavList === null || this.topNavList.length === 0) {
				getTopNav().then(res => {
					this.topNavList = res.data
					let topNav = [...['全部', ...this.topNavList.map(i => i.channelName)]];
					this.tabs = topNav;
					this.execGetContent()
				})
			} else {
				let topNav = [...['全部', ...this.topNavList.map(i => i.channelName)]];
				this.tabs = topNav;
				this.execGetContent()
			}
		},
		onShow() {
			if (getApp().globalData.fromIndex) {
				this.current = getApp().globalData.categoryTabCurrent
				getApp().globalData.fromIndex = false
			}
		},
		onPullDownRefresh() {
			this.page = 1
			this.contentList = []
			this.execGetContent()
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		onReachBottom() {
			this.page = this.page + 1
			this.execGetContent()
		},
		onShareAppMessage() {

		},
		methods: {
			onClickSearch(item) {
				uni.navigateTo({
					url: "/pages/search/index"
				})
			},
			execGetContent() {
				let channelId = null
				if (this.current > 0) {
					channelId = this.topNavList[this.current - 1].id
				}
				getChannelContent(channelId, this.page).then(res => {
					this.contentList = [...this.contentList, ...res.data]
				})
			},
			onClickTabs(options) {
				this.current = options.index
				this.page = 1
				this.contentList = []
				this.execGetContent()
			},
			onClickItem(item) {
				uni.navigateTo({
					url: '/pages/content/index?channelId=' + item.channelId + "&contentId=" + item.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: initial;
		overflow-y: initial;
		min-height: 100vh;
	}

	.container {
		width: 100%;
		height: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: $background-color;

		.header {
			width: 100%;
			height: 120px;
			position: fixed;
			background-color: white;
			z-index: 1000;
		}

		.ad {
			margin-top: 120px;
		}

		.content {
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
					font-size: 14px;
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
					z-index: 10;
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
					z-index: 10;
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
</style>
