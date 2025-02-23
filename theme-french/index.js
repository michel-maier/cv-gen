const fs = require('fs');
const Handlebars = require('handlebars');

module.exports = {
  render: function (resume) {
    const css = fs.readFileSync(__dirname + '/style.css', 'utf-8');
    const tpl = fs.readFileSync(__dirname + '/resume.hbs', 'utf-8');

    Handlebars.registerHelper('formatDate', function(dateString) {
      if (!dateString) return '';
      const s = dateString.split('-');
      return `${s[1]}/${s[0]}`;
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