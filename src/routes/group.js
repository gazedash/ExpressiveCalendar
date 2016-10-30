import Joi from 'joi';
import { GROUP_ENDPOINT } from '../config/endpoints';
import {
  GROUP_SLUG_MIN_LENGTH,
  GROUP_SLUG_MAX_LENGTH,
} from '../config/rules';
import { addGroupSchedule, getGroupScheduleFromCache, getCurrentUrl } from '../utils/schedule';
import { getSchedule } from '../parser';
import { semester } from '../config/schedule';
import { latinToCyrillicGroupName } from '../utils/transliterate';
import { latinToCyrillic } from '../utils/transliterate';
import { correctGroupNameCase } from '../parser';
import { getSemester } from '../config/schedule';

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
      const group = req.params.group.replace('_', ' ');
      addGroupSchedule(group);
      return getGroupScheduleFromCache(group).then((cache) => {
        if (cache) {
          return res.status(200).json({ code: 200, debugMsg: 'from cache', success: true, payload: JSON.parse(cache) });
        }
        return getSchedule({ group, semester }).then((data) => {
          if (data) {
            return res.status(200).json({ code: 200, success: true, payload: data });
          }

          let groupCopy = correctGroupNameCase(group);
          groupCopy = latinToCyrillic(groupCopy);
          const url = getCurrentUrl({ group: groupCopy, semester: getSemester() });

          return res.status(400).json({
            code: 400, success: false, message: 'Schedule is unavailible for this group',
            url, group
          });
        });
      });
    },
  });

  // TODO: post /api/group/(message): add message to redis
};
