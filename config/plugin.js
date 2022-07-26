'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  // 开启 egg-mysql 插件
  mysql: {
    enable: true,
    package: 'egg-mysql'
  },

  // 开启 egg-jwt
  jwt: {
    enable: true,
    package: 'egg-jwt'
  }
};
