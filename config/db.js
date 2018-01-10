var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'blog_cms', // 前面建的user表位于这个数据库中
    port: 3306
});

/**
 * 封装查询函数
 * @param {sql语句} sql 
 * @param {参数} values 
 */
function query(sql, values){
    return new Promise(function (resolve, reject){
        pool.getConnection(function (err, connection){
            if(err){
                resolve(err)
            } else {
                connection.query(sql, values, function (err, rows){
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }

        })
    })
}

/**
 * 登录
 * @param {*} value 
 */
function login(value){
    let sql = 'select*from user_table where (username, password)=(?,?)';
    return query(sql, value)
}

/**
 * 查询用户
 * @param {*} value 
 */
function checkUser(value){
    let sql = 'select*from user_table where (username)=(?)';
    return query(sql, value)
}

/**
 * 添加用户
 * @param {*} value 
 */
function addUser(value){
    let sql = 'insert into user_table (username, password) values (?,?)';
    return query(sql, value)
}

/**
 * 修改用户密码
 * @param {*} username 
 * @param {*} password 
 */
function modifyUser(username, password){
    let sql = 'update user_table set `password`="' + password + '" where `username`="' + username+'"';
    return query(sql)
}

/**
 * 查询所有用户
 * @param {*} value 
 */
function getAllUser(value){
    let star = value*10;
    let end = 10;
    let sql = `select*from user_table order by id desc limit ${star},${end}`;
    return query(sql)
}

/**
 * 用户总数
 */
function getAllUserCount(){
    let sql = 'select count(1) from user_table';
    return query(sql) 
}

/**
 * 删除用户
 * @param {*} value 
 */
function deleteUser(value){
    let sql = 'delete from user_table where (username)=(?)';
    return query(sql, value)
}

/**
 * 添加留言
 * @param {*} value 
 */
function insertMessage(value){
    let sql = 'insert into post (username,content,date) values (?,?,?)';
    return query(sql, value)
}

/**
 * 查找用户留言
 * @param {*} value 
 */
function getAllMessage(value){
    let star = value * 10;
    let end = 10;
    let sql = `select * from post order by uid desc limit ${star},${end}`;
    return query(sql, value)
}

function getMessageCount(){
    let sql = 'select count(1) from post';
    return query(sql)
}

module.exports = {
    query,
    login,
    checkUser,
    addUser,
    modifyUser,
    getAllUser,
    getAllUserCount,
    deleteUser,
    insertMessage,
    getAllMessage,
    getMessageCount
}

