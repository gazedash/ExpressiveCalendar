import Joi from 'joi';
import { CalendarRepository, UserRepository } from '../repositories';
import { CALENDAR_ENDPOINT } from '../config/endpoints';
import {
  CALENDAR_SLUG_MIN_LENGTH,
  CALENDAR_SLUG_MAX_LENGTH,
  CALENDAR_NAME_MIN_LENGTH,
  CALENDAR_NAME_MAX_LENGTH,
  CALENDAR_TYPE_MIN_LENGTH,
  CALENDAR_TYPE_MAX_LENGTH,
  CALENDAR_DESCRIPTION_MIN_LENGTH,
  CALENDAR_DESCRIPTION_MAX_LENGTH,
  CALENDAR_PRIVACY_MAX_LEVEL,
} from '../config/rules';

export default (createRoute) => {
  // Get calendar index
  createRoute({
    method: 'GET',
    path: `${CALENDAR_ENDPOINT}`,
    async handler(req, res) {
      const user = await UserRepository.findByEmail(req.user.id);
      const calendar = await CalendarRepository.findByUserIdAndType(user.id);
      res.json(calendar);
    },
  });
  
  // Get calendar by slug
  createRoute({
    method: 'GET',
    auth: false,
    path: `${CALENDAR_ENDPOINT}/:slug`,
    validation: {
      params: {
        slug: Joi.string()
          .min(CALENDAR_SLUG_MIN_LENGTH)
          .max(CALENDAR_SLUG_MAX_LENGTH)
          .required(),
      },
    },
    async handler(req, res) {
      // TODO: add private levels handling
      const calendar = await CalendarRepository.findBySlug(req.params.slug);
      res.status(calendar ? 200 : 404).json({ calendar });
    },
  });
  
  // Create calendar
  createRoute({
    method: 'POST',
    path: `${CALENDAR_ENDPOINT}`,
    validation: {
      body: {
        slug: Joi.string()
          .min(CALENDAR_SLUG_MIN_LENGTH)
          .max(CALENDAR_SLUG_MAX_LENGTH),
        name: Joi.string()
          .min(CALENDAR_NAME_MIN_LENGTH)
          .max(CALENDAR_NAME_MAX_LENGTH),
        description: Joi.string()
          .min(CALENDAR_DESCRIPTION_MIN_LENGTH)
          .max(CALENDAR_DESCRIPTION_MAX_LENGTH),
        type: Joi.string()
          .min(CALENDAR_TYPE_MIN_LENGTH)
          .max(CALENDAR_TYPE_MAX_LENGTH),
        privacy: Joi.number().integer()
          .min(0)
          .max(CALENDAR_PRIVACY_MAX_LEVEL),
      },
    },
    async handler(req, res) {
      const calendar = await CalendarRepository.create(req.body);
      if (!calendar) {
        res.status(400).json({});
      } else {
        res.status(201).json({ calendar });
      }
    },
  });
  
  // Update calendar by slug
  createRoute({
    method: 'PUT',
    path: `${CALENDAR_ENDPOINT}/:slug`,
    validation: {
      params: {
        slug: Joi.string()
          .min(CALENDAR_SLUG_MIN_LENGTH)
          .max(CALENDAR_SLUG_MAX_LENGTH)
          .required(),
      },
      body: {
        slug: Joi.string()
          .min(CALENDAR_SLUG_MIN_LENGTH)
          .max(CALENDAR_SLUG_MAX_LENGTH),
        name: Joi.string()
          .min(CALENDAR_NAME_MIN_LENGTH)
          .max(CALENDAR_NAME_MAX_LENGTH),
        description: Joi.string()
          .min(CALENDAR_DESCRIPTION_MIN_LENGTH)
          .max(CALENDAR_DESCRIPTION_MAX_LENGTH),
        type: Joi.string()
          .min(CALENDAR_TYPE_MIN_LENGTH)
          .max(CALENDAR_TYPE_MAX_LENGTH),
        privacy: Joi.number().integer()
          .min(0)
          .max(CALENDAR_PRIVACY_MAX_LEVEL),
      },
    },
    async handler(req, res) {
      const calendar = await CalendarRepository.update(req.body);
      if (!calendar) {
        res.status(400).json({});
      } else {
        res.status(201).json({ calendar });
      }
    },
  });
  
  // Delete calendar (from index)
  createRoute({
    method: 'DELETE',
    path: `${CALENDAR_ENDPOINT}`,
    validation: {
      body: {
        slug: Joi.string()
          .min(CALENDAR_SLUG_MIN_LENGTH)
          .max(CALENDAR_SLUG_MAX_LENGTH)
          .required(),
      },
    },
    async handler(req, res) {
      await CalendarRepository.remove(req.body.slug);
      res.json({});
    },
  });
  
  // Delete calendar ( index)
  createRoute({
    method: 'DELETE',
    path: `${CALENDAR_ENDPOINT}/:slug`,
    validation: {
      params: {
        slug: Joi.string()
          .min(CALENDAR_SLUG_MIN_LENGTH)
          .max(CALENDAR_SLUG_MAX_LENGTH)
          .required(),
      },
    },
    async handler(req, res) {
      await CalendarRepository.remove(req.params.slug);
      res.json({});
    },
  });
};
