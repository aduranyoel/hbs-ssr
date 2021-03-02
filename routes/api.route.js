const express = require('express');
const mega = require('megajs');
const {saveCourses} = require("../services/courses.service");
const router = express.Router();
const {find} = require('../shared/mega');
const {getCoursesFromAccount} = require("../shared/mega");
const {getAllCourses, findOneCourse, findOneLesson} = require("../services/courses.service");

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
                        if (error) return responseError(error);
                        await lesson.update({link});
                        res.json({
                            response: link,
                            error: null
                        })
                    })
                } else {
                    responseError('File not found.')
                }
            });
        } else {
            responseError('No lesson found.')
        }

    } catch (e) {
        responseError(e.message);
    }

    function responseError(message) {
        res.status(400).json({
            response: null,
            error: message
        })
    }
});

router.get('/stream', (req, res) => {
    let {url, hash} = req.query;
    if (!url || !hash) return res.status(400).end();
    if (url.indexOf('embed') > -1) url = url.replace('embed', 'file');
    const file = mega.File.fromURL(`${url}#${hash}`);
    file.download((err, file) => {
        res.writeHead(200, {
            'Content-Type': 'video/mp4',
            'Content-Length': file.length
        });
        res.end(file);
    });
});

module.exports = router;
