// nomal requirment
const pj = require(global.APP_PATH + '/model/project.js');
const notice = require(global.APP_PATH + '/model/notice.js').notice;
const checks = require(global.APP_PATH + '/lib/tokenCheck');
const conf = require(global.APP_PATH + '/conf.js');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const clearNullObj = require(global.APP_PATH + '/lib/common.js').clearNullObj;

const tansListToName = require(global.APP_PATH + '/lib/common.js').tansListToName;

// if need it can input other name
//exports.name = 'invitation';
exports.before = function(req, res, next) {
    // check usr login tatus, end process if not logined 
    if (checks.checkUsrToken(req, res) != checks.TOKEN_STATUS.OK) {
        res.status(403).end('you need login first');
        return;
    }
    next();
};

//
//exports.noticeShow = {
//    method: 'get',
//    path: '/notice/:ntype/show',
//    fn: function(req, res, next) {
//        if (['system', 'other', 'invitation'].indexOf(req.params.noticeNumber_id) == -1) res.status(403).send('this is not allowed to request data beyond system other and invitation,please try again');
//        result = {}
//
//    }
//};

exports.noticeNumber = {
    method: 'get',
    path: '/notices/number',
    fn: function(req, res, next) {
        result = {};
        notice.aggregate([{
            $match: {
                receiver: ObjectId(req.session.usrObjId)
            }
        }, {
            $group: {
                _id: "$ntype",
                number: {
                    $sum: 1
                }
            }
        }]).exec(function(err, noticeNumberList) {
            if (!err) {
                result.list = noticeNumberList;
                result.status = 200;
                result.response = "find lists";
                //ensure return result after finding
                res.send(result);
            } else {
                // send 502 if err
                res.status(502).send('may have a server error');
            }
        });
    }
};

// display all infomation of notice,because it should use usrobjid as index to find noticelist
exports.noticeList = {
    method: 'get',
    path: '/notices/list/page/:page/type/:type',
    fn: function(req, res, next) {
        var result = {};
        // ensure page to be a int
        var page = parseInt(req.params.page) ? parseInt(req.params.page) - 1 : 0;
        // find by usrObjId restored by session
        notice.find({
                receiver: ObjectId(req.session.usrObjId),
                ntype: req.params.type
            }, "sender extra infomation", {
                skip: page * 20,
                limit: 20
            })
            .populate('sender')
            .exec(function(err, noticelist) {
                if (!err) {
                    //  first of all ,the list should change list into a string called name instead of an obj
                    noticelist = tansListToName.call(noticelist, 'sender', 'name');
                    result.list = noticelist;
                    result.status = 200;
                    result.response = "find lists";
                    //ensure return result after finding
                    res.send(result);
                } else {
                    // send 502 if err
                    res.status(502).send('may have a server error');
                }
            });
    }
};


// display the specified project，it will be recognitize req.params.project_id.
//exports.show = function(req, res, next) {
//    var result = {};
//    notice.findOne({
//            receiver: ObjectId(req.session.usrObjId),
//        }, "sender extra infomation createTime", {})
//        .populate('sender')
//        .exec(function(err, noticeSingle) {
//            if (!err) {
//                noticeSingle.sender = noticeSingle.sender.name;
//                result = noticeSingle;
//                //要在收到回执后在返回result
//                res.send(result);
//            } else {
//                console.log(err);
//                // 出现错误的处理
//                res.status(502).send('may have a server error');
//            }
//        });
//};

// create a notice
exports.create = {
    method: 'get',
    path: '/notices/create',
    fn: function(req, res, next) {
        if (req.session.usrObjId == req.body.receiver) res.status(403).send('you are not allowed to send a notice for yourselves');
        // TODO : usr existance validation
        var newNotice = new notice({
            sender: req.session.usrObjId,
            receiver: req.body.receiver,
            information: req.body.info,
            createTime: new Date()
        });
        // save notice obj to mongoose
        newNotice.save()
            .then(function() {
                    result.response = 'success';
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
}
