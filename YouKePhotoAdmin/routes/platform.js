var express = require('express');
var router = express.Router();

/* 渲染消息管理 */
router.get('/msgmanagement', function (req, res, next) {
    res.render('platform/msgmanagement.html',{
        currentUrl :"/platform/msgmanagement",
    });
});
/* 渲染站点设置 */
router.get('/sitesetting', function (req, res, next) {
    res.render('platform/sitesetting.html',{
        currentUrl :"/platform/sitesetting"
    });
});
/* 渲染权限设置 */
router.get('/permissionsetting', function (req, res, next) {
    res.render('platform/permissionsetting.html',{
        currentUrl :"/platform/permissionsetting"
    });
});


// 管理员操作
router.get('/adminoperation', function (req, res, next) {
    res.render('platform/adminoperation.html',{
        currentUrl :"/platform/adminoperation",
    });
});

/* 渲染系统日志 */
router.get('/systemlog', function (req, res, next) {
    res.render('platform/systemlog.html',{
        currentUrl :"/platform/systemlog",
    });
});
/* 渲染banner图管理 */
router.get('/bannermanagement', function (req, res, next) {
    res.render('platform/bannermanagement.html',{
        currentUrl :"/platform/bannermanagement"
    });
});


/* 渲染修改账号密码 */
router.get('/password', function (req, res, next) {
    res.render('platform/password.html',{
        currentUrl :"/platform/password"
    });
});

/* 渲染修部门权限 */
router.get('/department_power', function (req, res, next) {
    res.render('platform/department_power.html',{
        currentUrl :"/platform/permissionsetting"
    });
});

/* 编辑管理员操作 */
router.get('/jurisdictionEdit', function (req, res, next) {
    res.render('platform/jurisdictionEdit.html',{
        currentUrl :"/platform/adminoperation"
    });
});



module.exports = router;