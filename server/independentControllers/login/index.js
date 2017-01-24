var usr = require(global.APP_PATH + '/model/usr');
// token 使用
var jwt = require('jsonwebtoken');
var conf = require(global.APP_PATH + '/conf.js');


// create a usr
exports.create = {
    method: 'post',
    path: '/usr/create',
    fn: function(req, res, next) {
        var oneNew = new usr.fn({
            name: req.body.usrname,
            age: req.body.age,
			psw: req.body.password
		});
        var result = {};
        oneNew.save()
            .then(function() {
                    result['response'] = 'success';
					// TODO:after registe login next
                    return result;
                },
                function(err) {
                    if (err) console.log('Error on save!');
                    result['response'] = 'fails';
                    return result;
                })
            .then(function() {
                res.send(result);
            });
    }
}

exports.tokenLoginCheck = {
    method: 'get',
    path: '/login/token',
    fn: function(req, res, next) {
        // token 登陆
        if (req.cookies && req.cookies.logined) {
            try {
                // TODO: 建议添加一个合适token组件来验证而不是每次手动验证
                // 先decoded解码在使用
                let decoded = jwt.verify(req.cookies.logined, conf.tokenSecret);
                if (req.session.logined && decoded.usrname == req.session.logined.usrname) {
                    let token = jwt.sign({
                        usrname: decoded.usrname
                    }, conf.tokenSecret);
                    // next for logined  
                    res.cookie('logined', token, {
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
            } catch (err) {
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
// 登录后可以在session中访问到login.usrname以及usrObjId
exports.nomalLoginCheck = {
    method: 'post',
    path: '/login/check',
    fn: function(req, res, next) {
        // 正常登陆
        if (!req.body) res.status(400).send({
            respond: 'this is not allow to input null',
            status: 400
        });
        var loginInfo = {
            name: req.body.usr,
            psw: req.body.psw
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
                        usrname: doc.name,
						age: doc.age

                    }, conf.tokenSecret);
                    //logined 
                    res.cookie('logined', token, {
                        maxAge: 3600 * 1000,
                    });
                    // 储存session
                    req.session.logined = {
                        usrname: doc.name
                    };
					req.session.usrObjId = doc._id;
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
