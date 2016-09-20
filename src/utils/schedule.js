import { SERVICE_ENDPOINT } from '../config/endpoints';
import { potok } from '../config/schedule';

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
