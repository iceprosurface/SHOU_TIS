// 导入依赖
const express = require('express'),
	path = require('path'),
	serveStatic = require('serve-static'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); 
//定义全局根目录
global.APP_PATH = __dirname + '/';

// 实例化experess,同时输出文件到express
var app = module.exports = express();
// 代理静态资源
app.use(serveStatic(__dirname + '/../dest'));
// 使用bodyparse 使得form-data可以被解析
// 要在route前导入
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(upload.array()); // for parsing multipart/form-data
// 导入数据库连接
var db = require('./model/db');
// 导入自动化controller
var route = require('./lib/controller');

// 使用cookie代理插件
app.use(cookieParser());
// 设置session
app.use(session({
    secret: 'recommand 128 bytes random string',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 1000
    }
}));

require(__dirname + '/lib/controller')(app, {
    islog: true
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
