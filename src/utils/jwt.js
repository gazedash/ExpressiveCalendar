const Promise = require('bluebird');
const jwt = Promise.promisifyAll(require('jsonwebtoken'));

const SECRET = 'calendar_secret';

export function verify(token) {
  return jwt.verifyAsync(token, SECRET, {
    algorithms: 'HS256',
  });
}

export function sign(payload) {
  return jwt.sign(payload, SECRET, {
    algorithm: 'HS256',
    expiresIn: '7 days',
  });
}
