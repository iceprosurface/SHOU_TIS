var express = require('express');
var fs = require('fs'),
	path = require('path');


function exists(path){  
     return fs.existsSync(path) || path.existsSync(path);  
}  

function isDir(path){  
    return exists(path) && fs.statSync(path).isDirectory();  
}  

module.exports = function(parent, options) {
    // options 暂时不使用
    var islog = options.islog;

    fs.readdirSync(global.APP_PATH + '/controllers').forEach(function(name) {
		if(!isDir(global.APP_PATH + '/controllers/' + name)) return;
        var obj = require(global.APP_PATH + '/controllers/' + name);
        var name = obj.name || name;
        var app = express();
        var handler,
            method,
            path;
        for (var key in obj) {
            if (~['name', 'before'].indexOf(key)) continue;
            // route exports
            switch (key) {
                case 'show':
                    method = 'get';
                    path = '/' + name + '/:' + name + '_id';
                    break;
                case 'list':
                    method = 'get';
                    path = '/' + name + 's';
                    break;
                case 'edit':
                    method = 'get';
                    path = '/' + name + '/:' + name + '_id/edit';
                    break;
                case 'update':
                    method = 'put';
                    path = '/' + name + '/:' + name + '_id';
                    break;
                case 'delete':
                    method = 'delete';
                    path = '/' + name + '/:' + name + '_id';
                    break;
                case 'create':
                    method = 'post';
                    path = '/' + name;
                    break;
                case 'index':
                    method = 'get';
                    path = '/';
                    break;
                default:
                    /* 当路径不可识别时抛出错误  */
                    throw new Error('unrecognized route: ' + name + '.' + key);
            }

            // 控制器方法移交
            handler = obj[key];

            // 如果存在前置方法，则先载入前置方法，在载入handle，否则直接载入
            if (obj.before) {
                app[method](path, obj.before, handler);
                islog && console.log('     %s %s -> before -> %s', method.toUpperCase(), path, key);
            } else {
                app[method](path, handler);
                islog && console.log('     %s %s -> %s', method.toUpperCase(), path, key);
            }
        }
		//在全局方法中挂载
		parent.use(app);
    });
	
	// 载入不同于restful型的组件
	fs.readdirSync(global.APP_PATH + '/independentControllers').forEach(function(name) {
		if(!isDir(global.APP_PATH + '/independentControllers/' + name)) return;
		var obj = require(global.APP_PATH + '/independentControllers/' + name);
        var name = obj.name || name;
        var app = express();
		for(let key in obj) {
			app[obj[key].method](obj[key].path,obj[key].fn);
			islog && console.log('     %s %s -> %s', obj[key].method.toUpperCase(), obj[key].path, key);
		}
		//在全局方法中挂载
		parent.use(app);
	});
}
