const express = require('express');
const {saveCourses} = require("../services/courses.service");
const router = express.Router();
const {find, getEmbed} = require('../shared/mega');
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
                        const embed = getEmbed(link);
                        await lesson.update({link: embed});
                        res.json({
                            response: embed,
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


module.exports = router;
