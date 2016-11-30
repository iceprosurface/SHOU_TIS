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
function urlTemplate(strings, ...keys) {
  return (function(...values) {
    var dict = values[values.length - 1] || {};
    var result = [strings[0]];
    keys.forEach(function(key, i) {
      var value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  });
}
// get 获取
// post 创建
// put 更新
// delete 删除
const fetchList = {
	// 正常登陆的fetch
	login: {
		url: urlTemplate`/login/check`,
		option: {
			method:'POST'
		}
	},
	// token 登陆的fetch，这里token存储在cookie中不需要传输任何信息
	// 同时也是get类型即可
	tokenLogin: {
		url: urlTemplate`/login/token`
	},
	// 创建一个fetch
	projectCreate: {
		url:  urlTemplate`/project`,
		option: {
			method:'POST'
		}
	},
	projectEdit: {
		url: urlTemplate`/project/${0}_id/edit`,
		option: {
			method: 'PUT'
		}
	}
};

// 传输数据前需要对option添加option.body
function fetchData(name,option){
	let url ,data;
	option = Object.assign(init(),fetchList[name].option,option);
	// 对get型的数据做出一些必要的处理,尚未启用
	if(option.method.toLowerCase() == 'get'){}
	// 为edit增加内容
	url = fetchList[name].url.apply(fetchList[name].url,option.data); 
	if(option.data){
		delete option.data;
	}
	// 如果存在option强制要求修改url的在这里做出处理
	if(option.method.url){
		url = option.method.url;
		delete option.method.url;
	}
	return fetch(url,option).then(status);
}

export {
	fetchData
}