'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    try {
      const result = await ctx.service.home.user()
      ctx.body = result
    } catch (error) {
      console.log(error);
      ctx.body = {
        msg: "查询user表失败"
      }
    }

  }
}

module.exports = HomeController;
