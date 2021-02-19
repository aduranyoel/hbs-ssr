const
    express = require("express"),
    i18n = require("i18n-express"),
    expressHandlebars = require("express-handlebars"),
    path = require("path"),
    helpers = require('./shared/helpers'),
    app = express();

/**
 * Config
 */
app.set("port", process.env.PORT || 3000);

/**
 * Handlebars
 */
const hbs = expressHandlebars.create({
    extname: ".hbs",
    cache: true,
    helpers
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

/**
 * Middleware
 */
app.use(express.static(path.join(__dirname, "static")));
app.use(
    i18n({
        translationsPath: path.join(__dirname, "i18n"),
        siteLangs: ["en", "es"],
        textsVarName: "t",
        paramLangName: 'l'
    })
);
app.use(express.urlencoded({extends: true}));
app.use(express.json());

/**
 * Routes
 */
app.use('/api', require('./routes/api.route'));
app.use("/", require('./routes/main.route'));

/**
 * Server
 */
app.listen(app.get("port"), () => {
    console.log('server running in port ' + app.get('port'));
});
