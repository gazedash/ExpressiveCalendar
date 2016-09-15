import request from 'request';
import cheerio from 'cheerio';
import _ from 'lodash';

const service = 'http://asu.tti.sfedu.ru/Raspisanie/ShowRaspisanie.aspx?Substance=';
const group = encodeURIComponent('КТбо1-5');
const rest = '&isPotok=155&Semestr=1';
const page = service + group + rest;

request(page, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(body, {decodeEntities: false});
    $('*').each(function () {      // iterate over all elements
      let attrs = ['rowspan'];
      if (this.attribs.id === '#tblRaspis' || '#tblRaspisZaoch') {
        attrs = ['rowspan', 'id']
      }
      this.attribs = _.pick(this.attribs, attrs);
      console.log(this.attribs);
    });

    // #tblRaspis = classes
    // #tblRaspisZaoch = exam
    const rows = $('table#tblRaspis').find("tr");

    const firstWeek = [];
    const secondWeek = [];
    let dayCounter = 0;
    let currentEvenPair;

    for (let i = 2; i < rows.length; i++) {
      const current = rows[i];
      const next = rows[i+1];
      const classes = $(current).children("td");
      const classesNext = $(next).children("td");

      if (i % 2 == 0) {
        const title = classes[0].children[0].data;
        let day = {};
        day.name = title;
        day.data = [];
        const dayEven = _.cloneDeep(day);

        if (i !== 2) {
          dayCounter++;
        }

        let evenPairCounter = 0;
        for (let j = 1; j < classes.length; j++) {
          // flag that it is not even week
          let isOdd = classes[j].attribs.rowspan === undefined;
          if (isOdd) {
            currentEvenPair = j;
            if (classes[j].children[0]) {
              day.data.push(classes[j].children[0].data);
              if (classesNext[evenPairCounter].children[0]) {
                dayEven.data.push(classesNext[evenPairCounter].children[0].data);
                evenPairCounter++;
              } else {
                dayEven.data.push(' ');
              }
            } else {
              day.data.push(' ');
              if (classesNext[evenPairCounter].children[0]) {
                dayEven.data.push(classesNext[evenPairCounter].children[0].data);
                evenPairCounter++;
              } else {
                dayEven.data.push(' ');
              }
            }
          } else {
            if (classes[j].children[0]) {
              day.data.push(classes[j].children[0].data);
              dayEven.data.push(classes[j].children[0].data);
            } else {
              day.data.push(' ');
              dayEven.data.push(' ');
            }
          }
        }

        evenPairCounter = 0;
        firstWeek.push(day);
        secondWeek.push(dayEven);
      }
    }

    console.log('--FIRST----\n');
    console.log(firstWeek);
    console.log('\n---SECOND---\n');
    console.log(secondWeek);
  }
});
