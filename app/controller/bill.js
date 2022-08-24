'use strict'

const { Controller } = require('egg')
const moment = require('moment');


class BillController extends Controller {
  // 添加账单记录
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

  // 账单集合
  async list() {
    const { ctx, app } = this
    const { date, page = 1, page_size = 5, type_id = all } = ctx.query

    try {
      const token = ctx.request.header.authorization
      const decode = await app.jwt.verify(token, app.config.jwt.secret)
      if (!decode) return
      // 拿到当前用户的账单列表
      const list = await ctx.service.bill.list(decode.id)
      // 过滤出月份和类型所对应的账单列表
      const _list = list.filter(item => {
        if (type_id != 'all') {
          return moment(Number(item.date)).format('YYYY-MM') == date && type_id == item.type_id
        }
        return moment(Number(item.date)).format('YYYY-MM') == date
      })
    } catch (error) {

    }
  }
}

module.exports = BillController
