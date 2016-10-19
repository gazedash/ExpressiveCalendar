import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { API_PORT } from './config/constant';
import attachRoutes from './routes';
import { sequelizeConnect } from './utils/sequelize';
import { checkRedis } from './redis';
import { load } from './fixtures/fixtures';

const app = express();

// Check redis connection
checkRedis();
// Check connection and create db;
sequelizeConnect();
// Configure app to use bodyParser(). Important: init it before routes!
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '3mb' }));

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: true,
}));

attachRoutes(app);

app.listen(API_PORT, () => {
  console.log('Server listening at port %d', API_PORT, new Date());
});

load();
