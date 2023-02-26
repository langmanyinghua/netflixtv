<template>
	<view class="container">
		<view class="video_info">
			<view class="left">
				<image :src="content?.imageUrl" mode="aspectFill" lazy-load="true"></image>
			</view>
			<view class="right">
				<view class="title">
					{{content.title}}
				</view>
				<view class="bottom">
					<view class="info">
						<text class="lable">评分: </text>
						<text class="content">{{content?.score}}</text>
					</view>
					<view class="info">
						<text class="lable">上映: </text>
						<text class="content">{{content?.pushTime}}</text>
					</view>
					<view class="info">
						<text class="lable">地区: </text>
						<text class="content">{{content?.region}}</text>
					</view>
					<view class="info">
						<text class="lable">语言: </text>
						<text class="content">{{content?.language}}</text>
					</view>
					<view class="info">
						<text class="lable">导演: </text>
						<text class="content">{{content?.director}}</text>
					</view>
					<view class="info">
						<text class="lable">演员: </text>
						<text class="content">{{content?.actor}}</text>
					</view>
					<view class="info">
						<text class="lable">更新时间: </text>
						<text class="content">{{content?.lastModifiedDate}}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="function">
			<view class="collection" @tap="onClickDianZan">
				<template v-if="isDianZan">
					<image src="/static/images/dianzan_selected.png" />
					<text>已点赞</text>
				</template>
				<template v-else>
					<image src="/static/images/dianzan_default.png" />
					<text>点赞</text>
				</template>
			</view>
			<view class="collection" @tap="onClickCollection">
				<template v-if="isCollection">
					<image src="/static/images/collection_selected.png" />
					<text>已收藏</text>
				</template>
				<template v-else>
					<image src="/static/images/collection_default.png" />
					<text>收藏</text>
				</template>
			</view>
			<view class="share">
				<button open-type="share">
					<image src="/static/images/share.png" mode="widthFix" />
					<text>分享</text>
				</button>
			</view>
		</view>

		<uni-section title="长按或点击复制链接" type="line" style="margin-bottom: 20px;" v-if="isShowVideoUrl">
			<view class="path" v-if="isShowQuark" @click="onClickCopyVideoUrl(content?.quarkVideoUrl)">
				夸克网盘: <text selectable="true" user-select="true">{{content?.quarkVideoUrl}}</text>
			</view>

			<view class="path" v-if="isShowXunLei" @click="onClickCopyVideoUrl(content?.xunLeiVideoUrl)">
				迅雷网盘: <text selectable="true" user-select="true">{{content?.xunLeiVideoUrl}}</text>
			</view>

			<view class="path" v-if="!isShowQuark && !isShowXunLei && isShowAliyun"
				@click="onClickCopyVideoUrl(content?.aliyunVideoUrl)">
				阿里云盘: <text selectable="true" user-select="true">{{content?.aliyunVideoUrl}}</text>
			</view>

			<view class="path" v-if="!isShowQuark && !isShowXunLei && isShowBaidu"
				@click="onClickCopyVideoUrl(content?.baiDuVideoUrl)">
				百度网盘: <text selectable="true" user-select="true">{{content?.baiDuVideoUrl}}</text>
			</view>

			<view class="path" v-if="!isShowQuark && !isShowXunLei && !isShowAliyun && !isShowBaidu"
				@click="onClickCopyVideoUrl(content?.defaultVideoUrl)">
				<text selectable="true" user-select="true">{{content?.defaultVideoUrl}}</text>
			</view>

		</uni-section>

		<uni-section title="获取资源地址需观看广告" type="line" style="margin-bottom: 10px;">
			<view class="item">
				<fui-button radius="30px" @click="onClickCopy">获取资源地址</fui-button>
			</view>
		</uni-section>

		<uni-section title="描述" type="line" style="margin-bottom: 10px;">
			<view style="margin: 0 10px;">
				{{content?.summary}}
			</view>
		</uni-section>

		<uni-section title="更多推荐" type="line" titleFontSize="16px" class="block" titleColor="#222">
			<view class="block_content">
				<view class="block_content_item" v-for="(item, index) in contentList" :key="index"
					@tap="onClickItem(item)">
					<image :src="item.imageUrl" mode="aspectFill" lazy-load="true" />
					<text class="title">{{item.title}}</text>
					<text class="tip_bottom">{{item.tip}}</text>
				</view>
			</view>
			<Footer></Footer>
		</uni-section>

		<Help></Help>
	</view>
</template>

