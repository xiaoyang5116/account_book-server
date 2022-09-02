'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret);  // 传入加密字符串

  // 查询 用户表
  router.get('/', controller.home.index);
  // 获取用户信息
  router.get('/api/user/get_userinfo', _jwt, controller.user.getUserInfo);
  // 验证 token
  router.get('/api/user/test', _jwt, controller.user.test);  // 放入第二个参数，作为中间件过滤项

  // 注册
  router.post('/api/user/register', controller.user.register);
  // 登陆
  router.post('/api/user/login', controller.user.login);
  // 修改用户个性签名
  router.post('/api/user/edit_userinfo', _jwt, controller.user.editUserInfo);
  // 上传图片
  router.post('/api/upload', controller.upload.upload)

  // bill 账单
  router.post('/api/bill/add', _jwt, controller.bill.add)
  router.get('/api/bill/list', _jwt, controller.bill.list)

};
