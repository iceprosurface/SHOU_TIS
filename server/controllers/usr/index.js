var fs = require('fs');
var usr = require(global.APP_PATH + '/model/usr');
// token 使用
var jwt = require('jsonwebtoken');
var conf = require(global.APP_PATH + '/conf.js');
//如果需要的话可以使用下面一种方式强制更改命名，但是不推荐
//原因是再设计mvc的时候是通过文件名区分控制器的，如果擅自改动的话不同文件夹内容的
//控制器无法准确的识别出内容
//exports.name = 'usr';

exports.before = function(req, res, next) {
    var usr = req.params.usr_id;
    if (!usr) return next('route');
    req.usr = usr;
    next();
};

exports.show = function(req, res, next) {
    var result = {
        response: 'search find',
        usr: {}
    };
    usr.fn.findOne({
        name: req.usr
    }).exec(function(err, doc) {
        if (!err) {
            result['usr'] = doc;
            //要在收到回执后在返回result
            res.send(result);

        } else {
            // 出现错误的处理
            res.status(502).send('may have a server error');
        }
    });
};

exports.create = function(req, res, next) {
    var oneNew = new usr.fn({
        name: req.params.usr_id,
        age: Math.ceil(Math.random() * 100)
    });
    var result = {};
    oneNew.save()
        .then(function() {
                result['response'] = 'success';
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
exports.check = function(req, res, next) {
    var loginInfo = {
        name: req.params.usr_id,
        psw: req.body.psw
    };
    // token 登陆
    if (req.cookies && req.cookies.logined) {
        try {
            let decoded = jwt.verify(req.cookies.logined, conf.tokenSecret);
            if (req.session.logined && decoded.usrname == req.session.logined.usrname) {
                let token = jwt.sign({
                    usrname: decoded.usrname
                }, conf.tokenSecret);
                // next for logined  
                res.cookie('logined', token, {
                    maxAge: 3600 * 1000
                });
                // 储存session
				req.session.logined = {
                    usrname: decoded.usrname
                }; 
                res.status(200).send({
                    respond: 'token successfully',
                    status: 200
                });
				// 结束方法
				return ;
            }else{
				console.log('token fail');
			}
        } catch (err) {
            // 错误
            console.log(err);
        }
    }

    // 正常登陆
    if (!req.body) res.status(400).send({
        respond: 'this is not allow to input null',
        status: 400
    });
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
                }, conf.tokenSecret);
                //logined 
                res.cookie('logined', token, {
                    maxAge: 3600 * 1000,
                });
                // 储存session
                req.session.logined = {
                    usrname: doc.name
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
