const express=require('express');
//引入连接池模块
const pool=require('../pool.js');
//console.log(pool);
//创建路由器对象
const router=express.Router();
//往路由器对象添加路由
//1.用户注册路由  post  /reg
router.post('/reg',(req,res)=>{
  //1.1获取post传递的数据
  let obj=req.body;
  console.log(req.body);
  //1.2检测各项数据是否为空
  if(!obj.uname){
    res.send({code:401,msg:'uname required'});
	return; //阻止往后执行
  }
  if(!obj.upwd){
    res.send({code:402,msg:'upwd required'});
	return;
  }
  if(!obj.email){
    res.send({code:403,msg:'email required'});
	return;
  }
  if(!obj.phone){
    res.send({code:404,msg:'phone required'});
	return;
  }
  //1.3执行SQL语句
  pool.query('INSERT INTO xz_user SET ?',[obj],(err,result)=>{
    if(err) throw err;
	console.log(result);
	res.send({code:200,msg:'reg success'});
  });  
});
//2.用户登录路由 post  /login
router.post('/login',(req,res)=>{
  //2.1获取post传递数据
  let obj=req.body;
  console.log(obj);
  //2.2检测数据是否为空
  if(!obj.uname){
    res.send({code:401,msg:'uname required'});
	return;
  }
  if(!obj.upwd){
    res.send({code:402,msg:'upwd required'});
	return;
  }
  //2.3执行SQL语句
  pool.query('SELECT * FROM xz_user WHERE uname=? AND upwd=?',[obj.uname,obj.upwd],(err,result)=>{
    if(err) throw err;
	console.log(result);
	//返回的是数组，如果数组长度为0说明登录失败，否则登录成功
	if(result.length===0){
	  res.send({code:301,msg:'login err'});
	}else{
	  res.send({code:200,msg:'login suc'});
	}
  });
});
//3.修改用户资料 post  /update
router.post('/update',(req,res)=>{
  //3.1获取post传递的数据
  let obj=req.body;
  console.log(obj);
  //3.2检测数据是否为空
  //使用for-in循环，批量验证
  //声明变量用于记录状态码
  let i=400;
  for(let key in obj){
	//遍历到每一项加1
	i++;
	//obj[key]代表表单中的值   key代表表单的每一项名称
    //console.log(key,obj[key]);
	//如果表单的值为空，则提示该项不能为空
	if(!obj[key]){
	  res.send({code:i,msg:key+' required'});
	  return;
	}
  }
  //3.3执行SQL语句
  //修改成功，响应200，失败响应301
  pool.query('UPDATE xz_user SET ? WHERE uid=?',[obj,obj.uid],(err,result)=>{
    if(err) throw err;
	console.log(result);
	//result为对象
	//如果result下的affectedRows为0，修改失败；否则修改成功
	if(result.affectedRows===0){
	  res.send({code:301,msg:'update err'});
	}else{
	  res.send({code:200,msg:'update suc'});
	}
  });
});
//4.用户列表  get  /list
router.get('/list',(req,res)=>{
  //4.1获取查询字符串传递的数据
  let obj=req.query;
  //4.2如果值为空设置默认值
  //如果页码为空，默认值为1
  if(!obj.pno) obj.pno=1;
  //如果每页大小为空，设置默认值为5
  if(!obj.count) obj.count=5;
  console.log(obj);
  //4.3计算开始查询的值
  let start=(obj.pno-1)*obj.count;
  //4.4把每页大小转为数值型
  let size=parseInt(obj.count);
  //4.5执行SQL语句
  pool.query('SELECT * FROM xz_user LIMIT ?,?',[start,size],(err,result)=>{
    if(err) throw err;
	console.log(result);
	//把查询的数据直接响应给浏览器
    res.send(result);
  });
});
//5.检索用户  get  /detail
router.get('/detail',(req,res)=>{
  //5.1获取查询字符串数据
  let obj=req.query;
  console.log(obj);
  //5.2检测数据是否为空
  if(!obj.uid){
    res.send({code:401,msg:'uid requried'});
	return;
  }
  //5.3执行SQL语句，查询编号对应的数据，并响应数据到浏览器端
  pool.query('SELECT * FROM xz_user WHERE uid=?',[obj.uid],(err,result)=>{
    if(err) throw err;
	res.send(result);
  });
});
//路由器对象导出
module.exports=router;