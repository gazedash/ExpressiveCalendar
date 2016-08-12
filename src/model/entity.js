import Sequelize from 'sequelize';
import sequelize from '../config/database';
// import * as lt from '../enum/LogTypes';

export const User = sequelize.define('user', {
	id: {
		primaryKey: true,
		type: Sequelize.INTEGER,
		autoIncrement: true
	},
	username: {
		type: Sequelize.STRING,
	},
	name: {
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
	},
	password: {
		type: Sequelize.STRING,
	},
	socialToken: {
		type: Sequelize.STRING,
	}
}, {
	freezeTableName: true
});

// const Log = sequelize.define('log', {
//     id: {
//         primaryKey: true,
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//     },
//     type: {
//         type: Sequelize.ENUM(
//             lt.USER_CONNECT,
//             lt.USER_DISCONNECT,
//             lt.USER_FIRST_CONNECT,
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
	},
	description: {
		type: sequelize.STRING,
	},
	type: {
		type: Sequelize.STRING,
	},
	slug: {
		type: Sequelize.STRING,
	},
	privacy: {
		type: Sequelize.INTEGER,
	},
});

User.belongsToMany(Calendar, { through: 'user_calendar', onDelete: 'cascade' });
Calendar.belongsToMany(User, { through: 'user_calendar' });

export const Event = sequelize.define('event', {
	id: {
		primaryKey: true,
		type: Sequelize.INTEGER,
		autoIncrement: true
	},
	name: {
		type: Sequelize.STRING
	},
	slug: {
		type: Sequelize.STRING
	},
	week: {
		type: Sequelize.STRING
	},
	weekday: {
		type: Sequelize.INTEGER
	},
	time: {
		type: Sequelize.STRING
	},
	place: {
		type: Sequelize.STRING
	},
	isEven: {
		type: Sequelize.BOOLEAN
	},
	duration: {
		type: Sequelize.STRING
	},
	leader: {
		type: Sequelize.STRING
	},
	message: {
		type: Sequelize.STRING
	},
}, {
	freezeTableName: true,
	timestamps: false
});

Event.belongsToMany(Calendar, { through: 'event_calendar' });
Calendar.belongsToMany(Event, { through: 'event_calendar', onDelete: 'cascade' });
