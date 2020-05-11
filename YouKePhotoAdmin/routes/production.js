var express = require('express');
var router = express.Router();

/* 渲染作品列表 */
router.get('/productionList', function (req, res, next) {
    res.render('production/productionList.html',{
        currentUrl :"/production/productionList",
    });
});

/* 渲染用户作品列表 */
router.get('/productionUserList', function (req, res, next) {
    res.render('production/productionUserList.html',{
        currentUrl :"/production/productionList",
    });
});

/* 渲染作品详情 */
router.get('/productionDetail', function (req, res, next) {
    res.render('production/productionDetail.html',{
        currentUrl :"/production/productionList",
    });
});

/* 渲染评论列表 */
router.get('/commentsList', function (req, res, next) {
    res.render('production/commentsList.html',{
        currentUrl :"/production/productionList",
    });
});

/* 渲染作品审核 */
router.get('/productionaudit', function (req, res, next) {
    res.render('production/productionaudit.html',{
        currentUrl :"/production/productionaudit"
    });
});

/* 渲染作品设置 */
router.get('/productionsetting', function (req, res, next) {
    res.render('production/productionsetting.html',{
        currentUrl :"/production/productionsetting"
    });
});

/* 渲染作品设置 */
router.get('/auditsetting', function (req, res, next) {
    res.render('production/auditsetting.html',{
        currentUrl :"/production/auditsetting"
    });
});

module.exports = router;