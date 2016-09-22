import { SERVICE_ENDPOINT } from '../config/endpoints';
import { potok, semester } from '../config/schedule';
import { transliterate } from '../utils/transliterate';
import { getSchedule } from '../parser';
import redis from '../redis';
import { hash } from '../utils/crypto';
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
  let groupName = group;
  if (!group.match(/[A-Za-z]+[0-9]-[0-9]/)) {
    groupName = transliterate(group).toLowerCase();
  }
  return redis.hgetAsync(groupName, 'data');
}

export function addGroupSchedule(group) {
  if (group) {
    getSchedule({ group, semester }).then((data) => {
      if (data) {
        let groupName = group;

        if (!group.match(/[A-Za-z]+[0-9]-[0-9]/)) {
          groupName = transliterate(group).toLowerCase();
        }
        redis.sadd('group', groupName);
        redis.hgetAsync(groupName, 'hash').then((hashOld) => {
          const dataJSON = JSON.stringify(data);
          const hashNew = hash(dataJSON);

          if (hashOld !== hashNew) {
            redis.hmset(groupName, 'hash', hashNew, 'data', dataJSON);
          }
        });
      }
    });
  }
}
