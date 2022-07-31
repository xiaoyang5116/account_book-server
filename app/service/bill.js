'use strict'

const { Service } = require('egg')


class BillService extends Service {
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
}

module.exports = BillService;