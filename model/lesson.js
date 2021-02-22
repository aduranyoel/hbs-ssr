const {DataTypes} = require('sequelize');
const sequelize = require('../db/connection');

const Lesson = sequelize.define('lessons', {
    lessonId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
        unique: true,
        field: 'lesson_id'
    },
    sectionId: {
        field: 'section_id',
        type: DataTypes.BIGINT,
    },
    courseId: {
        field: 'course_id',
        type: DataTypes.BIGINT,
    },
    nodeId: {
        type: DataTypes.STRING(100),
        field: 'node_id'
    },
    type: {
        type: DataTypes.CHAR(1)
    },
    accountId: {
        type: DataTypes.BIGINT,
        field: 'account_id'
    },
    name: {
        type: DataTypes.TEXT
    },
    link: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: false,

});


module.exports = Lesson;
