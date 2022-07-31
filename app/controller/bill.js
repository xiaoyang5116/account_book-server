'use strict'

const { Controller } = require('egg')
const moment = require('moment');


class BillController extends Controller {
  async add() {
    const { ctx, app } = this

    const { amount, type_id, date, pay_type, remark = '' } = ctx.request.body
    // 判空处理，这里前端也可以做，但是后端也需要做一层判断。
    if (!amount || !type_id || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null
      }
    }
    try {
      const token = ctx.request.header.authorization
      const decode = app.jwt.verify(token, app.config.jwt.secret)
      if (!decode) return
      const result = await ctx.service.bill.add({
        amount,
        type_id,
        date,
        pay_type,
        remark,
        user_id: decode.id,
      });
      if (result === null) {
        ctx.body = {
          code: 400,
          msg: '添加失败',
          data: null
        }
      }
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: null
      }

    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null
      }
    }
  }
}

module.exports = BillController
