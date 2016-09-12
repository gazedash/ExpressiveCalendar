import sequelize from '../utils/sequelize';
import { UserRepository, CalendarRepository, EventRepository } from '../repositories';

const dropDB = true;

export function load() {
  const password = 'admin0';

  for (let i = 0; i < 15; i++) {
    UserRepository.create({
      firstname: 'admin' + i,
      surname: 'admin' + i,
      email: 'admin' + i + '@ya.ru',
      username: 'admin' + i,
      password,
    }).then(user => {
      const { id, email } = user;
      UserRepository.exists(email).then(() => {
        return UserRepository.authorize(email, password)
          .then(data => console.log('auth', !!data));
      });

      return id;
    }).then(userId => {
      for (let j = 0; j < 10; j++) {
        CalendarRepository.create({
          name: 'My ' + j + ' schedule',
          type: 'work',
          slug: 'work' + j,
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
          for (let k = 0; k < 10; k++) {
            EventRepository.create({
              name: 'study' + k,
              week: 'study',
              weekday: 3,
            }, calId).then((event) => {
              const { id, name } = event;
              console.log('name', name);
              EventRepository.exists(name).then(() => EventRepository.addCalendar(id, calId));

              return id;
            });
          }
        });
      }
    });
  }
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
