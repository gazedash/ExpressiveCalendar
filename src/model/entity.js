import Sequelize from 'sequelize';
import sequelize from '../utils/sequelize';
import * as et from '../enum/EnumTypes';
import { randomString } from '../utils/helper';

export const User = sequelize.define('user', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
  },
  firstname: {
    type: Sequelize.STRING,
  },
  surname: {
    type: Sequelize.STRING,
  },
  group: {
    type: Sequelize.STRING,
  },
  information: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
  },
  socialToken: {
    type: Sequelize.STRING,
  },
}, {
  charset: 'utf8',
  freezeTableName: true,
});

// const Log = sequelize.define('log', {
//     id: {
//         primaryKey: true,
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//     },
//     type: {
//         type: Sequelize.ENUM(
//             et.USER_CONNECT,
//             et.USER_DISCONNECT,
//             et.USER_FIRST_CONNECT,
//         )
//     },
//     data: {
//         type: Sequelize.JSON,
//     },
// }, {
//     freezeTableName: true,
// });
//
// User.hasMany(Log);

export const Calendar = sequelize.define('calendar', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    defaultValue: new Date().toUTCString(),
  },
  description: {
    type: Sequelize.STRING,
  },
  type: {
    type: Sequelize.STRING,
  },
  slug: {
    type: Sequelize.STRING,
    unique: true,
    defaultValue: randomString(),
  },
  privacy: {
    type: Sequelize.ENUM(
      et.PRIVACY_LEVEL_PRIVATE,
      et.PRIVACY_LEVEL_PUBLIC,
      et.PRIVACY_LEVEL_LINK,
      et.PRIVACY_LEVEL_GROUP,
    ),
    defaultValue: et.PRIVACY_LEVEL_PRIVATE,
  },
  // privacy: {
  //   type: Sequelize.INTEGER,
  // },
}, {
  charset: 'utf8',
  freezeTableName: true,
});

Calendar.belongsToMany(User, { through: 'user_calendar' });
User.belongsToMany(Calendar, { through: 'user_calendar', onDelete: 'cascade' });

export const Event = sequelize.define('event', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    defaultValue: new Date().toUTCString(),
  },
  slug: {
    type: Sequelize.STRING,
    unique: true,
    defaultValue: randomString(),
  },
  weekInterval: {
    type: Sequelize.STRING,
  },
  week: {
    type: Sequelize.STRING,
  },
  weekday: {
    type: Sequelize.INTEGER,
  },
  classIndex: {
    type: Sequelize.INTEGER,
  },
  date: {
    type: Sequelize.STRING,
  },
  time: {
    type: Sequelize.STRING,
  },
  duration: {
    type: Sequelize.STRING,
  },
  place: {
    type: Sequelize.STRING,
  },
  oddEvenBoth: {
    type: Sequelize.ENUM(
      et.BOTH_WEEK,
      et.ODD_WEEK,
      et.EVEN_WEEK,
    ),
    defaultValue: et.BOTH_WEEK,
  },
  // TODO: enum (0, 1, 2): 0 for both, 1 for odd, 2 for even
  isEven: {
    type: Sequelize.BOOLEAN,
  },
  leader: {
    type: Sequelize.STRING,
  },
  message: {
    type: Sequelize.STRING,
  },
  privacy: {
    type: Sequelize.ENUM(
      et.PRIVACY_LEVEL_PRIVATE,
      et.PRIVACY_LEVEL_PUBLIC,
      et.PRIVACY_LEVEL_LINK,
      et.PRIVACY_LEVEL_GROUP,
    ),
    defaultValue: et.PRIVACY_LEVEL_PRIVATE,
  },
  // privacy: {
  //   type: Sequelize.INTEGER,
  // },
}, {
  charset: 'utf8',
  freezeTableName: true,
  // timestamps: false,
});

Calendar.belongsToMany(Event, { through: 'event_calendar', onDelete: 'cascade' });
Event.belongsToMany(Calendar, { through: 'event_calendar' });
