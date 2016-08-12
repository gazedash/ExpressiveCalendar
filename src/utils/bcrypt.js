const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));

export function hash(password) {
  return bcrypt.hashAsync(password, 10);
}

export function compare(password, hash) {
  return bcrypt.compareAsync(password, hash);
}
