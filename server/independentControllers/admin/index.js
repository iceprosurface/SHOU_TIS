const usr = require(global.APP_PATH + '/model/usr');
const pj = require(global.APP_PATH + '/model/project.js');
const checks = require(global.APP_PATH + '/lib/tokenCheck');
const conf = require(global.APP_PATH + '/conf.js');
const PERMISSION = usr.PERMISSION;
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const clearNullObj = require(global.APP_PATH + '/lib/common.js').clearNullObj;
const tansObjToName = require(global.APP_PATH + '/lib/common.js').tansObjToName;

exports.before = function(req, res, next) {
    if (checks.checkAdminToken(req, res) != checks.TOKEN_STATUS.OK) {
        res.status(403).end('you need login first');
        return;
    }

	if(req.session.admin.permission != PERMISSION.ADMIN.toString()){
		res.status(403).send("you are not allowed use this api");
		return;
	}
    next();
};
exports.CheckUsr = {
    method: 'post',
    path: '/admin/usr/check',
	fn: function(req, res, next) {
		
	}
}
exports.UncheckUsrList = {
    method: 'post',
    path: '/admin/usr/uncheck',
	fn: function(req, res, next) {
		var result = {};
        // 保证page是一个整数
        var page = parseInt(req.params.page) ? parseInt(req.params.page) - 1 : 0;
        // 利用session查询
		usr.fn.count({
            permission: PERMISSION.READY_CHECK
		}, function (err, total) {
			usr.fn.find({
				permission: PERMISSION.READY_CHECK
			}, "name age sid", {
				skip: page * 5,
				limit: 5
			}).sort({createTime: "desc"}).exec(function(err, peopleList) {
				if (!err) {
					result.list = peopleList;
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
}
exports.editProject = {
    method: 'post',
    path: '/admin/project/:pid/edit',
	fn: function(req, res, next) {
		var result = {};
		var updatePj = clearNullObj.call({
            name: req.body.name,
            information: req.body.information,
			nowStatus: req.body.nowStatus
        });
		if(req.body.createTime && req.body.createTime.match(/\d{4}-\d{2}-\d{2}/g))
			updatePj.createTime = new Date(req.body.createTime);
		if(req.body.endTime  && req.body.endTime.match(/\d{4}-\d{2}-\d{2}/g))
			updatePj.endTime = new Date(req.body.endTime);
		console.log(updatePj);
        pj.project.where({
                pid: req.params.pid,
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

exports.showStatus = {
    method: 'get',
    path: '/admin/project/:project_id/status',
	fn: function(req, res, next) {
		var result = {};
		pj.project.findOne({
				pid: req.params.project_id,
			}, "nowStatus", {})
			.exec(function(err, projectSingle) {
				if (!err) {
					if(!projectSingle){
						res.status(404).send("cant find");
						return;
					}
					result.list = projectSingle;
					res.send(result);
				} else {
					// 在非调试阶段最好能移除所有的console使用一个log组件统一管理
					console.log(err);
					// 出现错误的处理
					res.status(502).send('may have a server error');
				}
			});

	}
}

exports.showProject = {
    method: 'get',
    path: '/admin/project/:project_id',
	fn: function(req, res, next) {
		var result = {};
		pj.project.findOne({
			pid: req.params.project_id,
		}, "name information createTime endTime staffs adminUsrChief adminUsr pid", {})
			.populate('adminUsrChief')
			.populate('adminUsr')
			.exec(function(err, projectSingle) {
				if (!err) {
					if(!projectSingle){
						res.status(404).send("cant find");
						return;
					}
					// 将admin列表转换成名字列表，用户只需要知道名字和具体的id
					projectSingle.adminUsr = tansObjToName.call(projectSingle.adminUsr);
					// 修正一下admin的内容
					projectSingle.adminUsrChief = {
						name: projectSingle.adminUsrChief.name,
						id: projectSingle.adminUsrChief._id
					};
					result.list = projectSingle;
					//要在收到回执后在返回result
					res.send(result);
				} else {
					// 在非调试阶段最好能移除所有的console使用一个log组件统一管理
					console.log(err);
					// 出现错误的处理
					res.status(502).send('may have a server error');
				}
			});
	}
}

exports.show = {
    method: 'get',
    path: '/admin/:usrId',
	fn: function(req,res,next){

	}
}






