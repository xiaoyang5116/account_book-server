'use strict'

const { Service } = require('egg')


class BillService extends Service {
  // 添加账单
  async add(params) {
    const { app } = this
    try {
      // 往 bill 表中，插入一条账单数据
      const result = await app.mysql.insert('bill', params);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 获取账单列表
  async list(id) {
    const { ctx, app } = this
    const QUERY_STR = 'b.id, b.pay_type, b.amount, b.date, b.type_id, t.name, b.remark'
    let sql = `select ${QUERY_STR} from bill b,type t where b.type_id = t.id and b.user_id = ${id}`
    try {
      const result = await app.mysql.query(sql)
      return result
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = BillService;