const handlebars = require("handlebars");

handlebars.registerHelper('isZero', function (value) {
    return value === 0;
});


module.exports = handlebars;
