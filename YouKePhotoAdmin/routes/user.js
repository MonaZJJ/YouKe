var express = require('express');
var router = express.Router();

/* 渲染用户列表 */
router.get('/userList', function (req, res, next) {
    res.render('user/userList.html',{
        currentUrl :"/user/userList",
    });
});

/* 渲染认证列表 */
router.get('/certificationUserList', function (req, res, next) {
    res.render('user/certificationUserList.html',{
        currentUrl :"/user/userList",
    });
});

/* 渲染黑名单列表 */
router.get('/blackUserList', function (req, res, next) {
    res.render('user/blackUserList.html',{
        currentUrl :"/user/userList",
    });
});

/* 渲染比赛列表 */
router.get('/matchList', function (req, res, next) {
    res.render('user/matchList.html',{
        currentUrl :"/user/userList",
    });
});


/* 渲染排行榜 */
router.get('/userleaderboard', function (req, res, next) {
    res.render('user/userleaderboard.html',{
        currentUrl :"/user/userleaderboard"
    });
});
/* 渲染排行设置 */
router.get('/usersetting', function (req, res, next) {
    res.render('user/usersetting.html',{
        currentUrl :"/user/usersetting"
    });
});




module.exports = router;