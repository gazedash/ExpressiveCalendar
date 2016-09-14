import fs from 'fs';
import path from 'path';
import auth from '../utils/auth';
import validation from '../utils/validation';

const routes = fs.readdirSync(__dirname)
  .map((file) => path.join(__dirname, file))
  .filter((file) => file !== __filename)
  .map((file) => require(file));

function attachRoutes(app) {
  function createRoute(options) {
    const method = (options.method || 'get').toLowerCase();
    const args = [options.path];
    if (options.auth !== false) {
      args.push(auth());
    }

    if (options.validation) {
      args.push(validation(options.validation));
    }

    args.push((req, res, next) => {
      options.handler(req, res).catch(next);
    });

    app[method](...args);
  }

  routes.forEach((route) => {
    route.default(createRoute);
  });
}

export default attachRoutes;
