const progress = require(global.APP_PATH + '/model/progress');
const mongoose = require('mongoose');
const TYPE = progress.TYPE;
const ObjectId = mongoose.Types.ObjectId;
var checks = require(global.APP_PATH + '/lib/tokenCheck');
const conf = require(global.APP_PATH + '/conf.js');
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
// progress 只允许创建不允许修改

exports.list = {
    method: 'get',
    path: '/project/:pid/progress/list/page/:page',
    fn: function(req, res, next) {
        var result = {};
        // 保证page是一个整数
        var page = parseInt(req.params.page) ? parseInt(req.params.page) - 1 : 0;
        // 利用session查询
		progress.fn.count({
			operator: ObjectId(req.session.usrObjId)
		}, function (err, total) {
			if(err) console.log(err);
			progress.fn.find({
				operator: ObjectId(req.session.usrObjId)
			},"name info createTime haveFiles",{
				skip: page * 5,
				limit: 5
			}).exec(function(err, progressList) {
				if (!err) {
					result.list = progressList;
					result.page = page + 1;
					result.total = total;
					result.status = 200;
					result.response = "find lists";
					//要在收到回执后在返回result
					res.send(result);
				} else {
					console.log(err);
					// 出现错误的处理
					res.status(502).send('may have a server error');
				}
			});
		});
	}
};

// 用来下载文件的
exports.download = {
	method: 'get',
	path: '/progress/:pid',
	fn: function(req,res,next){
		progress.fn.findOne({
			_id: ObjectId(req.params.pid)
		},"file").exec(function(err,progressSingle){
			if(err) console.log(err);
			res.set('Content-Type', 'Content-type: application/binary');
			res.set('Content-disposition', 'attachment; filename=download.rar');
			res.send(progressSingle.file);	
		});

	}
}
exports.create = {
	method: 'post',
	path: '/progress/project/:pid',
	fn: function(req,res,next){
		console.log("this is progress")
		var progressObj = {
			name: req.body.name,
			info: req.body.info,
			from: parseInt(req.params.pid),
			operator: req.session.usrObjId,
            createTime: new Date()
        }
		// 存在文件则加载文件给予目标
		if(req.file){
			progressObj["file"] = req.file.buffer;
			progressObj["haveFiles"] = true;
		}
		// 存在type 且type在其中
		for(let i in TYPE){
			if(req.body.type == TYPE[i]){
				progressObj["type"] = req.body.type;
				break;
			}
		}	
        var newProgress = new progress.fn(progressObj);
        var result = {};
		newProgress.save()
			.then(function(){
				result['response'] = 'success';
				result.status = 200;
				return result;
			},function(err){
				if (err) console.log(err);
				res.statusMessage = "duplicative project id";
				result.response = 'this may be a duplicative project id , if it happens again after checking id first,please call admin.';
				result.status = 401;
				result.errorCode = err.code;
				result.errorName = err.name;
				res.status(401);
				return result;
		})
		.then(function(){
			res.send(result);
		});


	}
};
