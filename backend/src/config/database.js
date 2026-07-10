require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'pharma_erp_dev',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || null,
  {
    host:    process.env.DB_HOST || '127.0.0.1',
    port:    parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max:     10,
      min:     0,
      acquire: 30000,
      idle:    10000,
    },
    define: {
      underscored:   true,
      freezeTableName: false,
      timestamps:    true,
    },
  }
);

module.exports = sequelize;
