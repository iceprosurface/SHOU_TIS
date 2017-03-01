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

// how to use
// import { fetchData } from '../util/ajax.js'
// fetch(name,option).then();

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
    // usrcreater
    regist: {
        url: urlTemplate `/usr/create`,
        option: {
            method: 'POST'
        }
    },
    // 正常登陆的fetch
    login: {
        url: urlTemplate `/login/check`,
        option: {
            method: 'POST'
        }
    },
    // token 登陆的fetch，这里token存储在cookie中不需要传输任何信息
    // 同时也是get类型即可
    tokenLogin: {
        url: urlTemplate `/login/token`
    },
    // 创建一个fetch
    projectCreate: {
        url: urlTemplate `/project/create`,
        option: {
            method: 'POST'
        }
    },
	// 用来显示project列表的
	projectList: {
		url: urlTemplate `/projects/list/page/${0}`
	},
	// 用来获取单个project全部信息的pid主导
	projectSingle: {
		url: urlTemplate `/project/${0}`
	},
	// 对单个project部分基本信息修改，可以修改内容包括name，information
    projectEdit: {
        url: urlTemplate `/project/${0}/edit`,
        option: {
            method: 'PUT'
        }
    },
    // project 的项目提交
    projectCheck: {
        url: urlTemplate `/project/${0}/check/${1}`,
        option: {
            method: 'PUT'
        }
    },
	// 对项目的某一个staff作出修改
//	projectEditStaff: {
//		url: urlTemplate `/project/${0}/staff/`,
//		option: {
//			method: 'PUT'
//		}
//	},
	// 创建一个staff 
    staffCreate: {
        url: urlTemplate `/project/${0}/staff/create`,
        option: {
            method: 'post'
        }
    },
	// 对某一个staff作出修改
    staffEdit: {
        url: urlTemplate `/project/${0}/staff/${1}/edit`,
        option: {
            method: 'PUT'
        }
    },
	// 查询一个progressList
	progressList: {
		url: urlTemplate `/project/${0}/progress/list/page/${1}`,

	},
	// 创建一个progress
	progressCreate: {
		url: urlTemplate `/progress/project/${0}`,
		option: {
			method : 'POST'
		}
	},
	// usr 页面的功能
	myInfo: {
		url: urlTemplate `/usr/info`
	},
	userAgeEdit: {
		url: urlTemplate `/usr/info/Age/edit`,
		option: {
			method: 'POST'
		}
	},
    usrCheckerPut: {
        url: urlTemplate `/usr/checkers`,
        option: {
			method: 'PUT'
		}
    },
	// admin 页面的登录功能
	adminLogin: {
		url: urlTemplate `/admin/login`,
		option: {
			method: 'POST'
		}
	},
	// admin 页面的check
	adminTokenCheck: {
		url: urlTemplate `/admin/token/check`
	},
	adminGetProjectByPid: {
		url: urlTemplate `/admin/project/${0}`
	},
	adminGetProjectStatusByPid: {
		url: urlTemplate `/admin/project/${0}/status`
	},
	adminCheckUsr: {
        url: urlTemplate `/admin/usr/check`,
        method: 'POST'
    },
    adminGetUncheckUsr: {
        url: urlTemplate `/admin/usr/uncheck`,
    },
	adminEditProject: {
		url: urlTemplate `/admin/project/${0}/edit`,
		option: {
			method: 'POST'
		}
	},
    noticeList: {
        url: urlTemplate `/notices/list/page/${0}`
    },

    //以下是针对审查者页面是全部ajax请求列表
    // 由于存在permission所以只需要用正常登陆的login即可
    checkerTokenLogin: {
        url: urlTemplate `/login/check/token`
    },
    checkerLogin: {
        url: urlTemplate `/login/checker/check`,
        option: {
            method: 'POST'
        }
    },
    checkUList: {
        url: urlTemplate `/check/user/page/${0}`
    },
    checkPList: {
        url: urlTemplate `/check/project/page/${0}/type/${1}`
    },
    checkerUsr: {
        url: urlTemplate `/check/user/${0}/${1}`,
        option: {
            method: 'POST'
        }
    },
    checkerProject: {
        url: urlTemplate `/check/project/${0}`,
        option: {
            method: 'PUT'
        }
    },
    checkerProjectSingle: {
        url: urlTemplate `/check/project/${0}`
    },  
};

// 传输数据前需要对option添加option.body
// 需要在url中加入内容的，需要使用option.data添加
function fetchData(name, option) {
    let url, data;
    option = Object.assign(init(), fetchList[name].option, option);
    // 对get型的数据做出一些必要的处理,尚未启用
    if (option.method.toLowerCase() == 'get') {}
    // 为edit增加内容
    url = fetchList[name].url.apply(fetchList[name].url, option.data);
    if (option.data) {
        delete option.data;
    }
    // 如果存在option强制要求修改url的在这里做出处理
    if (option.method.url) {
        url = option.method.url;
        delete option.method.url;
    }
    return fetch(url, option).then(status);
}

export {
    fetchData
}
