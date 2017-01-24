var usr = require(global.APP_PATH + '/model/usr');
var checks = require(global.APP_PATH + '/lib/tokenCheck');
var conf = require(global.APP_PATH + '/conf.js');
//如果需要的话可以使用下面一种方式强制更改命名，但是不推荐
//原因是再设计mvc的时候是通过文件名区分控制器的，如果擅自改动的话不同文件夹内容的
//控制器无法准确的识别出内容
//exports.name = 'usr';

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

exports.show = {
    method: 'get',
    path: '/usr/:usrId',
    fn: function(req, res, next) {
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
    }
};

