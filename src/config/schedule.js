export const scheduleSelector = '#tblRaspis';
export const scheduleTableSelector = 'table#tblRaspis';
export const scheduleExamSelector = '#tblRaspisZaoch';
export const evenWeekSelector = 'rowspan';

function getNotAutumn() {
  const month = parseInt(new Date().getMonth(), 10) + 1;
  if (month >= 9) {
    return 0;
  }
  return 1;
}

export function getPotok() {
  const notAutumn = getNotAutumn();
  const shortYear = new Date().getFullYear().toString().substr(2, 2);
  return parseInt(shortYear, 10) + (140 - notAutumn);
}

export const potok = getPotok();

export function getSemester() {
  const month = parseInt(new Date().getMonth(), 10) + 1;
  if (month < 2 || month >= 9) {
    return 1;
  }
  return 2;
}

export const semester = getSemester();
