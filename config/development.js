/**
 * 开发环境的配置内容
 */

module.exports = {
  env: 'development', //环境名称
  port: 3001,         //服务端口号
  database: {         // 数据库配置
    DATABASE: 'koa2blog',
    USERNAME: 'root',
    PASSWORD: '',
    PORT: '3306',
    HOST: 'localhost'
  }
}