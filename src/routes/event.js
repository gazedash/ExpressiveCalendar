import Joi from 'joi';
import { EventRepository } from '../repositories';
import { EVENT_ENDPOINT } from '../config/endpoints';
import {
  EVENT_SLUG_MIN_LENGTH,
  EVENT_SLUG_MAX_LENGTH,
} from '../config/rules';

export default (createRoute) => {
  // Get event by slug
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
      const event = await EventRepository.findBySlug(req.params.slug);
      if (event) {
        res.status(200).json({ code: 200, success: true, payload: event });
      }
      res.status(404).json({ code: 404, success: false, message: 'Event not found' });
    },
  });

  // TODO: update event

  // Create event
  createRoute({
    method: 'POST',
    path: `${EVENT_ENDPOINT}`,
    auth: true,
    validation: {
      body: {
        slug: Joi.string()
          .min(EVENT_SLUG_MIN_LENGTH)
          .max(EVENT_SLUG_MAX_LENGTH),
        name: Joi.string()
          .min(0)
          .max(100),
        week: Joi.string()
          .min(0)
          .max(5),
        weekday: Joi.number()
          .min(0)
          .max(6),
        time: Joi.string()
          .min(3)
          .max(5),
        place: Joi.string()
          .min(0)
          .max(100),
        isEven: Joi.boolean(),
        duration: Joi.string()
          .min(0)
          .max(5),
        leader: Joi.string()
          .min(0)
          .max(100),
        message: Joi.string()
          .min(0)
          .max(500),
      },
    },
    async handler(req, res) {
      const event = await EventRepository.create(req.body);
      if (!event) {
        res.status(400).json({ code: 400, success: false, message: 'Requirements are not met' });
      }
      res.status(200).json({ code: 200, success: true, payload: event });
    },
  });

  // Delete event by slug
  createRoute({
    method: 'DELETE',
    path: `${EVENT_ENDPOINT}/:slug`,
    auth: true,
    validation: {
      params: {
        slug: Joi.string()
          .min(EVENT_SLUG_MIN_LENGTH)
          .max(EVENT_SLUG_MAX_LENGTH)
          .required(),
      },
    },
    async handler(req, res) {
      const event = await EventRepository.findByUserIdAndSlug({ userId: req.user.id, slug: req.params.slug });
      if (!event) {
        res.status(400).json({ code: 400, success: false, message: 'Event not found' });
      }
      event.destroy();
      res.status(200).json({ code: 200, success: true, payload: event });
    },
  });
};
