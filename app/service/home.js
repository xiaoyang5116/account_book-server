'use strict';

const { Service } = require('egg')

class HomeService extends Service {
  async user() {
    const { app } = this
    const sql = 'select * from user'
    try {
      const result = await app.mysql.query(sql)
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

module.exports = HomeService