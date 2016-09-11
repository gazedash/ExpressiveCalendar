import sequelize from '../utils/sequelize';
import { UserRepository, CalendarRepository, EventRepository } from '../repositories';

const dropDB = true;

export function load() {
  const password = 'dsafd2321';

  UserRepository.create({
    firstname: 'John',
    surname: 'Coul',
    email: 'john@example.com',
    username: 'Couljohn0000',
    password,
  }).then(user => {
    const { id, email } = user;
    UserRepository.exists(email).then(() => {
      return UserRepository.authorize(email, password)
        .then(data => console.log('auth', !!data));
    });

    return id;
  }).then(userId => {
    CalendarRepository.create({
      name: 'My job schedule',
      type: 'work',
      slug: 'john-work',
    }, userId).then((calendar) => {
      const { id, slug } = calendar;
      console.log('id, userId', id, userId);
      CalendarRepository.exists(slug).then(() => CalendarRepository.addUser(id, userId));
      UserRepository.find(userId).then(() => {
        const res = UserRepository.addCalendar(3, 1);
        console.log('res', res);
      });

      return id;
    }).then(calId => {
      console.log('calId', calId);
      EventRepository.create({
        name: 'study',
        week: 'study',
        weekday: 3,
      }, calId).then((event) => {
        const { id, name } = event;
        console.log('name', name);
        EventRepository.exists(name).then(() => EventRepository.addCalendar(id, calId));

        return id;
      });
    });
  });

  console.log('Fixtures have been loaded successfully');
}

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    sequelize.sync({
      force: dropDB,
    }).then(() => load()
    );
  });
