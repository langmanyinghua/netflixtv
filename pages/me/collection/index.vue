<template>
	<view class="container">
		<view class="content">
			<view class="content_item" v-for="(item, index) in contentList" :key="index" @tap="onClickItem(item)"
				@longpress="onClickLongPress(index)">
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
							<text class="content">{{item?.extendvalues?.score}}</text>
						</view>
						<view class="info">
							<text class="lable">上映: </text>
							<text class="content">{{item?.extendvalues?.pushTime}}</text>
						</view>
						<view class="info">
							<text class="lable">地区: </text>
							<text class="content">{{item?.extendvalues?.region}}</text>
						</view>
						<view class="info">
							<text class="lable">语言: </text>
							<text class="content">{{item?.extendvalues?.language}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				contentList: []
			};
		},
		onLoad() {
			uni.showShareMenu({
				withShareTicket: false,
				menus: ["shareAppMessage", "shareTimeline"]
			})
			this.contentList = uni.getStorageSync('collectionContentList') || []
		},
		onShareAppMessage() {

		},
		methods: {
			onClickItem(item) {
				uni.navigateTo({
					url: '/pages/content/index?channelId=' + item.channelid + "&contentId=" + item.id
				})
			},
			onClickLongPress(index) {
				const that = this
				uni.showModal({
					title: '删除收藏',
					content: '确定要删除吗?',
					success: function(res) {
						if (res.confirm) {
							that.contentList.splice(index, 1);
							uni.setStorageSync('collectionContentList', that.contentList)
						} else if (res.cancel) {

						}
					}
				});
			},

		}
	}
</script>

<style lang="scss">
	.container {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: $background-color;

		.content {
			width: 100%;

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
