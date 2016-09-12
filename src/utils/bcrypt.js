const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));

export function hash(data) {
  return bcrypt.hashAsync(data, 10);
}

export function compare(data, hash) {
  return bcrypt.compareAsync(data, hash);
}
