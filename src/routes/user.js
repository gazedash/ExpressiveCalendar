import Joi from 'joi';
import { UserRepository } from '../repositories';
import {
  USER_ENDPOINT,
  USER_LOGIN_ENDPOINT,
} from '../config/endpoints';
import {
  USER_EMAIL_MIN_LENGTH,
  USER_EMAIL_MAX_LENGTH,
  USER_USERNAME_MIN_LENGTH,
  USER_USERNAME_MAX_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
  USER_PASSWORD_MAX_LENGTH,
} from '../config/rules';

export default (createRoute) => {
  createRoute({
    method: 'GET',
    path: `${USER_ENDPOINT}/:username`,
    auth: false,
    validation: {
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
            code: '404',
            message: 'No such username',
          }
        });
      } else {
        res.status(200).json({ user });
      }
    },
  });
  
  createRoute({
    method: 'GET',
    path: `${USER_ENDPOINT}`,
    async handler(req, res) {
      const user = await UserRepository.find(req.query.id);
  
      if (!user) {
        res.status(400).json({
          error: {
            code: '403',
            message: 'Not authorized',
          }
        });
      } else {
        res.json(user);
      }
    },
  });
  
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
      const user = await UserRepository.findByEmail(req.body.email);
      if (!user) {
        res.status(400).json({});
      } else {
        res.status(200).json(user);
      }
    },
  })
};