<script>
	import {
		getContent,
		getChannelContent
	} from '/api/common.js'
	import Footer from '@/components/footer/footer.vue'
	import Help from '@/components/help/help.vue'
	export default {
		videoAd: null, // 激励视频广告
		interstitialAd: null, // 在页面中定义插屏广告
		data() {
			return {
				isShowQuark: false,
				isShowXunLei: false,
				isShowBaidu: false,
				isShowAliyun: false,

				content: {},
				contentList: [],
				page: 1,
				channelId: null,
				contentId: null,
				isCollection: false,
				isDianZan: false,
				isShowVideoUrl: false,
			};
		},
		components: {
			Footer,
			Help
		},
		onLoad(options) {
			this.channelId = options.channelId
			this.contentId = options.contentId

			// #ifdef MP-WEIXIN
			uni.showShareMenu({
				withShareTicket: false,
				menus: ["shareAppMessage", "shareTimeline"]
			})
			// #endif

			this.checkCollection()
			this.checkDianZan()
			this.execGetContent()

			// 获取数据
			getContent(this.contentId).then(res => {
				this.content = res.data
				console.log(this.content);

				if (this.content?.quarkVideoUrl != undefined && this.content?.quarkVideoUrl != null && this.content
					?.quarkVideoUrl != '') {
					this.isShowQuark = true
				}

				if (this.content?.xunLeiVideoUrl != undefined && this.content?.xunLeiVideoUrl !=
					null && this.content?.xunLeiVideoUrl != '') {
					this.isShowXunLei = true
				}

				if (this.content?.baiDuVideoUrl != undefined && this.content?.baiDuVideoUrl !=
					null && this.content?.baiDuVideoUrl != '') {
					this.isShowBaidu = true
				}

				if (this.content?.aliyunVideoUrl != undefined && this.content?.aliyunVideoUrl !=
					null && this.content?.aliyunVideoUrl != '') {
					this.isShowAliyun = true
				}
			})
		},
		onShow() {
			// this.loadAD()
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
			return {
				title: this.content.title + ' - 奈飞影视',
				imageUrl: this.content?.imageUrl,
				path: '/pages/content/index?channelId=' + this.channelId + "&contentId=" + this.contentId
			}
		},
		onShareTimeline() {
			return {
				title: this.content.title + ' - 奈飞影视',
				imageUrl: this.content?.imageUrl,
				path: '/pages/content/index?channelId=' + this.channelId + "&contentId=" + this.contentId
			}
		},
		methods: {
			execGetContent() {
				getChannelContent(this.channelId, this.page).then(res => {
					this.contentList = [...this.contentList, ...res.data]
				})
			},
			onClickItem(item) {
				uni.navigateTo({
					url: '/pages/content/index?channelId=' + item.channelId + "&contentId=" + item.id
				})
			},
			onClickToVIP() {
				uni.navigateTo({
					url: '/pages/me/contactus/index'
				})
			},
			onClickCopy() {
				let that = this
				if (getApp().globalData.deviceType != 'phone') {
					uni.showToast({
						title: "请用手机端打开",
						icon: 'error'
					})
					return
				}

				that.isShowVideoUrl = true

				// let latestShowTime = uni.getStorageSync("latestShowTime_" + this.contentId) || null
				// if (latestShowTime != null && new Date().getTime() < latestShowTime) {
				// 	// 显示插屏广告
				// 	if (that.interstitialAd) {
				// 		that.interstitialAd.show().catch((err) => {
				// 			console.error(err)
				// 		})
				// 	}
				// } else {
				// 	// 用户触发广告后，显示激励视频广告
				// 	if (that.videoAd) {
				// 		that.videoAd.show().catch(() => {
				// 			// 失败重试
				// 			that.videoAd.load()
				// 				.then(() => that.videoAd.show())
				// 				.catch(err => {
				// 					console.log('激励视频 广告显示失败')
				// 				})
				// 		})
				// 	}
				// }
			},

			onClickCopyVideoUrl(url) {
				uni.setClipboardData({
					data: url
				})
			},
			onClickDianZan() {
				let tath = this
				let dianZanContentList = uni.getStorageSync('dianZanContentList') || []
				if (this.isDianZan) {
					dianZanContentList.forEach((item, index) => {
						if (item.id == tath.contentId) {
							dianZanContentList.splice(index, 1);
						}
					})
					this.isDianZan = false
				} else {
					dianZanContentList.push(this.content)
					this.isDianZan = true
				}
				uni.setStorageSync('dianZanContentList', dianZanContentList);
			},
			checkDianZan() {
				let dianZanContentList = uni.getStorageSync('dianZanContentList') || null
				if (dianZanContentList === null) {
					this.isDianZan = false;
					return;
				}
				let that = this
				let content = dianZanContentList.find(i => i.id == that.contentId)
				if (content) {
					this.isDianZan = true;
				} else {
					this.isDianZan = false;
				}
			},
			onClickCollection() {
				let tath = this
				let collectionContentList = uni.getStorageSync('collectionContentList') || []
				if (this.isCollection) {
					collectionContentList.forEach((item, index) => {
						if (item.id == tath.contentId) {
							collectionContentList.splice(index, 1);
						}
					})
					this.isCollection = false
				} else {
					collectionContentList.push(this.content)
					this.isCollection = true
				}
				uni.setStorageSync('collectionContentList', collectionContentList);
			},
			checkCollection() {
				let collectionContentList = uni.getStorageSync('collectionContentList') || null
				if (collectionContentList === null) {
					this.isCollection = false;
					return;
				}
				let that = this
				let content = collectionContentList.find(i => i.id == that.contentId)
				if (content) {
					this.isCollection = true;
				} else {
					this.isCollection = false;
				}
			},
			async loadAD() {
				// #ifdef MP-WEIXIN

				if (getApp().globalData?.appConfig?.isFlowMaster != 1) {
					this.isShowVideoUrl = true
					return
				}

				// 在页面onLoad回调事件中创建插屏广告实例
				if (wx.createInterstitialAd) {
					this.interstitialAd = wx.createInterstitialAd({
						adUnitId: getApp().globalData?.appConfig?.dialogVideoAdId
					})
					this.interstitialAd.onLoad(() => {})
					this.interstitialAd.onError((err) => {})
					this.interstitialAd.onClose(() => {
						console.log('onClose');
					})
				}
				// 在页面onLoad回调事件中创建激励视频广告实例
				if (wx.createRewardedVideoAd) {
					let that = this
					this.videoAd = wx.createRewardedVideoAd({
						adUnitId: getApp().globalData?.appConfig?.jlVideoAdId
					})
					this.videoAd.onLoad(() => {})
					this.videoAd.onError((err) => {})
					this.videoAd.onClose((res) => {
						if (res.isEnded) {
							let latestShowTime = new Date().getTime() + that.content
								?.wechatMiniprogramShowVideoADInterval
							uni.setStorageSync("latestShowTime_" + this.contentId, latestShowTime)
							that.isShowVideoUrl = true
							uni.showToast({
								title: "长按全选复制链接地址"
							})
						}
					})
				}
				// #endif
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		mmin-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: white;
		height: initial;
		overflow-y: initial;

		.video_info {
			height: 200px;
			display: flex;
			flex-direction: row;
			padding: 12px 10px;
			margin-bottom: 10px;

			.left {
				width: 40%;
				height: 100%;
				margin-right: 10px;

				image {
					width: 100%;
					height: 100%;
					border-radius: 3px;
				}
			}

			.right {
				width: 60%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.title {
					min-height: 55px;
					font-weight: 500;
					font-size: 22px;
					margin-bottom: 10px;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden; //溢出内容隐藏
					text-overflow: ellipsis; //文本溢出部分用省略号表示
					display: -webkit-box; //特别显示模式
					-webkit-line-clamp: 2; //行数
					line-clamp: 2;
					-webkit-box-orient: vertical; //盒子中内容竖直排列
				}

				.bottom {
					.info {
						width: 100%;
						display: flex;
						align-items: center;

						.lable {
							min-width: 60px;
							font-size: 14px;
							color: #777;
							margin-right: 10px;
						}

						.content {
							font-weight: 500;
							font-size: 16px;
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

		.item {
			padding: 8px 10px;
			overflow-x: hidden;

			.open_browser {
				background: white;
				color: $theme-color;
				border-radius: 30px;
				border: 1px solid $theme-color;
			}

			.open_browser::after {
				border: none;
			}
		}

		.path {
			padding: 8px 10px;
			overflow-x: hidden;
			word-break: break-all;
			font-size: 16px;
			font-weight: 500;

			text {
				color: red;
				font-size: 20px;
			}
		}

		.function {
			display: flex;

			.collection {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.share {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;

				button {
					border: none;
					padding: 0;
					margin: 0;
					background: transparent !important;
					display: flex;
					align-items: center;
				}

				button::after {
					border: none;
				}
			}

			image {
				width: 20px;
				height: 20px;
				margin-right: 10px;
			}

			text {
				font-size: 14px;
			}

		}

		.vip {
			color: red;
		}

		.block {
			width: 100%;
			margin-bottom: 10px;

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
