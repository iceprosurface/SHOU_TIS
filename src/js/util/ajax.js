import {
	status
} from "../util/fetchUtil.js"
var init = function() {
    return {
        method: 'GET',
        mode: 'cors',
        cache: 'default',
        credentials: 'include'
    };
};
const fetchList = {
	// 正常登陆的fetch
	login: {
		url: `/login/check`,
		option: {
			method:'POST'
		}
	},
	// token 登陆的fetch，这里token存储在cookie中不需要传输任何信息
	// 同时也是get类型即可
	tokenLogin: {
		url: `/login/token`
	},
};

// 传输数据前需要对option添加option.body
function fetchData(name,option){
	return fetch(fetchList[name].url,Object.assign(init(),fetchList[name].option,option)).then(status);
}

export {
	fetchData
}
