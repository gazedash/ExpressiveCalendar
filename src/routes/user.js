import Joi from 'joi';
import omit from 'lodash/omit';
import { UserRepository } from '../repositories';
import { sign } from '../utils/jwt';
import { getToken } from '../utils/auth';
import { hash } from '../utils/crypto';
import redis from '../redis';
import {
  USER_ENDPOINT,
  USER_LOGIN_ENDPOINT,
  USER_LOGOUT_ENDPOINT,
  USER_REGISTER_ENDPOINT,
} from '../config/endpoints';
import {
  USER_FIRSTNAME_MIN_LENGTH,
  USER_FIRSTNAME_MAX_LENGTH,
  USER_SECONDNAME_MIN_LENGTH,
  USER_SECONDNAME_MAX_LENGTH,
  USER_GROUP_MIN_LENGTH,
  USER_GROUP_MAX_LENGTH,
  USER_EMAIL_MIN_LENGTH,
  USER_EMAIL_MAX_LENGTH,
  USER_INFORMATION_MIN_LENGTH,
  USER_INFORMATION_MAX_LENGTH,
  USER_USERNAME_MIN_LENGTH,
  USER_USERNAME_MAX_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
  USER_PASSWORD_MAX_LENGTH,
  USER_TOKEN_BLACKLIST_TTL,
} from '../config/rules';
import { addGroupSchedule } from '../utils/schedule';

