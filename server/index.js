// 导入依赖
const express = require('express'),
    path = require('path'),
    serveStatic = require('serve-static'),
    cookieParser = require('cookie-parser'),
    session = require('express-session');
//定义全局根目录
global.APP_PATH = __dirname + '/';

// 导入数据库连接
var db = require('./model/db');
// 导入自动化controller
var route = require('./lib/controller');
// 实例化experess,同时输出文件到express
var app = module.exports = express();
// 代理静态资源
app.use(serveStatic(__dirname + '/../dest'));

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

require(__dirname + '/lib/controller')(app, { islog: true });

app.listen(8888);
