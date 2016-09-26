import sequelize from '../utils/sequelize';
import { UserRepository, CalendarRepository, EventRepository } from '../repositories';
import * as et from '../enum/EnumTypes';

const dropDB = true;

export async function load() {
  const password = 'admin0';

  for (let i = 1; i <= 5; i++) {
    const user = await UserRepository.create({
      firstname: `admin${i}`,
      surname: `admin${i}`,
      email: `admin${i}@ya.ru`,
      username: `admin${i}`,
      password,
    });

    const { email } = user;

    if (await UserRepository.exists(email)) {
      await UserRepository.authorize(email, password);
    }

    for (let j = 1; j <= 4; j++) {
      const calendar = await CalendarRepository.create({
        name: `My ${j} schedule`,
        type: 'work',
        slug: `work${i}${j}`,
        privacy: et.PRIVACY_LEVEL_PUBLIC,
      });

      const { id, slug } = calendar;
      console.log('userId, calId, j', i, id, j);

      if (await CalendarRepository.exists(slug)) {
        await UserRepository.addCalendar(i, id);
      }

      for (let k = 1; k <= 3; k++) {
        const event = await EventRepository.create({
          name: `study${k}`,
          slug: `study${i}${j}${k}`,
          week: 'study',
          weekday: 3,
          privacy: et.PRIVACY_LEVEL_PUBLIC,
        });

        const { id, name } = event;
        console.log('evnet name', name);

        if (await CalendarRepository.exists(slug)) {
          await CalendarRepository.addEvent(j, id);
        }
      }
    }
  }
}

console.log('Fixtures have been loaded successfully');

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    sequelize.sync({
      force: dropDB,
    }).then(() => load()
    );
  });
