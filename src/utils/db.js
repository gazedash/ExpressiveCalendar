import mysql from 'mysql';
import { MYSQL_DB, MYSQL_HOST, MYSQL_LOGIN, MYSQL_PORT } from '../config/constant';

export default function () {
  const connection = mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_LOGIN,
    port: MYSQL_PORT,
    connectTimeout: 20000,
    idleTimeoutMillis: 30000,
    max: 30,
  });

  connection.connect();
  connection.query(`CREATE DATABASE IF NOT EXISTS ${MYSQL_DB}`, (err, rows, fields) => {
    if (err) throw err;
    console.log(err, rows, fields);
  });

  connection.end();

  return new Promise((resolve) => {
    resolve('Connection ready');
  });
}
