import { Calendar } from '../model/entity';
import { UserRepository } from './index';

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

export async function findAll(userId) {
  const user = await UserRepository.find(userId);
  const res = await Calendar.findAll({
    include: [user],
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

  if (!name || !type || !slug || !calendar || !exists(slug)) {
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
  const calendar = findBySlug(slug);
  if (calendar) {
    calendar.destroy();
    return calendar;
  }
  return null;
}
