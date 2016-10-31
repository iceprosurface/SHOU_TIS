var fs = require('fs');
var db = require(global.APP_PATH + '/model/db');

exports.before = function(req, res, next) {
    var usr = db.usr[req.params.main_id];
    if (!usr) return next('route');
    req.usr = usr;
    next();
};

exports.show = function(req, res, next) {
    var result = {
        response: 'route success',
        usr: req.usr
    };
    res.send(result);
};
