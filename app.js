const Koa = require('koa');
const app = new Koa();
const ejs=require('ejs');
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');
const router = require('koa-router')();
const views = require('koa-views');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const koaStatic = require('koa-static');
const logger = require('koa-logger');

//引入配置文件
var config = require('./config/index');

const routes = require('./routes/index');
//log工具
const logUtil = require('./utils/log_util');

const response_formatter = require('./middlewares/response_formatter');


// session存储配置
const sessionMysqlConfig= {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST,
}

// 配置session中间件
app.use(session({
  key: 'USER_SID',
  store: new MysqlStore(sessionMysqlConfig)
}))

// 配置静态资源加载中间件
app.use(koaStatic(__dirname + '/public'));

// 配置服务端模板渲染引擎中间件
app.use(views(__dirname + '/views', {
  extension: 'ejs'
}));

// middlewares
app.use(logger());

// logger
app.use(async (ctx, next) => {
  //响应开始时间
  const start = new Date();
  //响应间隔时间
  var ms;
  try {
    //开始进入到下一个中间件
    await next();

    ms = new Date() - start;
    //记录响应日志
    logUtil.logResponse(ctx, ms);

  } catch (error) {
    
    ms = new Date() - start;
    //记录异常日志
    logUtil.logError(ctx, error, ms);
  }

});

app.use(bodyparser());
//添加格式化处理响应结果的中间件，在添加路由之前调用
//仅对/api开头的url进行格式化处理
// app.use(response_formatter('^/api'));

router.use('/',routes.routes(), routes.allowedMethods());

app.use(router.routes(), router.allowedMethods());
// response
app.on('error', function(err, ctx){
  console.log(err)
  logger.error('server error', err, ctx);
});


module.exports = app;