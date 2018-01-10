var express = require('express');
var router = express.Router();
var moment = require('moment');
var db = require('../config/db');
var utils = require('../utils/utils');



/**
 * 注册
 */
router.post('/adduser', function (req, res) {
    let username = req.body.username,
        password = req.body.password;

    if (username == '' || password == '') {
        res.json({
            msg: '账号密码不能为空',
            code: 1
        })
    }

    db.checkUser([username]).then(function (result) {
        if (result.length > 0) {
            res.json({
                msg: '此用户已存在',
                code: 2
            })
        } else {
            db.addUser([username, utils.encrypt(password)]).then(function (result) {
                if (result.insertId > 0) {
                    res.json({
                        msg: '注册成功快去登录吧',
                        code: 0
                    });
                } else {
                    res.json({
                        msg: '注册失败',
                        code: 1,
                        result
                    });
                }
            }).catch(function (err) {
                console.log(err);
                res.json({
                    msg: '服务器内部错误',
                    code: -1
                });
            })
        }
    })
})

router.post('/modify', function (req, res) {
    let username = req.body.username,
        password = req.body.password;

    if (username == '' || password == '') {
        res.json({
            msg: '账号密码不能为空',
            code: 1
        })
    }

    db.checkUser([username]).then(function (result) {
        if (result.length > 0) {
            db.modifyUser(username, utils.encrypt(password)).then(function (result) {
                if (result) {
                    res.json({
                        msg: '修改成功',
                        code: 0
                    });
                } else {
                    res.json(result);
                }
            }).catch(function (error) {
                res.json({
                    msg: '服务器内部错误',
                    code: -1
                });
            })
        } else {
            res.json({
                msg: '此用户还未注册快去注册吧',
                code: 2
            })
        }
    })
})

/**
 * 登录
 */
router.post('/login', function (req, res) {
    let username = req.body.username,
        password = req.body.password;

    if (username == '' || password == '') {
        res.json({
            msg: '账号密码不能为空',
            code: 1
        })
    }

    db.login([username, utils.encrypt(password)]).then(function (result) {
        if (result.length > 0) {
            res.cookie('user', {
                'name': username,
                'password': password
            }, {
                maxAge: 1000 * 60 * 30
            }); //登陆成功后将用户和密码写入Cookie，maxAge为cookie过期时间
            req.session.username = username; //服务器端session保存登陆的会话状态
            res.json({
                msg: '登陆成功',
                code: 0
            })
        } else {
            res.json({
                msg: '用户或密码错误',
                code: 1
            })
        }
    }).catch(function () {

    })
})

/**
 * 退出
 */
router.get('/login.out', function (req, res) {
    res.clearCookie('user');
    res.redirect('/login');
})

/**
 * 删除用户
 */
router.post('/deleteuser', function(req, res){
    let username = req.body.username;

    if (!username){
        res.json({
            msg: '请选择要删除的用户',
            code: 2
        })
    }

    db.deleteUser([username]).then(function(result){
        res.json({
            msg: '删除成功',
            code: 0,
            result
        })
    }).catch(function(error){
        res.json({
            msg: '删除失败',
            code: -1,
            error
        })
    })
})

/**
 * 添加留言
 */
router.post('/addmessage', function (req, res) {
    let username = req.body.username;
    let content = req.body.content;
    let date = moment().format('YYYY-MM-DD HH:mm:ss');

    db.insertMessage([username, content, date]).then(function (result) {
        if (result.insertId > 0) {
            res.json({
                msg: '留言成功',
                code: 0
            })
        } else {
            res.json({
                msg: '留言失败稍后再试',
                code: 1
            })
        }
    }).catch(function (error) {
        res.json({
            msg: '留言失败稍后再试',
            code: 1,
            error
        })
    })
})

module.exports = router;