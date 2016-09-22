import _ from 'lodash';
import { verify } from '../utils/jwt';
import { hash } from '../utils/crypto';
import { UserRepository } from '../repositories';
import redis from '../redis';

const Promise = require('bluebird');

export function getToken(req) {
  if (req.headers.authorization) {
    const parts = req.headers.authorization.split(' ', 2);
    if (parts[0].toLowerCase() === 'bearer') {
      return parts[1];
    }
  }

  if (req.query.token) {
    return req.query.token;
  }

  return null;
}

function isBlacklisted(hashToken) {
  const blacklistChecks = _.range(7).map((day) => {
    return redis.sismemberAsync(`blacklist${day}`, hashToken);
  });
  return Promise.all(blacklistChecks);
}

export default () => {
  return function auth(req, res, next) {
    const token = getToken(req);
    console.log('token', token);
    if (!token) {
      return next(res.status(400).json(({
        success: false, code: 400, message: 'Token not found',
      })));
    }
    verify(token).then(
      (payload) => UserRepository.find(payload.id),
      () => {
        return next(res.status(401).json({
          success: false, code: 401, message: 'Malformed token',
        }));
      }
    ).then((user) => {
      const hashToken = hash(token);
      return isBlacklisted(hashToken).then((result) => {
        if (user && !_.max(result)) {
          req.user = user;
          return next();
        }

        return next(res.status(403).json({
          success: false,
          code: 403,
          message: 'Blacklisted token',
        }));
      });
    }).catch(next);
  };
};
