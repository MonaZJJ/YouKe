var express = require('express');
var router = express.Router();

/* 渲染二维码页 */
router.get('/', function (req, res, next) {
    res.render('index/index.html',{
        currentUrl : req.path
    });
});

module.exports = router;