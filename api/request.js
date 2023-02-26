/**
 * uniapp 网络请求 
 * @param {*} params
 */
export const request = (params) => {
	let baseUrl = getApp().globalData.BASE_URL
	let header = {
		...params.header
	}
	header['content-type'] = 'application/json';
	header['apiKey'] = getApp().globalData.apiKey;
	header['platform'] = getApp().globalData.platform;
	header['token'] = getApp().globalData.token;

	let timeout = params?.timeout
	if (timeout == null) {
		timeout = 60000
	}

	return new Promise((reslove, reject) => {
		uni.request({
			...params,
			url: baseUrl + params.url,
			header,
			timeout,
			success: (res) => {
				reslove(res.data)
			},
			fail: (err) => {
				console.log(err);
				reject(err)
			}
		})
	})
}
