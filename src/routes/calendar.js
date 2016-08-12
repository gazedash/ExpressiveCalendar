import Joi from 'joi';
import { CalendarRepository } from '../repositories';
import { CALENDAR_ENDPOINT } from '../config/endpoints';
import {
  CALENDAR_SLUG_MIN_LENGTH,
  CALENDAR_SLUG_MAX_LENGTH,
} from '../config/rules';

export default (createRoute) => {
  createRoute({
    method: 'GET',
    path: `${CALENDAR_ENDPOINT}/:slug`,
    auth: false,
    validation: {
      params: {
        slug: Joi.string()
          .min(CALENDAR_SLUG_MIN_LENGTH)
          .max(CALENDAR_SLUG_MAX_LENGTH)
          .required(),
      },
    },
    async handler(req, res) {
      const exists = await CalendarRepository.exists(req.params.slug);
      res.status(exists ? 200 : 404).json({ exists });
    },
  });
  
  createRoute({
    method: 'GET',
    path: `${CALENDAR_ENDPOINT}`,
    async handler(req, res) {
      const calendar = await CalendarRepository.find(req.query.id);
      res.json(calendar);
    },
  });
  
  createRoute({
    method: 'POST',
    path: `${CALENDAR_ENDPOINT}`,
    auth: false,
    validation: {
      body: {
        slug: Joi.string()
          .min(CALENDAR_SLUG_MIN_LENGTH)
          .max(CALENDAR_SLUG_MAX_LENGTH)
          .required(),
      },
    },
    async handler(req, res) {
      const calendar = await CalendarRepository.create(req.body);
      if (!calendar) {
        res.status(400).json({});
      } else {
        res.status(201).json(calendar);
      }
    },
  });
};
