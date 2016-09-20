import Joi from 'joi';
import { GROUP_ENDPOINT } from '../config/endpoints';
import {
  GROUP_SLUG_MIN_LENGTH,
  GROUP_SLUG_MAX_LENGTH,
} from '../config/rules';
import { addGroupSchedule, getGroupSchedule } from '../utils/schedule';

export default (createRoute) => {
  // Get calendar by slug
  createRoute({
    method: 'GET',
    auth: false,
    path: `${GROUP_ENDPOINT}/:group`,
    validation: {
      params: {
        group: Joi.string()
          .min(GROUP_SLUG_MIN_LENGTH)
          .max(GROUP_SLUG_MAX_LENGTH)
          .required(),
      },
    },
    async handler(req, res) {
      addGroupSchedule(req.params.group);
      return getGroupSchedule(req.params.group).then((data) => {
        if (data) {
          return res.status(200).json({ code: 200, success: true, payload: data })
        }
        return res.status(400).json({ code: 400, success: false, message: 'Schedule is unavailible for this group' });
      });
    },
  });
};
