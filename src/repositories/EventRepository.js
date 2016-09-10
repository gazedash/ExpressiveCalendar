import { Event } from '../model/entity';
import { CalendarRepository } from './index';

export async function exists(slug) {
  const isExist = await Event.findOne({
    where: { slug },
  });
  console.log('event: isExist', Boolean(isExist));
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

export async function findBySlug(slug) {
  const res = await Event.findOne({
    where: { slug },
  });

  if (!res) {
    return null;
  }

  return res;
}

export async function findAllByCalendarId(id) {
  const calendar = await CalendarRepository.find(id);
  const res = await Event.findAndCountAll({
    include: [calendar],
    where: { id },
  });

  if (!res) {
    return null;
  }

  return res;
}

export async function create(event) {
  console.log('event: create');
  const { name, week, weekday } = event;

  if (!name || !week || !weekday) {
    return null;
  }

  const res = await Event.create(event);

  console.log('res', !!res);
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
