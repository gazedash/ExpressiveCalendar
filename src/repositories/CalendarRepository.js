import { Calendar } from '../model/entity';
import { UserRepository } from './index';

export async function exists(slug) {
  const exists = await Calendar.findOne({
    where: { slug },
  });
  console.log('calendar: exists', Boolean(exists));
  return Boolean(exists);
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

export async function create(calendar) {
  console.log('calendar: create');
  
  const { name, type, slug } = calendar;
  
  if (!name || !type || !slug || !calendar) {
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
