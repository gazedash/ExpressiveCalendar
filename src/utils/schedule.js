import { SERVICE_ENDPOINT } from '../config/endpoints';
import { potok, semester } from '../config/schedule';
import { transliterate } from '../utils/transliterate';
import { getSchedule } from '../parser';
import redis from '../redis';
const Promise = require('bluebird');

export function buildQuery({group, potok, semester}) {
  const encGroup = encodeURIComponent(group);
  return 'Substance=' + encGroup + '&isPotok=' + potok + '&Semestr=' + semester;
}

export function buildEndpoint(args) {
  return SERVICE_ENDPOINT + '?' + args;
}

export function getUrl({group, potok, semester}) {
  const query = buildQuery({group, potok, semester});
  return buildEndpoint(query);
}

export function getCurrentUrl({group, semester}) {
  return getUrl({group, potok, semester})
}

export function getGroupSchedule(group) {
  // const schedule = getSchedule({group, semester}).then((data) => {
  //   return data;
  // });
  const groupName = transliterate(group);

  return Promise.any([
    getSchedule({group, semester}),
    redis.hgetAsync(groupName, 'data')
  ]);
}

export function addGroupSchedule(group) {
  getSchedule({group, semester}).then((data) => {
    if (data) {
      const groupName = transliterate(group);

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
