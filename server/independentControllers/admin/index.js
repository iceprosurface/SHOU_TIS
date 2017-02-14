const usr = require(global.APP_PATH + '/model/usr');
const checks = require(global.APP_PATH + '/lib/tokenCheck');
const conf = require(global.APP_PATH + '/conf.js');

exports.before = function(req, res, next) {
    if (checks.checkUsrToken(req, res) != checks.TOKEN_STATUS.OK) {
        res.status(403).end('you need login first');
        return;
    }

    var usr = req.params.usr_id;
    if (!usr) return next('route');
    req.usr = usr;
    next();

};

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






