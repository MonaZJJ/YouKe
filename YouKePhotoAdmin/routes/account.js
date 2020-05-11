var express = require('express');
var router = express.Router();

/* 渲染登录页 */
router.get('/login', function (req, res, next) {
    res.render('account/login.html');
});

//登录验证
router.requireAuthentication = function (req, res, next) {

    //已登录跳转到首页
    if (req.path == "/account/login" && req.session.user) {
        res.redirect('/?' + Date.now());
    }

    if (req.path == "/account/login" || req.path == "/account/saveAuth") {
        next();
        return;
    }

    //未登录跳转到登录页，已登录跳转到首页
    if (!req.session.user) {
        res.redirect('/account/login?' + Date.now());
    }
    else {
        next();
        return;
    }
};

//将登陆成功的信息写入session
router.post('/saveAuth', function (req, res, next) {
    //将登陆成功的信息写入session
    var user = {
        "account": req.body.Account
    }
    req.session.user = user;
    res.json({'result': 1,'message':'登录成功'});
});

//退出成功清除session
router.post('/loginout', function (req, res, next) {
    req.session.user = null;
    res.json({'result': 1,'message':'退出登录成功'});
});

module.exports = router;