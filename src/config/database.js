import Sequelize from 'sequelize';
import * as cfg from './constant';

export default new Sequelize(
    cfg.MYSQL_DB,
    cfg.MYSQL_LOGIN,
    cfg.MYSQL_PASSWORD,
  {
    host: cfg.MYSQL_HOST,
    port: cfg.MYSQL_PORT,
    dialect: cfg.DB_DIALECT,
  }
);
