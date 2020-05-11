var express = require('express');
var router = express.Router();

/* 渲染活动列表 */
router.get('/activityList', function (req, res, next) {
    res.render('activity/activityList.html',{
        currentUrl :"/activity/activityList",
    });
});
// 已结束列表
router.get('/activityFinished', function (req, res, next) {
    res.render('activity/activityFinished.html',{
        currentUrl :"/activity/activityList",
    });
});
router.get('/attestatiodetail', function (req, res, next) {
    res.render('activity/attestatiodetail.html',{
        currentUrl :"/activity/activityList",
    });
});


/* 渲染活动添加 */
router.get('/addactivity', function (req, res, next) {
    res.render('activity/addactivity.html',{
        currentUrl :"/activity/activityList",
    });
});

/* 渲染活动统计 */
router.get('/activityStatistic', function (req, res, next) {
    res.render('activity/activityStatistic.html',{
        currentUrl :"/activity/activityStatistic",
    });
});
/* 渲染活动统计 */
router.get('/activityStatisticDetail', function (req, res, next) {
    res.render('activity/activityStatisticDetail.html',{
        currentUrl :"/activity/activityStatistic",
    });
});

/* 渲染活动详情 */
router.get('/activityDetail', function (req, res, next) {
    res.render('activity/activityDetail.html',{
        currentUrl :"/activity/activityList",
    });
});
module.exports = router;