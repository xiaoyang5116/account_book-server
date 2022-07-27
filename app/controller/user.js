'use strict'

const { Controller } = require('egg')


// 默认头像
const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png'

class UserController extends Controller {

  // 注册
  async register() {
    const { ctx } = this
    // 获取 注册需要的信息
    const { username, password } = ctx.request.body

    if (!username || !password) {
      ctx.body = {
        code: 500,
        msg: '账号密码不能为空',
        data: null
      }
      return
    }

    // 验证数据库内是否已经有该账户名
    const userInfo = await ctx.service.user.getUserByName(username)
    if (userInfo && userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账户名已被注册,请重新输入',
        data: null
      }
      return
    }

    // 向数据库添加用户
    const result = await ctx.service.user.register({
      username,
      password,
      signature: '世界和平。',
      avatar: defaultAvatar,
      create_time: new Date()
    })
    if (result) {
      ctx.body = {
        code: 200,
        msg: '注册成功',
        data: null
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '注册失败',
        data: null
      }
    }

  }

  // 登陆
  async login() {
    const { ctx, app } = this
    const { username, password } = ctx.request.body

    // 先根据 username 查找用户信息
    const userInfo = await ctx.service.user.getUserByName(username)
    // 没有,则说明用户不存在
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账号不存在',
        data: null
      }
      return
    }

    // 找到用户，并且判断输入密码与数据库中用户密码。
    if (userInfo && password != userInfo.password) {
      ctx.body = {
        code: 500,
        msg: '账号密码错误',
        data: null
      }
      return
    }

    // 生成 token 加盐
    // app.jwt.sign 方法接受两个参数，第一个为对象，对象内是需要加密的内容；第二个是加密字符串
    const token = app.jwt.sign({
      id: userInfo.id,
      username: userInfo.username,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)  // token 有效期为 24 小时
    }, app.config.secret)

    ctx.body = {
      code: 200,
      message: '登录成功',
      data: {
        token
      },
    };
  }

  // 验证 token
  async test() {
    const { ctx, app } = this;
    // 通过 token 解析，拿到 user_id
    const token = ctx.request.header.authorization;  // 请求头获取 authorization 属性，值为 token
    // 通过 app.jwt.verify + 加密字符串 解析出 token 的值 
    const decode = app.jwt.verify(token, app.config.jwt.secret);
    // 响应接口
    ctx.body = {
      code: 200,
      msg: '获取成功',
      data: {
        ...decode
      }
    }
  }

  // 获取用户信息
  async getUserInfo() {
    const { ctx, app } = this
    const token = ctx.request.header.authorization
    // 通过 app.jwt.verify 方法，解析出 token 内的用户信息
    const decode = app.jwt.verify(token, app.config.secret)
    // 通过 getUserByName 方法，以用户名 decode.username 为参数，从数据库获取到该用户名下的相关信息
    const userInfo = await ctx.service.user.getUserByName(decode.username)
    // userInfo 中应该有密码信息，所以我们指定下面四项返回给客户端
    ctx.body = {
      code: 200,
      msg: "请求成功",
      data: {
        id: userInfo.id,
        username: userInfo.username,
        signature: userInfo.signature,
        avatar: userInfo.avatar
      }
    }
  }
}

module.exports = UserController
