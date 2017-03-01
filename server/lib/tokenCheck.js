// token 使用
const jwt = require('jsonwebtoken');
const conf = require(global.APP_PATH + '/conf.js');

const TOKEN_STATUS = {
    OK: 1,
    FAIL: 2,
    ERROR: 3
};

const checkAdminToken = function(req , res) {
	try {
		// 先判断cookie是否存在
		if (!(req.cookies && req.cookies.admin)) return false;
		// 先decoded解码在使用
		let decoded = jwt.verify(req.cookies.admin, conf.adminSecret);
		// 自动解析token中的usrname并对比session中的admin
		if (req.session.admin && decoded.usrname == req.session.admin.usrname) {
			// 重新生成cookie以刷新时间
			let token = jwt.sign({
				usrname: decoded.usrname
			}, conf.adminSecret);
			// 保存到cookie  
			res.cookie('admin', token, {
				maxAge: 3600 * 1000
			});
			return TOKEN_STATUS.OK;
		} else {
			return TOKEN_STATUS.FAIL;
		}
	} catch (err) {
		// 输出错误
		return TOKEN_STATUS.ERROR;
	}	
}

// 检验用户token的函数
const checkUsrToken = function(req, res) {
    try {
        // 先判断cookie是否存在
        if (!(req.cookies && req.cookies.logined)) return false;
        // 先decoded解码在使用
        let decoded = jwt.verify(req.cookies.logined, conf.tokenSecret);
        // 自动解析token中的usrname并对比session中的logined
        if (req.session.logined && decoded.usrname == req.session.logined.usrname) {
            // 重新生成cookie以刷新时间
            let token = jwt.sign({
                usrname: decoded.usrname
            }, conf.tokenSecret);
            // 保存到cookie  
            res.cookie('logined', token, {
                maxAge: 3600 * 1000
            });
            // 储存session
            //req.session.logined = {
            //    usrname: decoded.usrname
            //};
            // 成功
            //console.log('one user have been successfully logined');
            return TOKEN_STATUS.OK;
        } else {
            // 失败
            //console.log('token fail');
            return TOKEN_STATUS.FAIL;
        }
    } catch (err) {
        // 输出错误
        console.log(err);
        return TOKEN_STATUS.ERROR;
    }
}

module.exports = {
    TOKEN_STATUS,
    checkUsrToken,
	checkAdminToken
}

