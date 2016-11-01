var fs = require('fs');
var usr = require(global.APP_PATH + '/model/usr');
//如果需要的话可以使用下面一种方式强制更改命名，但是不推荐
//原因是再设计mvc的时候是通过文件名区分控制器的，如果擅自改动的话不同文件夹内容的
//控制器无法准确的识别出内容
exports.name = 'usr';

exports.before = function(req, res, next) {
    //  var usr = db.usr[req.params.usr_id];
    //  if (!usr) return next('route');
    //  req.usr = usr;
    var oneNew = new usr.fn({
        name: req.params.usr_id,
        age: Math.ceil(Math.random() * 100)
    });
    console.log(oneNew);
    oneNew.save()
        .then(function() {
				console.log('success');	
			},
            function(err) {
                if (err) console.log('Error on save!');
            });
    next();
};

exports.show = function(req, res, next) {

    var result = {
        response: 'route success',
        usr: req.usr
    };
    res.send(result);
};
