const path = require('path');

module.exports = {
    entry: {
        main: '/shared/client/main-section.js',
        lesson: '/shared/client/lesson.js'
    },
    output: {
        path: path.resolve(__dirname, 'static', 'js'),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
};