export default (createRoute) => {
  // Get authorized profile
  createRoute({
    method: 'GET',
    path: `${USER_ENDPOINT}`,
    auth: true,
    async handler(req, res) {
      const user = await UserRepository.findByEmail(req.user.email);
      if (!user) {
        res.status(400).json({
          error: {
            success: false,
            code: '403',
            message: 'Not authorized',
          },
        });
      } else {
        res.json({ code: 200, success: true, payload: user });
      }
    },
  });

  // Update authorized profile
  createRoute({
    method: 'POST',
    path: `${USER_ENDPOINT}`,
    auth: true,
    async handler(req, res) {
      const user = await UserRepository.findByEmail(req.user.email);
      console.log('!!user', !!user);
      if (!user) {
        res.status(403).json({
          error: {
            success: false,
            code: '403',
            message: 'Not authorized',
          },
        });
      } else {
        res.json({ code: 200, success: true, payload: user });
      }
    },
  });

  // Delete authorized profile
  createRoute({
    method: 'DELETE',
    path: `${USER_ENDPOINT}`,
    auth: true,
    async handler(req, res) {
      const user = await UserRepository.remove(req.user.email);
      console.log('!!user', !!user);
      if (!user) {
        res.status(400).json({
          error: {
            success: false,
            code: '400',
            message: 'Bad request',
          },
        });
      } else {
        res.status(200).json({
          code: '200',
          message: 'Account deleted',
        });
      }
    },
  });

  // Get someone's profile
  createRoute({
    method: 'GET',
    path: `${USER_ENDPOINT}/:username`,
    auth: false,
    validation: {
      // TODO: how to determine that it's my account?
      params: {
        username: Joi.string()
          .min(USER_USERNAME_MIN_LENGTH)
          .max(USER_USERNAME_MAX_LENGTH)
          .required(),
      },
    },
    async handler(req, res) {
      const user = await UserRepository.findByUsername(req.params.username);
      if (!user) {
        res.status(404).json({
          error: {
            success: false,
            code: '404',
            message: 'No such username',
          },
        });
      } else {
        res.status(200).json({ code: 200, success: true, payload: omit(user, 'password') });
      }
    },
  });

  // Login profile
  createRoute({
    method: 'POST',
    path: `${USER_LOGIN_ENDPOINT}`,
    auth: false,
    validation: {
      body: {
        email: Joi.string()
          .min(USER_EMAIL_MIN_LENGTH)
          .max(USER_EMAIL_MAX_LENGTH)
          .email().required(),
        password: Joi.string()
          .min(USER_PASSWORD_MIN_LENGTH)
          .max(USER_PASSWORD_MAX_LENGTH)
          .required(),
      },
    },
    async handler(req, res) {
      const user = await UserRepository.authorize(req.body.email, req.body.password);
      if (!user) {
        res.status(400).json({
          success: false,
          code: '400',
          message: 'Wrong credentials',
        });
      }
      console.log('user.id', user.id);
      const token = sign({
        id: user.id,
        username: user.username,
      });
      res.status(200).json({ code: 200, success: true, token, payload: omit(user, 'password') });
    },
  });

  // Logout profile
  createRoute({
    method: 'POST',
    path: `${USER_LOGOUT_ENDPOINT}`,
    auth: true,
    validation: {
      body: {
        // email: Joi.string()
        //   .min(USER_EMAIL_MIN_LENGTH)
        //   .max(USER_EMAIL_MAX_LENGTH)
        //   .email().required(),
        // password: Joi.string()
        //   .min(USER_PASSWORD_MIN_LENGTH)
        //   .max(USER_PASSWORD_MAX_LENGTH)
        //   .required(),
      },
    },
    async handler(req, res) {
      const token = getToken(req);
      if (token) {
        const hashToken = hash(token);
        const day = new Date().getDay();
        // TODO: consider whitelists
        const category = `blacklist${day}`;
        redis.sadd(category, hashToken);
        redis.pttlAsync(category).then(result => {
          if (result === -1) {
            // Set TTL in milliseconds
            redis.pexpire(category, USER_TOKEN_BLACKLIST_TTL);
          }
        });
        res.status(200).json({ success: true, code: 200, message: 'Successful logout' });
      }
      res.status(400).json({ success: false, code: 400, message: 'Token is missing' });
    },
  });

  // Register new profile
  createRoute({
    method: 'POST',
    path: `${USER_REGISTER_ENDPOINT}`,
    auth: false,
    validation: {
      body: {
        // TODO: default cases, is exist
        email: Joi.string()
          .min(USER_EMAIL_MIN_LENGTH)
          .max(USER_EMAIL_MAX_LENGTH)
          .email()
          .required(),
        password: Joi.string()
          .min(USER_PASSWORD_MIN_LENGTH)
          .max(USER_PASSWORD_MAX_LENGTH)
          .required(),
        username: Joi.string()
          .min(USER_USERNAME_MIN_LENGTH)
          .max(USER_USERNAME_MAX_LENGTH),
        firstname: Joi.string()
          .min(USER_FIRSTNAME_MIN_LENGTH)
          .max(USER_FIRSTNAME_MAX_LENGTH)
          .required(),
        surname: Joi.string()
          .min(USER_SECONDNAME_MIN_LENGTH)
          .max(USER_SECONDNAME_MAX_LENGTH)
          .required(),
        group: Joi.string()
          .min(USER_GROUP_MIN_LENGTH)
          .max(USER_GROUP_MAX_LENGTH),
        information: Joi.string()
          .min(USER_INFORMATION_MIN_LENGTH)
          .max(USER_INFORMATION_MAX_LENGTH),
      },
    },
    async handler(req, res) {
      const exist = await UserRepository.exists({ email: req.body.email, username: req.body.username });
      if (!exist) {
        const user = await UserRepository.create(req.body);
        const token = sign({
          id: user.id,
          username: user.username,
        });
        addGroupSchedule(req.body.group);
        if (!user) {
          res.status(400).json({
            error: {
              success: false,
              code: '400',
              message: 'Bad request',
            },
          });
        } else {
          // res.status(200).json(user);
          res.status(200).json({ code: 200, success: true, token, payload: omit(user, 'password') });
        }
      }
      res.status(400).json({
        error: {
          success: false,
          code: '400',
          message: 'User with such email or username already exist',
        },
      });
    },
  });
};
