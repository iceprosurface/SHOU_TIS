const pj = require('../../model/project.js');
const staff = pj.staff;
const usr = require('../../model/usr.js');
const checks = require('../../lib/tokenCheck');
const conf = require('../../conf.js');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const clearNullObj = require('../../lib/common.js').clearNullObj;

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
    path: '/project/:pid/staff/create',
    fn: function(req, res, next) {
        // if any body requirement is null or any viod obj ,it should be inturript and backword 403
        if (!(req.params.pid && req.body.usrname && req.body.age && req.body.sid)){
		   	res.status(403).send('you are not allowed to inut an empty form');
			// break
			return;
		}
        var newStaff = {
            name: req.body.usrname,
            age: req.body.age,
            sid: req.body.sid
        };
		if(req.body.info)
			newStaff["info"] = req.body.info;
        // use session to current body pid to find any requirement
        // pj.project.findByIdAndUpdate(ObjectId(req.params.pid), {
        pj.project.findOneAndUpdate({pid:req.params.pid}, {
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
    path: '/project/:pid/staff/:staff_id/edit',
    fn: function(req, res, next) {
        // only need to sid for search
        if (req.params.sid){
		   	res.status(403).send('you are not allowed to inut an empty form')
			return;
		}
        var staff_id = req.params.staff_id;
		var pid = req.params.pid;
        var newStaff = clearNullObj.call({
			sid: staff_id,
            info: req.body.info,
            age: req.body.age,
            name: req.body.usrname
        });
        pj.project.findOneAndUpdate({
			"pid": pid,
			"staffs.sid":staff_id
		},{
		   $set:{
			   "staffs.$": newStaff
		   }
		},{
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
