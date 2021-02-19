const express = require('express');
const router = express.Router();
const {find, getEmbed} = require('../shared/mega');
const {getCoursesFromAccount} = require("../shared/mega");

const {getCoursesFromCache, getCourse} = require('../shared/mega');

router.get('/courses', (req, res) => {
    getCoursesFromCache().then(response => {
        res.json({
            response,
            error: null
        })
    })
});

router.get('/courses/:accountId/:courseId', (req, res) => {
    const {accountId, courseId} = req.params;
    getCourse(accountId, courseId).then(response => {
        res.json({
            response,
            error: null
        })
    })
});

router.get('/embed', (req, res) => {
    const {path} = req.query;
    if (path) {
        const account = path.split('/')[0], url = path.split('/').slice(1).join('/');
        getCoursesFromAccount(account).then(course => {
            const wanted = find(url, course[account]);
            if (wanted) {
                wanted.link((error, link) => {
                    if (error) return responseError(error);
                    res.json({
                        response: getEmbed(link),
                        error: null
                    })
                })
            } else {
                responseError('File not found.')
            }
        });
    } else {
        responseError('No path found.')
    }

    function responseError(message) {
        res.status(400).json({
            response: null,
            error: message
        })
    }
});


module.exports = router;
