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

    // 获取 日期date、 分页数据、 类型 type_id
    const { date, page = 1, page_size = 5, type_id = "all" } = ctx.query

    try {
      const token = ctx.request.header.authorization
      const decode = app.jwt.verify(token, app.config.jwt.secret)

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

      // 格式化数据，将其变成我们之前设置好的对象格式
      let listMap = _list.reduce((curr, item) => {
        // curr 默认初始值是一个空数组 []
        // 把第一个账单项的时间格式化为 YYYY-MM-DD
        const _date = moment(Number(item.date)).format('YYYY-MM-DD')

        // 如果能在累加的数组中找到当前项日期 date，那么在数组中的加入当前项到 bills 数组。
        if (curr && curr.length && curr.findIndex(item => item.date === _date) > -1) {
          const index = curr.findIndex(item => item.date == _date)
          curr[index].bills.push(item)
        }
        // 如果在累加的数组中找不到当前项日期的，那么再新建一项。
        if (curr && curr.length && curr.findIndex(item => item.date === _date) === -1) {
          curr.push({
            date: _date,
            bills: [item]
          })
        }
        // 如果 curr 为空数组，则默认添加第一个账单项 item ，格式化为下列模式
        if (!curr.length) {
          curr.push({
            date: _date,
            bills: [item]
          })
        }

        return curr

      }, []).sort((a, b) => moment(b.date) - moment(a.date)) // 时间顺序为倒叙，时间约新的，在越上面

      // 分页处理
      const filterListMap = listMap.slice((page - 1) * page_size, page * page_size)

      // 计算当月总收入和支出
      // 首先获取当月所有账单列表
      let __list = list.filter(item => moment(Number(item.date)).format('YYYY-MM') == date)
      // 累加计算支出
      let totalExpense = __list.reduce((curr, item) => {
        if (item.pay_type == 1) {
          curr += Number(item.amount)
          return curr
        }
        return curr
      }, 0)
      // 累加计算收入
      let totalIncome = __list.reduce((curr, item) => {
        if (item.pay_type == 2) {
          curr += Number(item.amount)
          return curr
        }
        return curr
      }, 0)

      // 返回数据
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          totalExpense, // 当月支出
          totalIncome, // 当月收入
          totalPage: Math.ceil(listMap.length / page_size), // 总分页
          list: filterListMap || [] // 格式化后，并且经过分页处理的数据
        }
      }

    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null
      }
    }
  }

  // 获取账单详情
  async detail() {
    const { ctx, app } = this
    const { id = '' } = ctx.query
    const token = ctx.request.header.authorization;
    // 获取当前用户信息
    const decode = app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) return
    // 判断是否传入账单 id
    if (!id) {
      ctx.body = {
        code: 500,
        msg: '订单id不能为空',
        data: null
      }
      return
    }

    try {
      // 从数据库获取账单详情
      const detail = await ctx.service.bill.detail(id, decode.id)
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: detail
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
