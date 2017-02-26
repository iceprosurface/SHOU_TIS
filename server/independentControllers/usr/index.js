const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const usr = require('../../model/usr');
const checks = require('../../lib/tokenCheck');
const conf = require('../../conf.js');
//如果需要的话可以使用下面一种方式强制更改命名，但是不推荐
//原因是再设计mvc的时候是通过文件名区分控制器的，如果擅自改动的话不同文件夹内容的
//控制器无法准确的识别出内容
//exports.name = 'usr';

exports.before = function(req, res, next) {
    if (checks.checkUsrToken(req, res) != checks.TOKEN_STATUS.OK) {
        res.status(403).end('you need login first');
        return;
    }
    next();
};

exports.show = {
    method: 'get',
    path: '/usr/info',
    fn: function(req, res, next) {
        var result = {
            response: 'search find',
			list: {}
        };
        usr.fn.findOne({
			_id: ObjectId(req.session.usrObjId)
        }).exec(function(err, doc) {
            if (!err) {
                result.list = doc;
                //要在收到回执后在返回result
                res.send(result);

            } else {
                // 出现错误的处理
                res.status(502).send('may have a server error');
            }
        });
    }
};

exports.ageEdit = {
	method: 'post',
	path: '/usr/info/age/edit',
	fn: function(req, res, next){
		var age = req.body.age;
		if(!/^\d{2}$/g.test(age)){
			res.status(401).send({status:"401",response:"regex not match"});
			return;
		}
		usr.fn.where({
			_id: ObjectId(req.session.usrObjId)
		})
		.update({
			age: age
		})
		.exec(function(err,doc){
			if(err){
				console.log(err);
				res.status(502).send({status:502,response:'error',errorCode:err.code});
			}else{
				res.send({status:200,response:'success'});
			}
		});
	}
}
