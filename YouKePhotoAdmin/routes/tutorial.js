var express = require('express');
var router = express.Router();

/* 渲染教程列表 */
router.get('/tutorialList', function (req, res, next) {
    res.render('tutorial/tutorialList.html',{
        currentUrl :"/tutorial/tutorialList",
    });
});

/* 渲染添加教程 */
router.get('/addtutorial', function (req, res, next) {
    res.render('tutorial/addtutorial.html',{
        currentUrl :"/tutorial/tutorialList",
    });
});

/* 渲染留言列表 */
router.get('/messageList', function (req, res, next) {
    res.render('tutorial/messageList.html',{
        currentUrl :"/tutorial/tutorialList",
    });
});

module.exports = router;