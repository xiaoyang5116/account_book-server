/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1443584075';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',

    // 设置图片存放路径
    uploadDir: 'app/public/upload'
  };

  // 本地使用 非本机 或者 例如：ApiFox、Postman，发送 post 请求 都会触发安防策略。
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ['*'], // 配置白名单
  }

  // 添加 mysql 连接配置
  config.mysql = {
    client: {
      // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: '123456',
      // 数据库名
      database: 'account_book',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  }

  // 添加自定义加密字符串
  config.jwt = {
    secret: 'shawnYang_123456',
  };

  // 设置文件接收方式
  config.multipart = {
    mode: 'file'
  };

  // 配置跨域
  config.cors = {
    origin: '*', // 允许所有跨域访问
    credentials: true, // 允许 Cookie 跨域跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };


  return {
    ...config,
    ...userConfig,
  };
};
