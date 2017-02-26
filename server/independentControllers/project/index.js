const pj = require('../../model/project.js');
const usr = require('../../model/usr.js');
const PERMISSION = usr.PERMISSION;
const checks = require('../../lib/tokenCheck');
const conf = require('../../conf.js');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const clearNullObj = require('../../lib/common.js').clearNullObj;
const tansObjToName = require('../../lib/common.js').tansObjToName;

// 如果需要输出的名字，可以强制更改输出名字为当前指定名字
//exports.name = 'project';
exports.before = function(req, res, next) {
    // 检测用户登录状态，如果未登录则拒绝访问
    if (checks.checkUsrToken(req, res) != checks.TOKEN_STATUS.OK) {
        res.status(403).end('you need login first');
        return;
    }
    next();
};

// 显示列出某个usr的所有project信息，识别为project.adminUsrChief,获取点为：req.session.usrObjId
exports.list = {
    method: 'get',
    path: '/projects/list/page/:page',
    fn: function(req, res, next) {
        var result = {};
        // 保证page是一个整数
        var page = parseInt(req.params.page) ? parseInt(req.params.page) - 1 : 0;
        // 利用session查询
		pj.project.count({
            adminUsrChief: ObjectId(req.session.usrObjId)
		}, function (err, total) {
			pj.project.find({
				adminUsrChief: ObjectId(req.session.usrObjId)
			}, "name nowStatus createTime endTime adminUsr pid", {
				skip: page * 5,
				limit: 5
			}).sort({createTime: "desc"}).exec(function(err, projectList) {
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


// 显示某个指定的project信息，识别为req.params.project_id
exports.show = {
    method: 'get',
    path: '/project/:project_id',
    fn: function(req, res, next) {
        var result = {};
        pj.project.findOne({
                pid: req.params.project_id,
            }, "name information createTime endTime staffs adminUsrChief adminUsr pid", {})
            .populate('adminUsrChief')
            .populate('adminUsr')
            .exec(function(err, projectSingle) {
                if (!err) {
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
};

// 修改项目的接口
exports.update = {
    method: 'put',
    path: '/project/:project_id/edit',
    fn: function(req, res, next) {
        // clearNullObj function将会去除所有的null或者undefined或者其他的注入false等判断为非的元素
        var updatePj = clearNullObj.call({
            name: req.body.name,
            information: req.body.information,
            endTime: req.body.endTime,
        });
        pj.project.where({
                pid: req.params.project_id,
                adminUsrChief: ObjectId(req.session.usrObjId)
            })
            .update(updatePj).then((err,doc) => {
				//if(err){
				//	res.status(502).send({status:502,response:'error',errorCode:err.code});
				//}else{
					res.send({status:200,response:'success',list:updatePj});
				//}
            });

    }
};

exports.updateProjectStaff = {
    method: 'put',
    path: '/project/:project_id/staff',
    fn: function(req, res, next) {
        // clearNullObj function将会去除所有的null或者undefined或者其他的注入false等判断为非的元素
        var updatePj = clearNullObj.call({
            name: req.body.projectname,
            information: req.body.information,
            endTime: req.body.endTime,
        });
        pj.project.where({
                pid: req.params.project_id,
                adminUsrChief: ObjectId(req.session.usrObjId)
            })
            .update(updatePj).then(() => {
                res.send('success');
            });

    }
};
// 创建一个项目的接口
exports.create = {
    method: 'post',
    path: '/project/create',
    fn: function(req, res, next) {
		console.log(req.session.logined.permission);
		if( req.session.logined.permission < PERMISSION.PROJECT){
			res.status(403).send({
				response: "you are not allowed to create any project",
				status: 403
			})
			return;
		}
        // 创建者
        var mine = new pj.staff({
            name: req.session.logined.usrname,
            age: req.session.logined.age,
            sid: req.session.logined.sid
        });
		var projectObj = {
            pid: req.body.projectid,
            name: req.body.projectName!=""?req.body.projectName:"这是一个项目的默认名称请自行修改",
            information: req.body.info,
            createTime: new Date(),
            staffs: [mine],
            adminUsrChief: req.session.usrObjId,
        }
		if(req.file){
			projectObj["file"] = req.file.buffer;
		}
        // 创建一个新的项目
        var newPj = new pj.project(projectObj);
        var result = {};
        // 创建一个全新的project这个是默认的project以后相关信息将会通过project.update
        newPj.save()
            .then(function() {
                    result['response'] = 'success';
                    result.status = 200;
                    return result;
                },
                function(err) {
                    if (err) console.log(err);
					res.statusMessage = "duplicative project id";
                    result.response = 'this may be a duplicative project id , if it happens again after checking id first,please call admin.';
                    result.status = 401;
                    result.errorCode = err.code;
                    result.errorName = err.name;
                    res.status(401);
                    return result;
                })
            .then(function() {
                res.send(result);
            });
    }
};
