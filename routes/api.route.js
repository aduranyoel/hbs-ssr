const express = require('express');
const fs = require('fs');
const path = require('path');
const mega = require('megajs');
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


router.get('/stream', (req, res) => {
    // const video = 'https://mega.nz/file/hH4SEYrL#4n_EiLf7kH5C8iQLsEjeOmQFNmWXf2y2ZbGPV-MD56k';
    //
    // const file = mega.File.fromURL(video);
    // file.download((err, attr) => {
    //     console.log(attr);
    // });


    res.json({ok: true});
    // // Ensure there is a range given for the video
    // const range = req.headers.range;
    // if (!range) {
    //     res.status(400).send("Requires Range header");
    // }
    //
    // // get video stats (about 61MB)
    // const videoPath = path.resolve(path.join(__dirname, '../', 'static', 'bigbuck.mp4'));
    // const videoSize = fs.statSync(videoPath).size;
    //
    // // Parse Range
    // // Example: "bytes=32324-"
    // const CHUNK_SIZE = 10 ** 6; // 1MB
    // const start = Number(range.replace(/\D/g, ""));
    // const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    //
    // // Create headers
    // const contentLength = end - start + 1;
    // const headers = {
    //     "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    //     "Accept-Ranges": "bytes",
    //     "Content-Length": contentLength,
    //     "Content-Type": "video/mp4",
    // };
    //
    // // HTTP Status 206 for Partial Content
    // res.writeHead(206, headers);
    //
    // // create video read stream for this particular chunk
    // const videoStream = fs.createReadStream(videoPath, { start, end });
    //
    // // Stream the video chunk to the client
    // videoStream.pipe(res);

});

module.exports = router;
