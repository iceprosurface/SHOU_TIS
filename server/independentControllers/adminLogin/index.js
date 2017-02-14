const usr = require(global.APP_PATH + '/model/usr');
const PERMISSION = usr.PERMISSION;
const checks = require(global.APP_PATH + '/lib/tokenCheck');
const conf = require(global.APP_PATH + '/conf.js');
const jwt = require('jsonwebtoken');

exports.login = {
	method: 'post',
	path: '/admin/login',
	fn: function(req,res,next){
		// 正常登陆
        if (!req.body) res.status(400).send({
            respond: 'this is not allow to input null',
            status: 400
        });
        var loginInfo = {
            name: req.body.usr,
            psw: req.body.psw,
			permission: PERMISSION.ADMIN
        };
        usr.fn.findOne(loginInfo)
            .exec((err, doc) => {
                if (err) {
                    res.status(502).send({
                        respond: 'there is a server error ',
                        status: 502
                    });
                    console.log(err);
                    return;
                }
                if (doc) {
                    let token = jwt.sign({
                        usrname: doc.name
                    }, conf.adminSecret);

                    //admin 
                    res.cookie('admin', token, {
                        maxAge: 3600 * 1000,
                    });

                    // 储存session
                    req.session.admin = {
                        usrname: doc.name,
						age: doc.age,
						sid: doc.sid,
						permission: doc.permission,
						usrObjId: doc._id
                    };
                    res.status(200).send({
                        respond: 'this is success',
                        name: doc.name,
                        status: 200
                    });
                } else {
                    res.status(402).send({
                        respond: 'password or usrname error',
                        status: 402
                    });
                }
            });
    }
}

exports.token = {
	method: 'get',
	path: '/admin/token/check',
	fn: function(req,res,next){
		// token 登陆
        if (req.cookies && req.cookies.admin) {
            try {
                // TODO: 建议添加一个合适token组件来验证而不是每次手动验证
                // 先decoded解码在使用
                let decoded = jwt.verify(req.cookies.admin, conf.adminSecret);
                if (req.session.admin && decoded && decoded.usrname == req.session.admin.usrname) {
                    let token = jwt.sign({
                        usrname: decoded.usrname
                    }, conf.adminSecret);
                    // next for admin  
                    res.cookie('admin', token, {
                        maxAge: 3600 * 1000
                    });
					// session 不需要储存因为还在session有效期内
                    res.status(200).send({
                        name: decoded.usrname,
                        respond: 'token successfully',
                        status: 200
                    });
                    // 结束方法
                } else {
                    res.status(403).send({
                        respond: 'token error',
                        status: 403
                    });
                    console.log('token fail');
                }
				return;
            }catch(err){
                // 错误
                res.status(500).send({
                    respond: 'server token error',
                    status: 500
                });
                console.log(err);
				return;
            }
        }else{
			res.status(403).send({
				respond: 'no token to use',
				status: 403
			});
			console.log('no token');
		}
	}
}

exports.loginout = {
	method: 'post',
	path: '/admin/loginout',
	fn: function(req,res,next){

	}
}


