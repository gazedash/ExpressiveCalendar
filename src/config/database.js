import Sequelize from 'sequelize';
import * as cfg from './constant';

// const db = 'mysql://root:my-secret-pw@127.0.0.1:6603/calendar?password=my-secret-pw';

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
