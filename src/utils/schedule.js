import { SERVICE_ENDPOINT } from '../config/endpoints';
import { potok, semester } from '../config/schedule';
import { getSchedule } from '../parser';
import redis from '../redis';
import { hash } from '../utils/crypto';
import { GROUP_DATA, GROUP_HASH, GROUP_LIST } from '../config/redis';
import { transliterate } from './transliterate';

const Promise = require('bluebird');

export function buildQuery({ group, potok, semester }) {
  const encGroup = encodeURIComponent(group);
  return `Substance=${encGroup}&isPotok=${potok}&Semestr=${semester}`;
}

export function buildEndpoint(args) {
  return `${SERVICE_ENDPOINT}?${args}`;
}

export function getUrl({ group, potok, semester }) {
  const query = buildQuery({ group, potok, semester });
  return buildEndpoint(query);
}

export function getCurrentUrl({ group, semester }) {
  return getUrl({ group, potok, semester });
}

export function getGroupScheduleFromCache(group) {
  const groupName = transliterate(group).toLowerCase();
  return redis.hgetAsync(GROUP_DATA, groupName);
}

export function shouldScheduleUpdate(group, hashNew) {
  const groupName = transliterate(group).toLowerCase();
  return redis.hgetAsync(GROUP_HASH, groupName).then((hashOld) => {
    return hashNew !== hashOld;
  });
}

export function addGroupSchedule(group) {
  if (group) {
    getSchedule({ group, semester }).then((data) => {
      if (data) {
        const groupName = transliterate(group).toLowerCase();

        redis.hgetAsync(GROUP_HASH, groupName).then((hashOld) => {
          redis.sadd(GROUP_LIST, groupName);
          const dataJSON = JSON.stringify(data);
          const hashNew = hash(dataJSON);

          if (hashOld !== hashNew) {
            // TODO: Rethink
            redis.multi()
              .hset(GROUP_HASH, groupName, hashNew)
              .hset(GROUP_DATA, groupName, dataJSON)
              .exec();
          }
        });
      }
    });
  }
}
