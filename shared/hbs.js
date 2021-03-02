const handlebars = require("handlebars");

handlebars.registerHelper('isZero', function (value) {
    return value === 0;
});
handlebars.registerHelper('isProduction', function () {
    return process.env.NODE_ENV === 'production';
});


module.exports = handlebars;
