const {DataTypes} = require('sequelize');
const sequelize = require('../db/connection');
const Section = require('./section');
const Lesson = require('./lesson');

const Course = sequelize.define('courses', {
    courseId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
        unique: true,
        field: 'course_id'
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
    description: {
        type: DataTypes.TEXT
    },
    picture: {
        type: DataTypes.TEXT
    },
    name: {
        type: DataTypes.TEXT
    },
    url: {
        type: DataTypes.TEXT
    },
}, {
    timestamps: false
});
Course.hasMany(Section, {foreignKey: 'courseId'});
Section.belongsTo(Course, {foreignKey: 'courseId'});
Course.hasMany(Lesson, {foreignKey: 'courseId'});
Lesson.belongsTo(Course, {foreignKey: 'courseId'});


module.exports = Course;
