import { Event, Calendar } from '../model/entity';
import { CalendarRepository } from './index';

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
    include: [{ model: Calendar, where: { slug }, attributes: ['slug'], through: { attributes: [] } }],
    limit: 100,
  });
  if (!res) {
    return null;
  }

  return res;
}

export async function create(event) {
  console.log('event: create');
  const { name, week, weekday, slug } = event;
  const isExist = await exists(slug);
  if (!name || !week || !weekday || isExist) {
    return null;
  }
  const res = await Event.create(event);
  if (!res) {
    return null;
  }

  return res;
}

// add user to existing cal
export async function addCalendar(eventId, calId) {
  console.log('event: addCal to event');
  const event = await find(eventId);
  const calendar = await CalendarRepository.find(calId);
  console.log('event, cal', !!event, !!calendar);
  event.addCalendar(calendar);

  return event;
}
