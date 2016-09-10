import Sequelize from 'sequelize';
import { DB_URL } from '../config/constant';
import createDatabase from '../utils/db';

const sequelize = new Sequelize(DB_URL);

export function sequelizeConnect() {
  createDatabase().then(function() {
    sequelize
      .authenticate()
      .then(() => {
        console.log('Connection to the database has been established successfully.');
        sequelize.sync();
      });
  });
}

export default sequelize;
