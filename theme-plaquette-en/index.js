const fs = require('fs');
const Handlebars = require('handlebars');

module.exports = {
  render: function (resume) {
    const css = fs.readFileSync(__dirname + '/style.css', 'utf-8');
    const tpl = fs.readFileSync(__dirname + '/resume.hbs', 'utf-8');

    // Numérotation des cartes « ce que je résous ».
    Handlebars.registerHelper('num', function (index) {
      return String(index + 1).padStart(2, '0');
    });

    // Affichage d'une URL sans son protocole ni son « www. » : la donnée reste
    // une URI complète, conforme au schéma JSON Resume.
    Handlebars.registerHelper('host', function (url) {
      return String(url || '').replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
    });

    return Handlebars.compile(tpl)({ css: css, resume: resume, p: resume.plaquette || {} });
  }
};
