import Joi from 'joi';
import { EventRepository } from '../repositories';
import { EVENT_ENDPOINT } from '../config/endpoints';
import {
  EVENT_SLUG_MIN_LENGTH,
  EVENT_SLUG_MAX_LENGTH,
} from '../config/rules';

export default (createRoute) => {
  createRoute({
    method: 'GET',
    path: `${EVENT_ENDPOINT}/:slug`,
    auth: false,
    validation: {
      params: {
        slug: Joi.string()
          .min(EVENT_SLUG_MIN_LENGTH)
          .max(EVENT_SLUG_MAX_LENGTH)
          .required(),
      },
    },
    async handler(req, res) {
      const exists = await EventRepository.exists(req.params.slug);
      res.status(exists ? 200 : 404).json({ exists });
    },
  });
  
  createRoute({
    method: 'GET',
    path: `${EVENT_ENDPOINT}`,
    async handler(req, res) {
      const user = await EventRepository.find(req.query.id);
      res.json(user);
    },
  });
  
  createRoute({
    method: 'POST',
    path: `${EVENT_ENDPOINT}`,
    auth: false,
    validation: {
      body: {
        slug: Joi.string()
          .min(EVENT_SLUG_MIN_LENGTH)
          .max(EVENT_SLUG_MAX_LENGTH)
          .required(),
      },
    },
    async handler(req, res) {
      const user = await EventRepository.create(req.body);
      if (!user) {
        res.status(400).json({});
      } else {
        res.status(201).json(user);
      }
    },
  });
};
