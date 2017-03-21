const usr = require('../../model/usr');
const pj = require('../../model/project.js');
const progress = require('../../model/progress.js');
const PROJECT_STATUS = pj.PROJECT_STATUS;
const PERMISSION = usr.PERMISSION;
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const checks = require('../../lib/tokenCheck');
const conf = require('../../conf.js');
const clearNullObj = require('../../lib/common.js').clearNullObj;
const tansObjToName = require('../../lib/common.js').tansObjToName;
const TYPE = progress.TYPE;
//如果需要的话可以使用下面一种方式强制更改命名，但是不推荐
//原因是再设计mvc的时候是通过文件名区分控制器的，如果擅自改动的话不同文件夹内容的
//控制器无法准确的识别出内容
//exports.name = 'checker';

exports.before = function(req, res, next) {
    if (checks.checkUsrToken(req, res) != checks.TOKEN_STATUS.OK) {
        res.status(403).end('you need login first');
        return;
    }
	if( req.session.logined.permission != PERMISSION.AUDIT && req.session.logined.permission != PERMISSION.PROJECT_AUDIT){
        res.status(401).end('you have no permision');
		return;
	}
    next();
};
// progress 只允许创建不允许修改


exports.ulist = {
    method: 'get',
    path: '/check/user/page/:page',
    fn: function(req, res, next) {
		var result = {};
        // 保证page是一个整数
        var page = parseInt(req.params.page) ? parseInt(req.params.page) - 1 : 0;
        // 利用session查询
		usr.fn.count({
            permission: PERMISSION.READY_CHECK
		}, function (err, total) {
			console.log(err);
			usr.fn.find({
            	permission: PERMISSION.READY_CHECK
			}, "name sid age", {
				skip: page * 5,
				limit: 5
			}).sort({name: "desc"}).exec(function(err, projectList) {
				console.log(err);
				if (!err) {
					result.list = projectList;
					result.page = page + 1;
					result.total = total;
					result.status = 200;
					result.response = "find lists";
					//要在收到回执后在返回result
					res.send(result);
				} else {
					// 出现错误的处理
					res.status(502).send('may have a server error');
				}
			});
		});
	}
};

exports.user = {
	method: 'post',
	path: '/check/user/:uid/:type',
	fn: function(req,res,next){
		var updatePj;
		if(req.body.result == "true"){
			switch(req.type){
				case 1:
					updatePj = {
						permission: PERMISSION.AUDIT,
					};
					break;
				case 2:
					updatePj = {
						permission: PERMISSION.PROJECT_AUDIT,
					};
					break
				default:
					updatePj = {
						permission: PERMISSION.PROJECT,
					};
					break
			}
		}else{
			updatePj = {
				permission: PERMISSION.TOURISTS,
			};
		}

        usr.fn.where({
                sid: req.params.uid,
            })
            .update(updatePj).then((err,doc) => {
				//if(err){
				//	res.status(502).send({status:502,response:'error',errorCode:err.code});
				//}else{
					res.send({status:200,response:'success',list:updatePj});
				//}
            });
	}
}
exports.downloadP = {
	method: 'get',
	path: '/check/project/:_id/download',
	fn: function (req, res, next) {
		pj.project.findOne({
			_id: ObjectId(req.params._id),
			haveFile: true
		}, "file").exec(function (err, progressSingle) {
			if (err) console.log(err);
			res.set('Content-Type', 'Content-type: application/binary');
			res.set('Content-disposition', 'attachment; filename=download.rar');
			res.send(progressSingle.file);
		});

	}
}
exports.plist = {
    method: 'get',
    path: '/check/project/page/:page/type/:type',
    fn: function(req, res, next) {
		var result = {};
        // 保证page是一个整数
        var page = parseInt(req.params.page) ? parseInt(req.params.page) - 1 : 0;
		if([PROJECT_STATUS.END_TERM,PROJECT_STATUS.BEGIN_LOCK,PROJECT_STATUS.ON_PROCESS,PROJECT_STATUS.PROCESS_LOCK,PROJECT_STATUS.REPLY_LOCK].indexOf(parseInt(req.params.type)) == -1){
			res.status(403).send("params error");
			return;
		}
        // 利用session查询
		pj.project.count({
            nowStatus: req.params.type
		}, function (err, total) {
			pj.project.find({
	            nowStatus: req.params.type
			}, "name information createTime nowStatus pid", {
				skip: page * 5,
				limit: 5
			})
			.sort({createTime: "desc"})
			.exec(function(err, projectList) {
				if (!err) {
					result.list = projectList;
					result.page = page + 1;
					result.total = total;
					result.status = 200;
					result.response = "find lists";
					//要在收到回执后在返回result
					res.send(result);
				} else {
					// 出现错误的处理
					res.status(502).send('may have a server error');
				}
			});
		});
	}
};
exports.pSingle = {
    method: 'get',
    path: '/check/project/:pid',
    fn: function(req, res, next) {
		var result = {};
        // 利用session查询
			pj.project.findOne({
	            	pid: req.params.pid
				}, "name information createTime nowStatus pid haveFile"
				).exec(function(err, projectSingle) {
					if (!err) {
						result.list = projectSingle;
						result.status = 200;
						result.response = "find lists";
						//要在收到回执后在返回result
						res.send(result);
					} else {
						// 出现错误的处理
						res.status(502).send('may have a server error');
					}
				});
	}
};
exports.projectE = {
	method: 'get',
	path: '/check/project/:pid/exist',
	fn: function(req,res,next){
		pj.project.findOne({
            	pid: req.params.pid,
			}, "pid")
			.exec(function(err, project) {
				if (!err) {
					if(project){
						res.send({response:"find"})

					}else{
						res.status(404).send({response:"lost"});
					}
				}else{
					res.status(502).send('may have a server error when find ');
				}
			});
	}
}

