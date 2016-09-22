import cheerio from 'cheerio';
import _ from 'lodash';
import moment from 'moment';
import { getCurrentUrl } from './utils/schedule';
import { getContent } from './utils/helper';
import {
  scheduleSelector,
  scheduleTableSelector,
  scheduleExamSelector,
  evenWeekSelector,
  getSemester,
} from './config/schedule';
import { latinToCyrillicGroupName } from './utils/transliterate';

// const group = 'КТбо1-5';

export function getScheduleData(body) {
  const $ = cheerio.load(body, { decodeEntities: false });
  if ($(scheduleTableSelector).children('*').length) {
    $('*').each(function () {      // iterate over all elements
      let attrs = [evenWeekSelector];
      if (this.attribs.id === scheduleSelector || scheduleExamSelector) {
        attrs = [evenWeekSelector, 'id'];
      }
      this.attribs = _.pick(this.attribs, attrs);
    });

    const table = $(scheduleTableSelector);
    const tableExam = $(scheduleExamSelector);
    const rows = table.length ? table.find('tr') : null;
    const rowsExam = tableExam.length ? tableExam.find('tr') : null;

    function getData(rows) {
      if (rows) {
        if ($(rows[0]).length) {
          const first = {};
          const second = {};
          let dayCounter = 0;

          for (let i = 2; i < rows.length; i++) {
            const current = rows[i];
            const next = rows[i + 1];
            const classes = $(current).children('td');
            const classesNext = $(next).children('td');

            if (i % 2 === 0) {
              const title = classes[0].children[0].data;
              const day = {};
              if (title.indexOf('.') > -1) {
                day.date = title;
              } else {
                day.day = title;
              }
              day.data = [];
              const dayEven = _.cloneDeep(day);

              if (i !== 2) {
                dayCounter++;
              }

              let evenClassCounter = 0;
              for (let j = 1; j < classes.length; j++) {
                const timeInterval = $(rows[1]).children('td')[j].children[0].data;
                const currentClass = classes[j];
                const currentClassElem = currentClass.children[0];
                // flag that it is not even week
                const isOdd = currentClass.attribs[evenWeekSelector] === undefined;
                if (isOdd) {
                  const nextClassElem = classesNext[evenClassCounter].children[0];
                  if (currentClassElem) {
                    day.data.push({ index: j, event: currentClassElem.data, time: timeInterval });
                    if (nextClassElem) {
                      dayEven.data.push({ index: j, event: nextClassElem.data, time: timeInterval });
                      evenClassCounter++;
                    } else {
                      dayEven.data.push({ index: j, time: timeInterval });
                    }
                  } else {
                    day.data.push({ index: j, time: timeInterval });
                    if (nextClassElem) {
                      dayEven.data.push({ index: j, event: nextClassElem.data, time: timeInterval });
                      evenClassCounter++;
                    } else {
                      dayEven.data.push({ index: j, time: timeInterval });
                    }
                  }
                } else {
                  if (currentClassElem) {
                    day.data.push({ index: j, event: currentClassElem.data, time: timeInterval });
                    dayEven.data.push({ index: j, event: currentClassElem.data, time: timeInterval });
                  } else {
                    day.data.push({ index: j, time: timeInterval });
                    dayEven.data.push({ index: j, time: timeInterval });
                  }
                }
              }

              evenClassCounter = 0;

              const dayName = dayCounter === 6 ? 'sunday' :
                moment.weekdays()[dayCounter + 1].toLowerCase();

              first[dayName] = day;
              second[dayName] = dayEven;
            }
          }

          return { first, second };
        } else {
          return null;
        }
      } else {
        return null;
      }
    }

    const schedule = getData(rows);

    if (schedule) {
      schedule.exam = getData(rowsExam);
      return { schedule };
    }

    return null;
  }
  return null;
}

export function correctGroupNameCase(group) {
  if (group) {
    return group.substr(0, 2).toUpperCase() + group.substr(2).toLowerCase();
  }

  return group;
}

export function getSchedule({ group, semester }) {
  let semesterCopy = semester;
  if (!semester || semester !== 1 || semester !== 2) {
    semesterCopy = getSemester();
  }
  let groupCopy = correctGroupNameCase(group);
  groupCopy = latinToCyrillicGroupName(groupCopy);
  const url = getCurrentUrl({ group: groupCopy, semester: semesterCopy });
  return getContent(url).then((body) => getScheduleData(body));
}
//
// const url = getCurrentUrl({ group: 'КТбо1-5', semester: 1 });
// getContent(url).then((body) => {
//   console.log(getScheduleData(body));
// });

// getGroupScheduleFromCache('KTbo1-5');
