const sequelize = require('../db/connection');
const Course = require('../model/course');
const Section = require('../model/section');
const Lesson = require('../model/lesson');
const {getCoursesFromCache} = require("../shared/mega");
const Node = require('../model/node');

function findOneCourse(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await Course.findOne({
                where: {url},
                include: {
                    model: Section,
                    include: {
                        model: Lesson
                    }
                }
            });
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

function getAllCourses() {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await Course.findAll();
            resolve(result);
        } catch (e) {
            reject(e);
        }
    });
}

function createCourseUrl(name) {
    return name.trim().toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/^-|-$/, '');
}

function saveCourses() {
    async function createLesson(course, courseInDb, transaction, section, sectionInDb) {
        if (section.children && section.children.length) {
            for (let lesson of section.children) {
                const lessonInDb = await Lesson.create({
                    ...lesson,
                    sectionId: sectionInDb.sectionId,
                    courseId: courseInDb.courseId,
                    accountId: course.accountId,
                }, {transaction});
            }
        }
        return true;
    }

    async function createSection(course, courseInDb, transaction) {
        if (course.children && course.children.length) {
            for (let section of course.children) {
                const sectionInDb = await Section.create({
                    ...section,
                    courseId: courseInDb.courseId,
                    accountId: course.accountId,
                }, {transaction});
                await createLesson(course, courseInDb, transaction, section, sectionInDb);
            }
        }
        return true;
    }

    async function createCourses(courses, transaction) {
        for (let course of courses) {
            const exist = await Course.count({where: {nodeId: course.nodeId}, transaction});
            if (!exist) {
                const courseInDb = await Course.create({
                    ...course,
                    picture: course.courseInfo.picture,
                    description: course.courseInfo.description,
                    url: createCourseUrl(course.name)
                }, {transaction});
                await createSection(course, courseInDb, transaction);
            }
        }
        return true;
    }

    return new Promise(async (resolve, reject) => {
        try {
            const courses = await getCoursesFromCache();
            await sequelize.transaction(async (transaction) => {
                await createCourses(courses, transaction);
            });
            // Committed
            resolve(true)
        } catch (err) {
            // Rolled back
            reject(err);
        }
    });
}

function findOneLesson(accountId, courseId, sectionId, lessonId) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await Lesson.findOne({
                where: {accountId, courseId, sectionId, lessonId},
                include: [
                    {
                        model: Course,
                        attributes: ["nodeId"]
                    },
                    {
                        model: Section,
                        attributes: ["nodeId"]
                    }
                ]
            });
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let interval;

function initSyncCourses() {
    saveCourses();
    interval = setInterval(saveCourses, 24 * 60 * 60 * 1000)
}

function sortNodesByName(a, b) {
    const
        A = a.name.split('.')[0].padStart(4, '0'),
        B = b.name.split('.')[0].padStart(4, '0');
    return A > B ? 1 : -1;
}

function sanitizeName(name) {
    return name ? name.split('.').slice(1, -1).join('.') : '';
}

function parseLessons(lessons) {
    return lessons
        .filter(n => n.name !== 'data.json')
        .sort(sortNodesByName)
        .map(lesson => {
            const {name, nodeId, type, accountId, courseId, sectionId, lessonId, link} = lesson;
            return new Node({
                name: sanitizeName(name),
                nodeId, type, accountId, courseId, sectionId, lessonId, link
            })
        })
}

function parseSections(sections) {
    return sections
        .filter(n => n.name !== 'data.json')
        .sort(sortNodesByName)
        .map(section => {
            const {name, nodeId, type, accountId, courseId, sectionId, lessonId, lessons} = section;
            return new Node({
                name, nodeId, type, accountId, courseId, sectionId, lessonId,
                lessons: Array.isArray(lessons) ? parseLessons(lessons) : null
            })
        })
}

function parseCourse(course) {
    const {name, nodeId, type, accountId, sections, courseId} = course;
    return new Node({
        name, nodeId, type, accountId, courseId,
        sections: Array.isArray(sections) ? parseSections(sections) : null
    });
}

module.exports = {
    findOneCourse,
    getAllCourses,
    saveCourses,
    findOneLesson,
    initSyncCourses,
    parseCourse
};
