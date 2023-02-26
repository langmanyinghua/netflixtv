<template>
	<view class="container">
		<view class="header">
			<uni-search-bar :placeholder="keyword" bgColor="#EEEEEE" @confirm="onClickSearch" @clear="onClickClear"
				@cancel="onClickCancel" v-model="keyword" :focus="true" />
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

			<view class="nodata" v-if="isShowEmpty">
				<fui-empty title="暂无数据"></fui-empty>
				<text @tap="onClickContactus">帮我找资源</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		searchContent
	} from '/api/common.js'
	export default {
		data() {
			return {
				keyword: null,
				isShowEmpty: false,
				page: 1,
				contentList: []
			};
		},
		onLoad() {
			uni.showShareMenu({
				withShareTicket: false,
				menus: ["shareAppMessage", "shareTimeline"]
			})

			this.keyword = getApp().globalData.hotKeyword
			if (this.keyword) {
				this.execSearchContent()
			}
		},
		onReachBottom() {
			this.page = this.page + 1
			this.execSearchContent()
		},
		onShareAppMessage() {

		},
		methods: {
			onClickClear() {
				this.isFocus = true
			},
			onClickCancel() {
				uni.navigateBack()
			},
			onClickSearch() {
				if (this.keyword == null || this.keyword == '') {
					return;
				}
				this.contentList = []
				this.execSearchContent()
			},
			onClickContactus() {
				uni.navigateTo({
					url: '/pages/me/contactus/index'
				})
			},
			execSearchContent() {
				if (this.keyword == null || this.keyword == '') {
					return;
				}
				searchContent(this.keyword, this.page).then(res => {
					this.contentList = [...this.contentList, ...res.data]
					console.log(this.contentList);
					if (this.contentList == null || this.contentList.length == 0) {
						this.isShowEmpty = true
					} else {
						this.isShowEmpty = false
					}
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
	.container {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: $background-color;

		.header {
			width: 100%;
			position: fixed;
			background-color: white;
			z-index: 1000;

			.search {
				background-color: $theme-color;
				color: white;
				padding: 3px 10px;
				border-radius: 3px;
			}
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

			.nodata {
				display: flex;
				flex-direction: column;
				align-items: center;

				text {
					margin-top: 10px;
					color: $theme-color;
					text-decoration: underline;
					font-size: 18px;
					font-weight: 500;

				}
			}
		}
	}
</style>
