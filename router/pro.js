const express = require('express');
//引入连接池模块
const pool = require('../pool.js');
//console.log(pool);
//创建路由器对象
const router = express.Router();
//往路由器对象添加路由
// 登录模块
router.get("/v1/login/:uname&:upwd", (req, res) => {
  var _uname = req.params.uname;
  var _upwd = req.params.upwd;
  var sql = 'select * from xz_user where uname=? and upwd=?';
  pool.query(sql, [_uname, _upwd], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send("1");
    } else {
      res.send("0");
    }
  });

});

// 用户列表
router.get("/v1/list", (req, res) => {
  pool.query('select * from xz_user', (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// 删除用户
router.get('/v1/delete/:uid', (req, res) => {
  var _uid = req.params.uid;
  var sql = 'delete from xz_user where uid=?';
  pool.query(sql, [_uid], (err, result) => {
    if (err) throw err;
    // console.log(result);
    if (result.affectedRows > 0) {
      res.send("1");
    } else {
      res.send("0");
    }
  });
});

// 查询用户信息
router.get("/v1/search/:uid", (req, res) => {
  var _uid = req.params.uid;
  var sql = "select * from xz_user where uid=? ";
  pool.query(sql, [_uid], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send(result);
    } else {
      res.send("0");
    }
  });
});

// 修改用户信息
router.put("/v1/update", (req, res) => {
  var obj = req.body;
  var _uid = obj.uid;
  var sql = "update xz_user set ? where uid=? ";
  pool.query(sql, [obj, _uid], (err, result) => {
    if (err) throw err;
    console.log(result);
    if (result.affectedRows > 0) {
      res.send("1");
    } else {
      res.send("0");
    }
  });
});

// 用户注册
router.post("/v1/reg", (req, res) => {
  var obj = req.body;
  pool.query("insert into xz_user set ?", [obj], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send("1");
    } else {
      res.send("0");
    }

  });
});

// 判断用户名重复
router.get("/v1/check_name/:uname", (req, res) => {
  var _uname = req.params.uname;
  pool.query("select uname from xz_user where uname=?", [_uname], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send("0");
    } else {
      res.send("1");
    }
  })
});
//路由器对象导出
module.exports = router;