const userModel=require('../../db/model');
const md5 = require('md5');
const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');

//获取用户
exports.getUserLogin = async (ctx, next) => {
  if (ctx.session && ctx.session.user) {
    ctx.redirect('/posts');
    return false;
  }
  await ctx.render('login', {
    session:ctx.session
  })
}

//用户登录
exports.loginUser = async (ctx, next) => {
  let name=ctx.request.body.name;
  let pass=ctx.request.body.password;
  await userModel.findDataByName(name)
    .then(result =>{
      let res=JSON.parse(JSON.stringify(result))
      if (name === res[0]['name'] && md5(pass) === res[0]['pass']) {
        ctx.body='true'
        ctx.session.user=res[0]['name']
        ctx.session.id=res[0]['id']
        console.log('ctx.session.id',ctx.session.id)
        console.log('session',ctx.session)
        console.log('登录成功')
      }
    }).catch(err=>{
      ctx.body='false'
      console.log('用户名或密码错误!')
    })
}

//获取用户
exports.getUserRegister = async (ctx, next) => {
  if (ctx.session && ctx.session.user) {
    ctx.redirect('/posts');
    return false;
  }
  await ctx.render('register', {
    session:ctx.session
  })
}

//用户注册
exports.registerUser = async (ctx, next) => {
  let user={
    name:ctx.request.body.name,
    pass:ctx.request.body.password,
    repeatpass:ctx.request.body.repeatpass
  }
  await userModel.findDataByName(user.name)
    .then(result=>{
      // let res=JSON.parse(JSON.stringify(reslut))
      console.log(result)
      if (result.length){
        try {
          throw Error('用户存在')
        }catch (error){
          //处理err
          console.log(error)  
        }
        ctx.body={
          data:1
        };;
      }else if (user.pass!==user.repeatpass || user.pass==''){          
        ctx.body={
          data:2
        };
      }else{
        ctx.body={
          data:3
        };
        console.log('注册成功')
        // ctx.session.user=ctx.request.body.name
        userModel.insertData([ctx.request.body.name,md5(ctx.request.body.password)])
      }
    })
}

//用户退出
exports.logoutUser = async (ctx, next) => {
  ctx.session=null;
  console.log('登出成功')
  ctx.body='true';
}