export const scheduleSelector = '#tblRaspis';
export const scheduleTableSelector = 'table#tblRaspis';
export const scheduleExamSelector = '#tblRaspisZaoch';
export const evenWeekSelector = 'rowspan';
export const potok = parseInt(new Date().getFullYear().toString().substr(2, 2)) + 140;
export const semester = (function () {
  const month = parseInt(new Date().getMonth()) + 1;
  if (month <= 1 || month >= 9) {
    return 1;
  }
  return 2;
})();
