import mysql from 'mysql';
import { MYSQL_DB, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_LOGIN, MYSQL_PORT } from '../config/constant';

// Sequelize can't create a database, so we should create it if it does not exist

export default function() {
  const connection = mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_LOGIN,
    port: MYSQL_PORT,
    password: MYSQL_PASSWORD,
  });
  
  connection.connect();
  connection.query(`CREATE DATABASE IF NOT EXISTS ${MYSQL_DB}`, function (err, rows, fields) {
    if (err) throw err;
    console.log(err, rows, fields);
  });
  
  connection.end();
}
