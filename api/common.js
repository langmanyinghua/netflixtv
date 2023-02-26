import {
	request
} from "./request.js";

/**
 *  获取最近上线
 */
export const getIndex = () => {
	return new Promise((resolve, reject) => {
		request({
			url: "/admin/miniprogram/tv/index"
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}


/**
 *  获取顶部导航
 */
export const getTopNav = () => {
	return new Promise((resolve, reject) => {
		request({
			url: "/admin/miniprogram/tv/getChannel"
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

/**
 *  获取内容 
 */
export const getChannelContent = (channelId, page, perPage = 20) => {
	let url = "/admin/miniprogram/tv/getChannelContent?page=" + page + "&size=" + perPage
	if (channelId) {
		url = "/admin/miniprogram/tv/getChannelContent?channelId=" + channelId + "&page=" +
			page + "&size=" + perPage
	}
	return new Promise((resolve, reject) => {
		request({
			url
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

/**
 *  获取单条内容
 */
export const getContent = (contentId) => {
	return new Promise((resolve, reject) => {
		request({
			url: "/admin/miniprogram/tv/content?contentId=" + contentId
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}


/**
 *  查询内容
 */
export const searchContent = (keyword, page, size = 20) => {
	return new Promise((resolve, reject) => {
		request({
			url: "/admin/miniprogram/tv/search?keyword=" + keyword + "&page=" + page + "&size=" +
				size
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
