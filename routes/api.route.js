const express = require('express');
const mega = require('megajs');
const {saveCourses} = require("../services/courses.service");
const router = express.Router();
const {find, lastGateway, getCoursesFromAccount} = require('../shared/mega');
const {getAllCourses, findOneCourse, findOneLesson} = require("../services/courses.service");
const logger = require('../shared/logger');

function responseError(res, message) {
    res.status(400).json({
        response: null,
        error: message
    })
}

router.get('/courses', async (req, res) => {
    try {
        res.json({
            response: await getAllCourses(),
            error: null
        })
    } catch (error) {
        res.status(400).json({
            response: null,
            error: error.message
        })
    }
});

router.get('/courses/reload', async (req, res) => {
    try {
        res.json({
            response: await saveCourses(),
            error: null
        })
    } catch (error) {
        res.status(400).json({
            response: null,
            error: error.message
        })
    }
});

router.get('/courses/:courseUrl', async (req, res) => {
    try {
        res.json({
            response: await findOneCourse(req.params.courseUrl),
            error: null
        })
    } catch (error) {
        res.status(400).json({
            response: null,
            error: error.message
        })
    }
});

/**
 * api/embed?accountId=?&courseId=?&sectionId=?&lessonId=?
 */
router.get('/embed', async (req, res) => {
    try {
        const {accountId, courseId, sectionId, lessonId} = req.query;
        const lesson = await findOneLesson(accountId, courseId, sectionId, lessonId);
        if (lesson) {
            const url = `${lesson.course.nodeId}/${lesson.section.nodeId}/${lesson.nodeId}`;
            getCoursesFromAccount(accountId).then(courses => {
                const wanted = find(url, courses);
                if (wanted) {
                    wanted.link(async (error, link) => {
                        if (error) return responseError(res, error);
                        await lesson.update({link});
                        res.json({
                            response: link,
                            error: null
                        })
                    })
                } else {
                    responseError(res, 'File not found.')
                }
            });
        } else {
            responseError(res, 'No lesson found.')
        }

    } catch (e) {
        responseError(res, e.message);
    }
});

router.get('/stream', async (req, res) => {
    try {
        const {accountId, courseId, sectionId, lessonId} = req.query;
        const lesson = await findOneLesson(accountId, courseId, sectionId, lessonId);
        if (lesson) {
            const url = `${lesson.course.nodeId}/${lesson.section.nodeId}/${lesson.nodeId}`;
            getCoursesFromAccount(accountId).then(courses => {
                const wanted = find(url, courses);
                if (wanted) {
                    wanted.download((err, response) => {
                        logger('video download completed', !!err, !!response);
                        res.writeHead(200, {
                            'Content-Type': 'video/mp4',
                            'Content-Length': response.length
                        });
                        res.end(response);
                    });
                } else {
                    responseError(res, 'file not found');
                }
            });
        } else {
            responseError(res, 'lesson not found');
        }
    } catch (e) {
        responseError(res, e.message);
    }
})
;

module.exports = router;
