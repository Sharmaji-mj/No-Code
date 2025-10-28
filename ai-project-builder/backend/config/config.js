// backend/config/config.js
module.exports = {
  development: {
    url: 'postgres://postgres:mj_postgre@db:5432/codeAlchemy',
    dialect: 'postgres',
    logging: false
  },
  test: {
    url: 'postgres://postgres:mj_postgre@db:5432/codeAlchemy',
    dialect: 'postgres',
    logging: false
  },
  production: {
    url: 'postgres://postgres:mj_postgre@db:5432/codeAlchemy',
    dialect: 'postgres',
    logging: false
  }
};
