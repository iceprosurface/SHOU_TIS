const pj = require(global.APP_PATH + '/model/project.js');
const usr = require(global.APP_PATH + '/model/usr.js');
const checks = require(global.APP_PATH + '/lib/tokenCheck');
const conf = require(global.APP_PATH + '/conf.js');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const clearNullObj = require(global.APP_PATH + '/lib/common.js').clearNullObj;
const tansObjectToName = require(global.APP_PATH + '/lib/common.js').tansObjectToName;

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
exports.list = function(req, res, next) {
    var result = {};
    // 保证page是一个整数
    var page = parseInt(req.params.page) ? parseInt(req.params.page) - 1 : 0;
    console.log(page);
    // 利用session查询
    pj.project.find({
        adminUsrChief: ObjectId(req.session.usrObjId)
    }, "name  createTime endTime adminUsr pid", {
        skip: page * 20,
		limit: 20
    }).exec(function(err, projectList) {
        if (!err) {
            result.list = projectList;
            result.status = 200;
            result.response = "find lists";
            //要在收到回执后在返回result
            res.send(result);
        } else {
            // 出现错误的处理
            res.status(502).send('may have a server error');
        }
    });
};


// 显示某个指定的project信息，识别为req.params.project_id
exports.show = function(req, res, next) {
    var result = {};
    pj.project.findOne({
            pid: req.params.project_id,
        }, "name infomation createTime endTime staffs adminUsrChief adminUsr pid", {})
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
};

// 修改项目的接口
exports.update = function(req, res, next) {
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
        .update(updatePj).then(()=>{
			res.send('success');
		});

}

// 创建一个项目的接口
exports.create = function(req, res, next) {
    // 创建者
    var mine = new pj.staff({
        name: req.session.logined.usrname,
        age: req.session.logined.age,
        info: req.body.info,
        sid: req.body.sid
    });
    // 创建一个新的项目
    var newPj = new pj.project({
        pid: req.body.projectid,
        name: "这是一个默认的项目名称，请自行修改",
        infomation: "这里填写项目的基本信息",
        createTime: new Date(),
        staffs: [mine],
        adminUsrChief: req.session.usrObjId
    });
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
                result.response = 'this may be a duplicative project id , if it happens again after checking id first,please call admin.';
                result.status = 403;
                result.errorCode = err.code;
                result.errorName = err.name;
                res.status(403);
                return result;
            })
        .then(function() {
            res.send(result);
        });
}
