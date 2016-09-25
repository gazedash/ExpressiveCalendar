import { Event, Calendar, User } from '../model/entity';
import { CalendarRepository } from './index';
import * as et from '../enum/EnumTypes';
import redis from '../redis';
import { EVENT_PRIVACY_LEVEL } from '../config/redis';

export async function exists(slug) {
  const isExist = await Event.findOne({
    where: { slug },
  });

  return Boolean(isExist);
}

export async function find(id) {
  const res = await Event.findOne({
    where: { id },
  });
  if (!res) {
    return null;
  }

  return res;
}

export async function findByUserIdAndSlug({ userId, slug }) {
  // TODO: test
  const res = await Event.findOne({
    include: [{ model: User, where: { id: userId }, attributes: ['email'], through: { attributes: [] } }],
    where: { slug },
  });

  if (!res) {
    return null;
  }

  return res;
}


export async function remove(slug) {
  const res = await Event.destroy({
    where: { slug },
  });
  if (!res) {
    return null;
  }

  return res;
}

export async function findBySlug(slug) {
  const res = await Event.findOne({
    where: { slug },
  });
  if (!res) {
    return null;
  }

  return res;
}

export async function findAllBySlug(slug) {
  const res = await Event.findAndCountAll({
    include: [{ model: Calendar, where: { slug }, attributes: ['slug', 'privacy'], through: { attributes: [] } }],
    limit: 100,
  });
  if (!res) {
    return null;
  }

  return res;
}

export async function create(event) {
  const { slug, privacy } = event;
  const isExist = await findBySlug(slug);
  if (isExist) {
    return null;
  }
  const res = await Event.create(event);
  if (!res) {
    return null;
  }

  redis.hset(EVENT_PRIVACY_LEVEL, slug, privacy ? privacy : et.PRIVACY_LEVEL_PRIVATE);
  console.log('event: create');
  return res;
}

// add calendar to event
export async function addCalendar(eventId, calId) {
  console.log('event: addCal to event');
  const event = await find(eventId);
  const calendar = await CalendarRepository.find(calId);
  console.log('event, cal', !!event, !!calendar);
  event.addCalendar(calendar);

  return event;
}
