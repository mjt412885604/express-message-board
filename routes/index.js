var express = require('express');
var router = express.Router();
var moment = require('moment');
var db = require('../config/db');
var utils = require('../utils/utils');


router.get('*', function (req, res, next) {
  // 到注册页面不跳转
  if (req.url == '/register') {
    res.render('admin/register', {
      title: '注册',
      name: null
    })
    return;
  }

  if (req.url != '/login' && !req.cookies.user) {
    res.redirect('/login');
  }

  console.log(req.url)
  next();
})

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.cookies.user) {
    let curPage = req.query.page - 1 || 0;

    db.getAllUser([curPage]).then(function (result) {
      db.getAllUserCount().then(function (count) {
        console.log('拿到的数据' + count)
        let totalCount = count[0]['count(1)'];
        let totalPage = Math.ceil(totalCount / 10);

        // 明文显示密码
        /*result.forEach(function(val){
          try {
            val.password = utils.decrypt(val.password)
          } catch (error) {
            console.log(error)
          }
        })*/

        res.render('admin/index', {
          name: req.cookies.user.name,
          data: result,
          totalPage: totalPage,
          curPage: curPage,
          title: '首页'
        });
      })
    })
  } else {
    res.redirect('/login')
  }
});

/**
 * 登录
 */
router.get('/login', function (req, res, next) {
  res.render('admin/login', {
    title: '登录',
    name: req.cookies.user ? req.cookies.user.name : null
  });
});

/**
 * 查看留言板
 */
router.get('/message', function (req, res, next) {
  let curPage = req.query.page - 1 || 0;

  db.getAllMessage([curPage]).then(function (result) {
    db.getMessageCount().then(function (count) {
      let totalCount = count[0]['count(1)'];
      let totalPage = Math.ceil(totalCount / 10);

      // 格式化时间
      result.forEach(function (val) {
        val.date = moment(val.date).format('YYYY-MM-DD HH:mm:ss');
      })

      res.render('admin/message', {
        title: '查看留言板',
        data: result,
        totalPage: totalPage,
        curPage: curPage,
        name: req.cookies.user.name
      })
    })
  })
})

/**
 * 去留言
 */
router.get('/board', function (req, res, next) {
  res.render('admin/board', {
    title: '留言',
    name: req.cookies.user.name
  })
})

module.exports = router;