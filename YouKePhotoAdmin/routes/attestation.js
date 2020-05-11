var express = require('express');
var router = express.Router();

/* 渲染摄影师审核列表 */
router.get('/attestationList', function (req, res, next) {
    res.render('attestation/attestationList.html',{
        currentUrl :"/attestation/attestationList",
    });
});

/* 渲染摄影师审核详情 */
router.get('/attestationDetail', function (req, res, next) {
    res.render('attestation/attestationDetail.html',{
        currentUrl :"/attestation/attestationList",
    });
});

/* 渲染认证设置 */
router.get('/attestationsetting', function (req, res, next) {
    res.render('attestation/attestationsetting.html',{
        currentUrl :"/attestation/attestationsetting"
    });
});


module.exports = router;