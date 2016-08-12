import express from 'express';
// import wrap from 'express-async-wrap';
// import * as v from './utils/validation';
// import logger from './utils/logger';
import { auth } from './utils/Auth';
import bodyParser from 'body-parser';
import * as h from './utils/Helper';
import cors from 'cors';
import { API_PORT } from './config/constant';
import createDatabase from './utils/db';
import attachRoutes from './routes';

const serveIndex = require('serve-index');
const app = express();

createDatabase();
attachRoutes(app);

app.listen(API_PORT, () => {
  console.log('Server listening at port %d', API_PORT, new Date());
});

app.use(cors({
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

app.use(auth);
app.use('/static', auth, express.static(h.getAssetsDir()));
app.use('/static', auth, serveIndex(h.getAssetsDir(), { 'icons': true }));
app.use(bodyParser.json());

// function onError(error) {
//   logger.error(error);
// }

// app.get('/api/users', wrap(async function (req, res) {
//   const { error, value } = v.users(req.query);
//   if (error) {
//     return res.send(error);
//   }
//   const userResp = await UserRepository.find(value);
//
//   return res.send({
//     totalCount: userResp.count,
//     rows: userResp.rows
//   });
// }));
//
// app.get('/api/calendar', wrap(async function (req, res) {
//   const data = await Calendar.findAndCountAll({
//     // where: {
//     // 	name: 'Математика'
//     // }
//   });
//   console.log(JSON.stringify(data));
//   return res.send(data);
// }));
//
// app.get('/logs', wrap(async function (req, res) {
//   const { error, value } = v.users(req.query);
//   if (error) {
//     return res.send(error);
//   }
//   const logResp = await LogRepository.find(value);
//   const rows = logResp.rows.map((item)=> {
//     item.data = JSON.parse(item.data);
//     return item;
//   });
//
//   return res.send({
//     totalCount: logResp.count,
//     rows: rows
//   });
// }));
