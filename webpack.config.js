const path = require('path');

module.exports = [
    {
        name: 'main-section',
        entry: '/shared/main-section.js',
        output: {
            path: path.resolve(__dirname, 'static', 'js'),
            filename: "main-section.bundle.js"
        }
    },
    {
        name: 'lesson',
        entry: '/shared/lesson.js',
        output: {
            path: path.resolve(__dirname, 'static', 'js'),
            filename: "lesson.bundle.js"
        }
    },
];
