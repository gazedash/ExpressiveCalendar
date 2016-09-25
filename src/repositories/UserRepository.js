import { User } from '../model/entity';
import { compare, hash } from '../utils/bcrypt';
import { CalendarRepository } from './index';

export async function exists({ email, username }) {
  let where = { email };
  if (username) {
    where = {
      $or: [
        {
          email: {
            $like: email,
          },
        },
        {
          username: {
            $like: username,
          },
        },
      ],
    };
  }

  const isExist = await User.findOne({
    where,
  });

  return Boolean(isExist);
}

export async function find(id) {
  const res = await User.findOne({
    where: { id },
  });
  if (!res) {
    return null;
  }

  return res;
}

export async function findByEmail(email) {
  const res = await User.findOne({
    where: { email },
  });
  if (!res) {
    return null;
  }

  return res.dataValues;
}

export async function findByUsername(username) {
  const res = await User.findOne({
    where: { username },
  });
  if (!res) {
    return null;
  }

  return res.dataValues;
}

export async function findByFullName({ firstname, surname }) {
  const res = await User.findOne({
    where: { firstname, surname },
  });
  if (!res) {
    return null;
  }

  return res;
}

export async function findAllByGroup(group) {
  const res = await User.findAndCountAll({
    where: { group },
  });
  if (!res) {
    return null;
  }

  return res;
}


export async function create(user) {
  const { firstname, email, password, username } = user;
  const isExist = await exists(email);
  if (!firstname || !email || !password || isExist) {
    console.log('user: missing fields', user);
    return null;
  }
  const hashed = await hash(password);
  const res = await User.create({
    ...user,
    password: hashed,
    username: username ? username : email.split('@')[0],
  });
  if (!res) {
    return null;
  }

  return res.dataValues;
}

export async function authorize(email, password) {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    console.log("auth didn't work");
    return false;
  }

  if (await compare(password, user.password)) {
    console.log('auth did work');
    return user.dataValues;
  }

  return false;
}

// add cal to user
export async function addCalendar(userId, calId) {
  // TODO: 1find or create?
  console.log('user: add cal');
  const calendar = await CalendarRepository.find(calId);
  const user = await find(userId);
  console.log('user, calendar', !!user, !!calendar);
  user.addCalendar(calendar);

  return calendar;
}
