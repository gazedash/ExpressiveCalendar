import { Calendar, User } from '../model/entity';
import { UserRepository, EventRepository } from './index';
import * as et from '../enum/EnumTypes';
import redis from '../redis';
import { CALENDAR_PRIVACY_LEVEL } from '../config/redis';
import { randomString } from '../utils/helper';

export async function exists(slug) {
  const isExist = await Calendar.findOne({
    where: { slug },
  });
  console.log('calendar: isExist', Boolean(isExist));

  return Boolean(isExist);
}

export async function find(id) {
  const res = await Calendar.findOne({
    where: { id },
  });

  if (!res) {
    return null;
  }

  return res;
}

export async function findAll(email) {
  const res = await Calendar.findAndCountAll({
    include: [{ model: User, where: { email }, attributes: ['email'], through: { attributes: [] } }],
    limit: 100,
  });

  if (!res) {
    return null;
  }

  return res;
}

export async function findBySlug(slug) {
  const res = await Calendar.findOne({
    where: { slug },
  });

  if (!res) {
    return null;
  }

  return res;
}

export async function findByUserIdAndSlug({ userId, slug }) {
  const res = await Calendar.findOne({
    include: [{ model: User, where: { id: userId }, attributes: ['email'], through: { attributes: [] } }],
    where: { slug },
  });

  if (!res) {
    return null;
  }

  return res;
}

export async function findAllByUserIdAndType({ userId, type }) {
  const res = await Calendar.findAndCountAll({
    include: [{ model: User, where: { id: userId }, attributes: ['email'], through: { attributes: [] } }],
    where: { type },
  });

  if (!res) {
    return null;
  }

  return res;
}

export async function create(calendar) {
  const { slug, privacy } = calendar;
  const isExist = await exists(slug);
  if (!calendar || isExist) {
    return null;
  }

  const res = await Calendar.create(calendar);

  if (!res) {
    return null;
  }

  redis.hset(CALENDAR_PRIVACY_LEVEL, slug ? slug : randomString(), privacy ? privacy : et.PRIVACY_LEVEL_PRIVATE);
  console.log('calendar: create');
  return res;
}

// add user to existing cal
export async function addUser(calId, userId) {
  console.log('calendar: add user');
  const calendar = await find(calId);
  if (calendar) {
    const user = await UserRepository.find(userId);
    if (user) {
      console.log('calendar, user', !!calendar, !!user);
      calendar.addUser(user);
      return calendar;
    }
  }

  return null;
}

// add event to existing cal
export async function addEvent(calId, eventId) {
  console.log('calendar: add event');
  const calendar = await find(calId);
  if (calendar) {
    const event = await EventRepository.find(eventId);
    if (event) {
      console.log('calendar, event', !!calendar, !!event);
      calendar.addEvent(event);
      return event;
    }
  }
  return null;
}

export async function update(data) {
  const { slug } = data;
  const calendar = await findBySlug(slug);
  if (calendar) {
    await calendar.update({
      data,
    });
    return calendar;
  }

  return null;
}

export async function remove(slug) {
  const calendar = await findBySlug(slug);
  if (calendar) {
    calendar.destroy();
    return calendar;
  }

  return null;
}
