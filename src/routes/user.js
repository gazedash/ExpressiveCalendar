import Joi from 'joi';
import { UserRepository } from '../repositories';
import { USER_ENDPOINT } from '../config/endpoints';
import {
  USER_EMAIL_MIN_LENGTH,
  USER_EMAIL_MAX_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
  USER_PASSWORD_MAX_LENGTH,
} from '../config/rules';

export default (createRoute) => {
  createRoute({
    method: 'GET',
    path: `${USER_ENDPOINT}/:email`,
    auth: false,
    validation: {
      params: {
        email: Joi.string()
          .min(USER_EMAIL_MIN_LENGTH)
          .max(USER_EMAIL_MAX_LENGTH)
          .email().required(),
      },
    },
    async handler(req, res) {
      const exists = await UserRepository.exists(req.params.email);
      res.status(exists ? 200 : 404).json({ exists });
    },
  });
  
  createRoute({
    method: 'GET',
    path: `${USER_ENDPOINT}`,
    async handler(req, res) {
      const user = await UserRepository.find(req.query.id);
      res.json(user);
    },
  });
  
  createRoute({
    method: 'POST',
    path: `${USER_ENDPOINT}`,
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
      const user = await UserRepository.create(req.body);
      if (!user) {
        res.status(400).json({});
      } else {
        res.status(201).json(user);
      }
    },
  });
};
