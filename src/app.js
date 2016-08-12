import wrap from 'express-async-wrap';
import express from 'express';
import * as v from './utils/validation';
import * as UserRepository from './repositories/UserRepository';
import * as LogRepository from './repositories/LogRepository';
import { auth } from './utils/Auth';
import bodyParser from 'body-parser';
import * as h from './utils/Helper';
import cors from 'cors';
import logger from './utils/logger';
import { API_PORT } from './config/constant';
import { Event, Calendar } from './model/entity';
import mysql from 'mysql';

const serveIndex = require('serve-index');
const app = express();

// const connection = mysql.createConnection({
// 	host: '127.0.0.1',
// 	user: 'root',
// 	port: '6603',
// 	password: 'my-secret-pw',
// });
//
// connection.connect();
// connection.query('CREATE DATABASE IF NOT EXISTS calendar', function (err, rows, fields) {
// 	if (err) throw err;
// 	console.log(err, rows, fields);
// });
//
// connection.end();

app.listen(API_PORT, function () {
	console.log('Server listening at port %d', API_PORT, new Date());
});

app.use(cors({
	"origin": "*",
	"methods": "GET,HEAD,PUT,PATCH,POST,DELETE"
}));

app.use(auth);
app.use('/static', auth, express.static(h.getAssetsDir()));
app.use('/static', auth, serveIndex(h.getAssetsDir(), { 'icons': true }));
app.use(bodyParser.json());

function onError(error) {
	logger.error(error);
}

app.get('/api/users', wrap(async function (req, res) {
	const { error, value } = v.users(req.query);
	if (error) {
		return res.send(error);
	}
	const userResp = await UserRepository.find(value);
	
	return res.send({
		totalCount: userResp.count,
		rows: userResp.rows
	});
}));

app.get('/api/calendar', wrap(async function (req, res) {
	const data = await Calendar.findAndCountAll({
		// where: {
		// 	name: 'Математика'
		// }
	});
	console.log(JSON.stringify(data));
	return res.send(data);
}));

app.get('/logs', wrap(async function (req, res) {
	const { error, value } = v.users(req.query);
	if (error) {
		return res.send(error);
	}
	const logResp = await LogRepository.find(value);
	const rows = logResp.rows.map((item)=> {
		item.data = JSON.parse(item.data);
		return item;
	});
	
	return res.send({
		totalCount: logResp.count,
		rows: rows
	});
}));