exports.progress = {
	method: 'get',
	path: '/check/progressList/:pid',
	fn: function(req,res,next){
		progress.fn.find({
            	from: req.params.pid,
            	type: TYPE.MID_TERM,
			}, "name info createTime haveFiles", {
				limit: 5
			})
			.sort({createTime: "desc"})
			.exec(function(err, progress) {
				var result = {};
				if (!err) {
					if(progress && progress.length > 0){
						result.list = progress;
						result.status = 200;
						result.response = "success";
						res.send(result)

					}else{
						res.status(404).send({response:"lost"});
					}
				}else{
					res.status(502).send('may have a server error when find ');
				}
			});
	}
}
exports.progressSingle = {
	method: 'get',
	path: '/check/progress/:pid',
	fn: function(req,res,next){
		progress.fn.findOne({
            	_id: ObjectId(req.params.pid),
			}, "name info createTime operator haveFiles")
			.populate('operator')
			.exec(function(err, progress) {
				var result = {};
				if (!err) {
						result.list = progress;
						result.status = 200;
						result.response = "success";
						res.send(result)
				}else{
					console.log(err);
					res.status(502).send('may have a server error when find progress');
				}
			});
	}
}
// 用来下载文件的
exports.pDownload = {
	method: 'get',
	path: '/checker/progress/:pid',
	fn: function (req, res, next) {
		progress.fn.findOne({
			_id: ObjectId(req.params.pid)
		}, "file").exec(function (err, progressSingle) {
			if (err) console.log(err);
			res.set('Content-Type', 'Content-type: application/binary');
			res.set('Content-disposition', 'attachment; filename=download.rar');
			res.send(progressSingle.file);
		});

	}
}

exports.mid = {
	method: 'put',
	path: '/check/mid/:pid',
	fn: function(req,res,next){
		pj.project.findOne({
			pid: req.params.pid,
		}, "nowStatus endTime pid")
		.exec(function(err, project) {
					if (!err) {
						if(project.nowStatus > PROJECT_STATUS.PROCESS_LOCK){
							res.send({response:"fail"})
							return;
						}
						var result = req.body.result;
						project.nowStatus = PROJECT_STATUS.MID_TERM_FAIL;
						project.save(function(err){
							if (!err) {
								//要在收到回执后在返回result
								res.send({response:"success"});
							} else {
								res.status(502).send('may have a server error when save');
							}		
						});

					} else {
						// 出现错误的处理
						res.status(502).send('may have a server error when find ');
					}
				});
	}
}
exports.project = {
	method: 'put',
	path: '/check/project/:pid',
	fn: function(req,res,next){
		// clearNullObj function将会去除所有的null或者undefined或者其他的注入false等判断为非的元素
        pj.project.findOne({
            	pid: req.params.pid,
			}, "nowStatus endTime pid")
				.exec(function(err, project) {
					if (!err) {
						var result = req.body.result;
						switch( project.nowStatus ){
							case PROJECT_STATUS.BEGIN_LOCK:
								project.nowStatus = req.body.result == "true"?PROJECT_STATUS.REPLY_LOCK:PROJECT_STATUS.BEGIN_FAIL;
								break;
							case PROJECT_STATUS.REPLY_LOCK:
								project.nowStatus = req.body.result == "true"?PROJECT_STATUS.ON_PROCESS:PROJECT_STATUS.REPLY_FAIL;
								break;
							case PROJECT_STATUS.PROCESS_LOCK:
								project.nowStatus = req.body.result == "true"?PROJECT_STATUS.PROCESS_END:PROJECT_STATUS.ON_PROCESS;
								break;
							case PROJECT_STATUS.END_TERM:
								project.nowStatus = req.body.result == "true"?PROJECT_STATUS.FINAL:PROJECT_STATUS.ON_PROCESS;
								break;
						}
						project.save(function(err){
							if (!err) {
								//要在收到回执后在返回result
								res.send("success");
							} else {
								res.status(502).send('may have a server error when save');
							}		
						});

					} else {
						// 出现错误的处理
						res.status(502).send('may have a server error when find ');
					}
				});
	}
};
