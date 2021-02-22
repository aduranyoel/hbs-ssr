const {DataTypes} = require('sequelize');
const sequelize = require('../db/connection');
const Lesson = require('./lesson');

const Section = sequelize.define('sections', {
    sectionId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
        unique: true,
        field: 'section_id'
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
}, {
    timestamps: false,

});

Section.hasMany(Lesson, {foreignKey: 'sectionId'});
Lesson.belongsTo(Section, {foreignKey: 'sectionId'});

module.exports = Section;
