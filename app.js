const express = require('express');
//引入路由器
const userRouter = require('./router/user.js');
const ajaxRouter = require('./router/ajax.js');
const proRouter = require("./router/pro.js");

//引入body-parser中间件
const bodyParser = require('body-parser');
const app = express();
app.listen(8080);
//托管静态资源到public目录
app.use(express.static('public'));
app.use(express.static('ajax'));
app.use(express.static('pro'));
// app.use(express.static('proo'));

//应用中间件，将post请求的数据解析为对象
app.use(bodyParser.urlencoded({
  extended: false
}));
//挂载路由器，并添加前缀/user
//  /user/reg
app.use('/user', userRouter);
app.use('/ajax', ajaxRouter);
app.use('/pro', proRouter);
