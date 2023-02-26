<template>
	<view class="container">
		<view class="header">
			<uni-search-bar :placeholder="hotKeyword" bgColor="#eeeeee" :readonly="true" @tap="onClickSearch" />
		</view>

		<view class="content">
			<view class="content_item" v-for="(item, index) in contentList" :key="index" @tap="onClickItem(item)">
				<view class="left">
					<image :src="item.imageUrl" mode="widthFix" lazy-load="true"></image>
				</view>
				<view class="right">
					<view class="title">
						{{item?.title}}
					</view>
					<view class="bottom">
						<view class="info">
							<text class="lable">评分: </text>
							<text class="content">{{item.score}}</text>
						</view>
						<view class="info">
							<text class="lable">上映: </text>
							<text class="content">{{item.pushTime}}</text>
						</view>
						<view class="info">
							<text class="lable">地区: </text>
							<text class="content">{{item.region}}</text>
						</view>
						<view class="info">
							<text class="lable">语言: </text>
							<text class="content">{{item.language}}</text>
						</view>
					</view>
				</view>
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
				hotKeyword: '搜索',
				contentList: [],
				current: 0,
				page: 1,
				appConfig: null
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

			this.contentList = []
			this.execGetContent()
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
				getChannelContent(null, this.page).then(res => {
					this.contentList = [...this.contentList, ...res.data]
				})
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
			position: fixed;
			background-color: white;
			z-index: 1000;
		}

		.content {
			width: 100%;
			margin-top: 60px;

			.content_item {
				height: 150px;
				display: flex;
				flex-direction: row;
				margin: 8px 10px;
				background-color: white;
				overflow-y: hidden;
				border-radius: 3px;
				padding: 2px 0;


				.left {
					width: 30%;
					height: 100%;
					border-radius: 3px;

					image {
						width: 100%;
						height: 100%;
						border-radius: 3px;
					}

				}

				.right {
					width: 70%;
					margin-left: 10px;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.title {
						width: 100% !important;
						min-height: 45px;
						font-weight: 500;
						display: -webkit-box;
						overflow: hidden;
						text-overflow: ellipsis;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}

					.bottom {

						.info {
							font-size: 13px;

							.lable {
								font-size: 14px;
								margin-right: 10px;
							}

							.content {
								font-weight: 500;
								width: 150px;
								overflow: hidden;
								-webkit-line-clamp: 1;
								text-overflow: ellipsis;
								-webkit-box-orient: vertical;
								white-space: nowrap;
								-o-text-overflow: ellipsis;
							}
						}

					}
				}

			}
		}
	}
</style>
