import { Calendar, User } from '../model/entity';
import { UserRepository, EventRepository } from './index';

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
  const res = await Calendar.findAll({
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

export async function findByUserIdAndType({ userId, type }) {
  const user = await UserRepository.find(userId);
  const res = await Calendar.findAndCountAll({
    // TODO: fix
    include: [user],
    where: { type },
  });

  if (!res) {
    return null;
  }

  return res;
}

export async function create(calendar) {
  console.log('calendar: create');
  const { name, type, slug } = calendar;
  const isExist = await exists(slug);
  if (!name || !type || !slug || !calendar || isExist) {
    return null;
  }
  const res = await Calendar.create(calendar);
  if (!res) {
    return null;
  }

  return res;
}

// add user to existing cal
export async function addUser(calId, userId) {
  console.log('calendar: add user');
  const calendar = await find(calId);
  const user = await UserRepository.find(userId);
  console.log('calendar, user', !!calendar, !!user);
  calendar.addUser(user);

  return calendar;
}

// add event to existing cal
export async function addEvent(calId, eventId) {
  console.log('calendar: add event');
  const calendar = await find(calId);
  const event = await EventRepository.find(eventId);
  console.log('calendar, user', !!calendar, !!event);
  calendar.addEvent(event);

  return event;
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
