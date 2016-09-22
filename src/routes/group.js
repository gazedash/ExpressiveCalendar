import Joi from 'joi';
import { GROUP_ENDPOINT } from '../config/endpoints';
import {
  GROUP_SLUG_MIN_LENGTH,
  GROUP_SLUG_MAX_LENGTH,
} from '../config/rules';
import { addGroupSchedule, getGroupScheduleFromCache, getCurrentUrl } from '../utils/schedule';
import { getSchedule } from '../parser';
import { semester } from '../config/schedule';

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
      return getGroupScheduleFromCache(req.params.group).then((cache) => {
        if (cache) {
          return res.status(200).json({ code: 200, debugMsg: 'from cache', success: true, payload: cache });
        }
        return getSchedule({ group: req.params.group, semester }).then((data) => {
          if (data) {
            return res.status(200).json({ code: 200, success: true, payload: data });
          }
          return res.status(400).json({
            code: 400, success: false, message: 'Schedule is unavailible for this group',
            url: getCurrentUrl({ group: req.params.group, semester }), group: req.params.group,
          });
        });
      });
    },
  });
};
