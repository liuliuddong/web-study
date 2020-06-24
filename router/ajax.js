const express = require('express');
//引入连接池模块
const pool = require('../pool.js');
//console.log(pool);
//创建路由器对象
const router = express.Router();
//往路由器对象添加路由
// 验证接口 只有get方法，可以再浏览器地址栏验证
// 127.0.0.1/ajax/test
router.get('/test', (req, res) => {
  console.log("ajax请求接受成功");
  res.send("测试成功");
});

router.get("/ex1", (req, res) => {
  console.log("响应成功");
  res.send("终于得到了正确的响应数据");
});

// http原生的带参数的get方法
// 请求登录
router.get("/login", (req, res) => {
  // 获取数据
  var $uname = req.query.uname;
  var $upwd = req.query.upwd;
  // 判断
  // if (!$uname) {
  //   res.send({ code: 401, msg: 'uname required' });
  // }
  // if (!$upwd) {
  //   res.send({ code: 402, msg: 'upwd required' });

  // }
  // 
  // mysql的操作 登录模块操作
  pool.query('select * from xz_user where uname=? and upwd=?', [$uname, $upwd], (err, result) => {
    if (err) throw err;
    console.log(result);
    if (result.length > 0) {
      // 响应数据  能短就短
      // 响应数据，必须是string
      // res.send({ code: 301, msg: 'login err' });
      // return;
      res.send("1");
    }
    else {
      // res.send({ code: 200, msg: 'login success' });
      // return;
      res.send("0");

    }
  });
});
// 查询列表 list
// router.get("/list", (req, res) => {
//   // 得到值
//   // 判断
//   // 执行sql语句
//   pool.query('select * from xz_user', (err, result) => {
//     if (err) throw err;
//     console.log(result);
//     res.send(result);
//   });


// });

// 分页列表
router.get('/fenye', (req, res) => {
  // console.log(req.query);
  var $upno = req.query.upno;
  var $ucount = req.query.ucount;

  // 判断
  if (!$upno) {
    $upno = 1;
  }
  if (!$ucount) {
    $ucount = 5;
  }

  // 装换字符串
  var start = ($upno - 1) * $ucount;
  var size = parseInt($ucount);

  pool.query('select * from xz_user limit ?,?', [start, size], (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});


//restful登录验证
router.get("/login_restful/:uname&:upwd", (req, res) => {
  var _uname = req.params.uname;
  var _upwd = req.params.upwd;
  res.send(_uname + "喜欢" + _upwd);
  pool.query('select * from xz_user where uname=? and upwd=?', [_uname, _upwd], (err, result) => {
    if (err) throw err;
    console.log(result);
    if (result.length > 0) {
      // 响应数据  能短就短
      // 响应数据，必须是string
      // res.send({ code: 301, msg: 'login err' });
      // return;
      res.send("1");
    }
    else {
      // res.send({ code: 200, msg: 'login success' });
      // return;
      res.send("0");

    }
  });
});


// restful  根据uid删除信息
// 
// router.delete('/delete_restful/:uid', (req, res)     => {
//   var _uid = req.params.uid;
//   // res.send("删除成功");
//   pool.query('delete from xz_user where uid=?',        [_uid], (err, result) => {
//     if (err) throw err;
//     console.log(result);
//     if (result.affectedRows == 0) {
//       res.send("删除失败");
//     } else {
//       res.send("删除成功");

//     }
//   });

// });
// 删除在写一遍
router.delete('/deleteld_restful/:uid', (req, res) => {
  var _uid = req.params.uid;
  pool.query('delete from xz_user where uid=?', [_uid], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send("删除成功");
    } else {
      res.send("删除失败");
    }
  });
});


// restful和原生的post操作一模一样
router.post("/post_login", (req, res) => {
  var _uname = req.body.uname;
  var _upwd = req.body.upwd;
  // 执行sql语句
  pool.query('select * from xz_user where uname=? and upwd=?', [_uname, _upwd], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send("登录成功");
    } else {
      res.send("登录失败");
    }
  });
});


// 查询所有信息
router.get("/list", (req, res) => {
  pool.query('select * from xz_user', (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
//路由器对象导出
module.exports = router;