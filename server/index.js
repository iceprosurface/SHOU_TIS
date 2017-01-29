// 导入依赖
const express = require('express'),
	path = require('path'),
	serveStatic = require('serve-static'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	bodyParser = require('body-parser');
const conf = require('./conf.js');
//定义全局根目录
global.APP_PATH = __dirname;

const multer = require('multer');
// 实例化experess,同时输出文件到express
var app = module.exports = express();
// 代理静态资源
app.use(serveStatic(__dirname + '/../dest'));
// 使用bodyparse 使得form-data可以被解析
// 要在route前导入
// 如果需要可以选择保存到本地目前采用mongoDB储存的形式
//var storage = multer.diskStorage({
//	//设置上传后文件路径，uploads文件夹会自动创建。
//	destination: function (req, file, cb) {
//		console.log(file);
//		cb(null, APP_PATH + '/upload');
//	}, 
//	//给上传文件重命名，获取添加后缀名
//	filename: function (req, file, cb) {
//		var fileFormat = (file.originalname).split(".");
//		cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
//	}
//});  
//var upload = multer({ storage:storage});
var upload = multer();
app.use(upload.single("upload"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ type: 'application/*+json' }));
// 导入数据库连接
var db = require('./model/db');
// 导入自动化controller
var route = require('./lib/controller');

// 使用cookie代理插件
app.use(cookieParser(conf.secret));
console.log('now use ' + conf.cookieSecret);
// 设置session,使用128位密码加密，random
// cookie最大存活时间 1 分钟
app.use(session({
    secret: 'recommand 128 bytes random string',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 60 * 1000
    }
}));

require(__dirname + '/lib/controller')(app, {
	islog: false
});

// 错误处理
app.use(function(err, req, res, next) {
    // 系统错误这时候输出错误
    if (!module.parent) console.error(err.stack);

    // 输出错误
    res.status(500).send("server error");
});

// 显然当没有任何匹配的时候，显示404即可
app.use(function(req, res, next) {
    res.status(404).send("file or api not find in server and path is : " + req.originalUrl);
});

app.listen(8888);
console.log('listen on 8888 port');
