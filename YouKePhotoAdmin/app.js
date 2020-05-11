//引入核心文件
var express = require('express'); //加载express模块
var session = require("express-session"); //引入session模块
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser'); //加载cookies模块
var bodyParser = require('body-parser'); //加载bodyParse 模块


// 创建app
var app = express();

// 视图模板引擎设置
// 视图模版存放的目录
app.set('views', __dirname + '/views');
app.set('view engine', 'art-template'); //定义当前的模版引擎  参1：必须是--> view engine  参2：是app.engine这个方法中定义的模板引擎名称 这里是art-template
app.engine('html', require('express-art-template')); //定义当前使用的模板引擎   第一个参数:模板引擎的名称(html/ejs) 第二个参数: 解析处理模板内容的方法 这里是express-art-template

// 视图配置
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production'
});

//监听0821端口
app.listen(19122);


// 设置 favicon 图标 在 /public 目录
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'hotcenshop456789!@#$%^&*',
    cookie: {
        maxAge: 2000 * 60 * 60 // 过期时间设置为2个小时
    },
}));

// 静态路由的设置
app.use('/', express.static(path.join(__dirname, ''))); //设置静态路由 当用户访问的url是以/开始  那么直接返回对应的__dirname+'/'下的文件

// 后台路由的设置
var account = require('./routes/account');
app.all('*', account.requireAuthentication);//登录认证
app.use('/', require('./routes/index')); //设置后台首页模块路由
app.use('/account', require('./routes/account')); //设置后台账户页-账户模块路由

app.use('/user', require('./routes/user')); //设置用户管理模块路由
app.use('/production', require('./routes/production')); //设置作品管理模块路由
app.use('/attestation', require('./routes/attestation')); //设置认证管理模块路由
app.use('/tutorial', require('./routes/tutorial')); //设置教程管理模块路由
app.use('/activity', require('./routes/activity')); //设置活动管理模块路由
app.use('/label', require('./routes/label')); //设置标签管理模块路由
app.use('/platform', require('./routes/platform')); //设置平台管理模块路由

// 404错误处理函数
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 异常错误处理函数
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;