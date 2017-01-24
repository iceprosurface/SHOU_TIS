const pj = require(global.APP_PATH + '/model/project.js');
const staff = pj.staff;
const usr = require(global.APP_PATH + '/model/usr.js');
const checks = require(global.APP_PATH + '/lib/tokenCheck');
const conf = require(global.APP_PATH + '/conf.js');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const clearNullObj = require(global.APP_PATH + '/lib/common.js').clearNullObj;

//exports.name = 'staff';

// TODO: this need to be uncoded
// the staff_id here immedeately use staff`s _id
//exports.before = function(req, res, next) {
//    if (checks.checkUsrToken(req, res) != checks.TOKEN_STATUS.OK) {
//        res.status(403).end('you need login first');
//        return;
//    }
//    var usr = req.params.usr_id;
//    if (!usr) return next('route');
//    req.usr = usr;
//    next();
//};

// only need 'create' and 'edit' ,because it......
exports.create = {
    method: 'post',
    path: '/staff/create',
    fn: function(req, res, next) {
        // if any body requirement is null or any viod obj ,it should be inturript and backword 403
        if (!(req.body.pid && req.body.usrname && req.body.age && req.body.info && req.body.sid)) res.status(403).send('you are not allowed to inut an empty form');
        var newStaff = {
            name: req.body.usrname,
            age: req.body.age,
            info: req.body.info,
            sid: req.body.sid
        };
        // use session to current body pid to find any requirement
        pj.project.findByIdAndUpdate(ObjectId(req.body.pid), {
            $push: {
                staffs: newStaff
            }
        }, {
            safe: true,
            upsert: true
        }, (err, model) => {
            if (!err) {
                // operation success when err have't any input
                res.send({
                    response: 'success',
                    status: 200
                });
            } else {
                console.log(err);
                // when treat in err
                res.status(502).send('may have a server error');
            }
        });
    }
};

exports.edit = {
    method: 'put',
    path: '/staff/:staff_id/edit',
    fn: function(req, res, next) {
        // only need to sid for search
        if (req.body.sid) res.status(403).send('you are not allowed to inut an empty form');
        var staff_id = req.params.staff_id;
        var newStaff = clearNullObj.call({
            sid: req.body.sid,
            info: req.body.info,
            age: req.body.age,
            name: req.body.name
        });
        pj.project.findByIdAndUpdate(ObjectId(req.body.sid), newStaff, {
            safe: true,
            upsert: true
        }, (err, model) => {
            if (!err) {
                res.send({
                    response: 'success',
                    status: 200
                });
            } else {
                console.log(err);
                res.status(502).send('may have a server error');
            }
        })
    }
};
