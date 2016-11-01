// gulpfile.js
var gulp = require('gulp');
var gls = require('gulp-live-server');
var proxy = require("http-proxy-middleware");
var sass = require('gulp-sass');
//如果需要可以生成sourcemap
var sourcemaps = require('gulp-sourcemaps');
//css压缩
var minifycss = require('gulp-clean-css');
//重命名
var rename = require('gulp-rename');
//gulp监视器
var watch = require('gulp-watch');
//util
var gutil = require('gulp-util');
//浏览器同步
var browserSync = require('browser-sync').create();
//简化reload
var reload = browserSync.reload;
// es6->es5
var babel = require("gulp-babel");
//html引入
var fileinclude = require('gulp-file-include');
//hash
var rev = require('gulp-rev-append');
//js压缩
var uglify = require('gulp-uglify');
//增量更新
var changed = require('gulp-changed');

const apiProxy = proxy('/api/', {
	target: 'localhost:8888',
    changeOrigin: true,
	router: {
		'localhost:3000' : 'http://localhost:8888'
	}
});

gulp.task('default', ['server','buildlib']);

gulp.task('buildlib',function(){
	return gulp.src('src/lib/**/**')
		.pipe(gulp.dest('dest/lib'));
});
gulp.task('sass', function() {
    return gulp.src("src/sass/main.scss")
        .pipe(sass({ style: 'expanded' }))
        .on('error', function(err) {
            gutil.log('sass Error!', err.message);
            this.emit('end');
        })
        .pipe(gulp.dest("dest/css"))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss({ keepSpecialComments: "*", processImportFrom: ['!fonts.googleapis.com'] }))
        .pipe(gulp.dest("dest/css"))
        .pipe(reload({ stream: true }));
});
gulp.task('css', function() {
    return gulp.src("src/css/**/*.css")
        .pipe(sass({ style: 'expanded' }))
        .pipe(gulp.dest("dest/css"))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss({ keepSpecialComments: "*", processImportFrom: ['!fonts.googleapis.com'] }))
        .pipe(gulp.dest("dest/css"))
        .pipe(reload({ stream: true }));
});
gulp.task('html', function() {
    gulp.src("src/**/*.html")
        .pipe(fileinclude())
        .on('error', function(err) {
            gutil.log('html Error!', err.message);
            this.emit('end');
        })
        .pipe(gulp.dest("dest"))
        .pipe(rev())
        .on('error', function(err) {
            gutil.log('html Error!', err.message);
            this.emit('end');
        })
        .pipe(gulp.dest("dest"))
        .pipe(reload({ stream: true }));
});
gulp.task('script', function() {
    return gulp.src(["src/js/**/*.js","src/js/**/*.jsx"])
        .pipe(changed("dest/js"))
        .pipe(gulp.dest("dest/js"))
        .pipe(babel({
            presets: ['es2015','react']
        }))
        .on('error', function(err) {
            gutil.log('js Error!', err.message);
            this.emit('end');
        })
        .pipe(uglify())
        .on('error', function(err) {
            gutil.log('js Error!', err.message);
            this.emit('end');
        })
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("dest/js"))
        .pipe(reload({ stream: true }));
});
// 浏览器重载
gulp.task('script-watch', ['script'], reload);
// gulp.task('html-watch', ['html'], reload);

// 静态服务器
gulp.task('server', ['html', 'sass', 'script', 'css','serve'], function() {
    // 从这个项目的根目录启动服务器
    browserSync.init({
		proxy: "localhost:8888",  // local node app address
        //禁止网络模式
        online: false,
		//静止ui模式
		ui: false,
		index: 'index.html'
    });
    // 添加 browserSync.reload 到任务队列里
    // 所有的浏览器重载后任务完成。
    watch("src/sass/**/*.scss", function() { //监听所有sass
        gulp.start('sass'); //出现修改、立马执行sass任务
    });
    watch(["src/js/**/*.js","src/js/**/*.jsx"], function() { //监听所有js
        gulp.start('script-watch'); //出现修改、立马执行js任务
    });
    watch(["src/**/*.html","!src/public/*.html"], function() { //监听所有html
        gulp.start('html').on('change', reload); //出现修改、立马执行html任务
    });
    watch("src/css/**/*.css", function() { //监听所有css
        gulp.start('css'); //出现修改、立马执行css任务
    });
});

gulp.task('serve', function() {
    var server = gls.new('./server/index.js',{env: {NODE_ENV: 'development'}});
	server.start().then(function(result) {
        console.log('Server exited with result:', result);
    });
	watch('./server/**/*.js', function (file) {
      server.start.apply(server);
      server.notify.apply(server, [file]);
    })
});

gulp.task('watch', function() {
    watch("src/sass/**/*.scss", function() { //监听所有sass
        gulp.start('sass'); //出现修改、立马执行sass任务
    });
    watch("src/js/**/*.js", function() { //监听所有js
        gulp.start('script-watch'); //出现修改、立马执行js任务
    });
    watch("src/html/**/*.html", function() { //监听所有html
        gulp.start('html').on('change', reload); //出现修改、立马执行html任务
    });
    watch("src/css/**/*.css", function() { //监听所有css
        gulp.start('css'); //出现修改、立马执行css任务
    });
});
