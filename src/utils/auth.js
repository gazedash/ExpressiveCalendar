import _ from 'lodash';
import { verify } from '../utils/jwt';
import { hash } from '../utils/bcrypt';
import { UserRepository } from '../repositories';
import redis from '../redis';

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
      const isBlacklisted = !!(_.max(_.range(7).map((day) => {
        const hashToken = hash(token);
        return redis.sismember(`blacklist${day}`, hashToken);
      })));
      if (user && !isBlacklisted) {
        req.user = user;
        return next(res.status(200).json({ success: true, code: 200, message: 'Continue' }));
      }
      return next(res.status(403).json({ success: false, code: 403, message: 'Blacklisted token' }));
    }).catch(next);
  };
};
