const fs = require('fs');
const Handlebars = require('handlebars');

module.exports = {
  render: function (resume) {
    const css = fs.readFileSync(__dirname + '/style.css', 'utf-8');
    const tpl = fs.readFileSync(__dirname + '/resume.hbs', 'utf-8');

    // English resumes spell the month out: "Dec 2022", not the 12/2022 the
    // French theme uses.
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    Handlebars.registerHelper('formatDate', function(dateString) {
      if (!dateString) return '';
      const [year, month] = dateString.split('-');
      if (!month) return year;
      return `${MONTHS[Number(month) - 1]} ${year}`;
    });

    Handlebars.registerHelper('limit', function(array, limit) {
      if (Array.isArray(array)) {
        return array.slice(0, limit);
      }
      return array;
    });

    Handlebars.registerHelper('ifMoreThan', function(array, limit, options) {
      if (Array.isArray(array) && array.length > limit) {
        return options.fn(this);
      }
      return '';
    });

    return Handlebars.compile(tpl)({
      css: css,
      resume: resume
    });
  }
};
