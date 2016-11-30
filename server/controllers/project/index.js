const pj = require(global.APP_PATH + '/model/project.js');
const usr = require(global.APP_PATH + '/model/usr.js');
const checks= require(global.APP_PATH + '/lib/tokenCheck');
const conf = require(global.APP_PATH + '/conf.js');

//exports.name = 'project';
//exports.before = function(req, res, next) {
//	// 检测用户登录状态，如果未登录则拒绝访问
//	if(checks.checkUsrToken(req,res) != checks.TOKEN_STATUS.OK){
//		res.status(403).end('you need login first');
//		return ;
//	}
//	next();
//};
exports.show = function(req, res, next) {
    var result = {
        response: 'search find',
        results: {}
    };
    project.staff.findOne({
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
	console.log(req.session)
    var mine = new pj.staff({
		name: 'icepro',//req.session.logined.usrname,
		age: req.body.age,
		canEdit: true,
		info: req.body.info,
		sid: req.session.usrObjId
    });
	var newPj = new pj.project({
		pid: req.body.projectid,
		name: "这是一个默认的项目名称，请自行修改",
		infomations: "这里填写项目的基本信息",
		endTime: new Date(),
		staffs: [mine],
		adminUsr: req.session.usrObjId
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
