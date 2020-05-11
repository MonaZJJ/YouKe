var express = require('express');
var router = express.Router();

/* 渲染标签列表 */
router.get('/labelList', function (req, res, next) {
    res.render('label/labelList.html',{
        currentUrl :"/label/labelList",
    });
});
/* 渲染机型列表 */
router.get('/modelList', function (req, res, next) {
    res.render('label/modelList.html',{
        currentUrl :"/label/modelList"
    });
});


module.exports = router;