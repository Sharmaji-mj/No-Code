// backend/config/config.js
require('dotenv').config();

const cfg = {
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'aibuilder',
  host:     process.env.DB_HOST || 'db',
  port:     Number(process.env.DB_PORT || 5432),
  dialect:  'postgres',
  logging:  false,
  dialectOptions: { connectTimeout: 15000 },
};

module.exports = {
  development: cfg,
  test:        cfg,
  production:  cfg,
};
