<template>
	<view class="container">
		<view class="header">
			<uni-search-bar :placeholder="hotKeyword" bgColor="#eeeeee" :readonly="true" @tap="onClickSearch" />
		</view>

		<view class="ad">

		</view>

		<view class="block_content">
			<view class="block_content_item" v-for="(item, index) in contentList" :key="index" @tap="onClickItem(item)">
				<image :src="item?.imageUrl" mode="aspectFill" />
				<text class="title">{{item?.title}}</text>
			</view>
		</view>
		<Help></Help>
		<Footer></Footer>
	</view>
</template>

<script>
	import {
		getChannelContent
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
				let channelId = 111
				getChannelContent(channelId, this.page, 100).then(res => {
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
			z-index: 10;
		}

		.ad {
			margin-top: 60px;
		}

		.block_content {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			margin: 0 5px;

			.block_content_item {
				width: 49%;
				display: flex;
				flex-direction: column;
				margin: 3px 0;
				border-radius: 3px;
				position: relative;
				align-items: center;
				justify-content: center;

				image {
					width: 100%;
					height: 100px;
					margin-bottom: 3px;
					object-fit: fill;
					border-radius: 5px;
				}

				.title {
					white-space: nowrap;
					text-overflow: ellipsis;
					-o-text-overflow: ellipsis;
					overflow: hidden;
					font-size: 14px;
					font-weight: 500;
					margin-bottom: 5px;
				}

			}

			// /* 如果最后一行是1个元素 */
			// .block_content_item:last-child:nth-child(4n - 3) {
			// 	margin-right: calc(72% + 4% / 3);
			// }

			// /* 如果最后一行是2个元素 */
			// .block_content_item:last-child:nth-child(4n - 2) {
			// 	margin-right: calc(48% + 4% / 3);
			// }

			// /* 如果最后一行是3个元素 */
			// .block_content_item:last-child:nth-child(4n - 1) {
			// 	margin-right: calc(24% + 4% / 3);
			// }
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
