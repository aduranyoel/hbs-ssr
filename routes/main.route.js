const
    express = require('express'),
    router = express.Router(),
    path = require('path');
const Course = require("../model/course");
const {findOneCourse, parseCourse, getAllCourses} = require("../services/courses.service");

router.use((req, res, next) => {
    const acceptLanguage = req.header('accept-language') || '';
    req.extra = {
        locale: acceptLanguage.split(',')[0] || 'en-US'
    };
    next();
});

router.get('/', async(req, res) => {
    const attrs = ['name', 'nodeId', 'type', 'accountId', 'courseId', 'url', 'description', 'picture'];
    const courses = await getAllCourses({page: 1, length: 16}, attrs);
    res.render("home", {
        ...req.extra,
        title: 'Mega Courses',
        siteTitle: "Online courses - anytime, anywhere | Mega Courses",
        siteDescription: "Free courses, be part of a community that learns and shares their knowledge",
        siteImage: 'https://www.megacourses.top/img/thumbnail.png',
        courses: courses.map(parseCourse)
    });
});

router.get('/course/:courseUrl', async (req, res) => {
    const {courseUrl} = req.params;
    try {
        const course = await findOneCourse(courseUrl);
        if (course) {
            res.render("course", {
                ...req.extra,
                title: 'MC',
                subtitle: course.name,
                siteTitle: `${course.name} | Mega Courses`,
                siteDescription: course.description,
                siteImage: `${req.protocol}://${req.headers.host}/course/image/${courseUrl}`,
                course: parseCourse(course)
            });
        } else {
            sendError();
        }
    } catch (e) {
        sendError();
    }

    function sendError() {
        res.render('error', {message: 'No course found'});
    }
});

router.get('/course/image/:courseUrl', async (req, res) => {
    const {courseUrl} = req.params;
    const course = await Course.findOne({where: {url: courseUrl}});
    if (course) {
        const img = Buffer.from(course.picture, 'base64');
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        });
        res.end(img);
    } else {
        res.sendFile(path.resolve(path.join(__dirname, '../', 'static/img/camera-solid.svg')));
    }
});

router.get('/video', (req, res) => {
    res.render('video');
});

module.exports = router;
