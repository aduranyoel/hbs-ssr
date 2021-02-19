const
    express = require('express'),
    router = express.Router();
const {getCourse} = require("../shared/mega");

router.use((req, res, next) => {
    const acceptLanguage = req.header('accept-language') || '';
    req.extra = {
        locale: acceptLanguage.split(',')[0] || 'en-US'
    };
    next();
});

router.get('/', (req, res) => {
    res.render("home", {
        ...req.extra,
        title: 'Mega Courses',
        courses: Array(4).fill({
            name: 'loading',
            nodeId: '',
            type: 1,
            children: [],
            accountId: 0,
            courseInfo: {description: 'loading'},
            loading: true
        })
    });
});

router.get('/lesson', (req, res) => {
    res.render("lesson", {
        ...req.extra,
        title: 'MC',
        subtitle: ' ',
        siteTitle: "Online courses - anytime, anywhere | Mega Courses",
        siteDescription: "Free courses, be part of a community that learns and shares their knowledge",
        siteImage: 'https://www.megacourses.top/img/logo.png',
        course: {
            children: Array(3).fill(undefined).map((_, i) => ({
                id: i,
                expanded: i === 0,
                name: 'loading',
                loading: true,
                children: Array(3).fill({
                    loading: true,
                    name: 'loading',
                })
            }))
        }
    });
});

module.exports = router;
