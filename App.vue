<script>
	export default {
		onLaunch: function() {
			this.globalData.deviceType = uni.getSystemInfoSync().deviceType
			this.globalData.platform = uni.getSystemInfoSync().uniPlatform
			if (this.globalData.platform === 'mp-toutiao') {
				// 获取不到
			} else {
				this.globalData.appId = uni.getAccountInfoSync().miniProgram.appId
			}
			this.checkUpdate()
		},
		onShow: function() {},
		onHide: function() {},
		globalData: {
			platform: null,
			deviceType: null,
			BASE_URL: 'https://www.liuyifeicn.com',
			apiKey: '93d9619fb2c74270ba3f33f8ff8b1e29', // 加V maoxiantv （备注：API接入）获取 apiKey
			topNavList: [],
			categoryTabCurrent: 0,
			fromIndex: false,
			user: null,
			token: null,
		},
		methods: {
			checkUpdate() {
				if (uni.canIUse('getUpdateManager')) {
					const updateManager = uni.getUpdateManager()
					updateManager.onCheckForUpdate(function(res) {
						if (res.hasUpdate) {
							updateManager.onUpdateReady(function() {
								uni.showModal({
									title: '更新提示',
									content: '新版本已经准备好，是否重启应用？',
									success: function(res) {
										if (res.confirm) {
											updateManager.applyUpdate()
										}
									}
								})
							})
							updateManager.onUpdateFailed(function() {
								uni.showModal({
									title: '已经有新版本了哟~',
									content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
								})
							})
						}
					})
				} else {
					uni.showModal({
						title: '提示',
						content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
					})
				}
			}
		}

	}
</script>

<style lang='scss'>
	/*每个页面公共css */
	@import 'static/styles/fui-theme.css';
</style>
