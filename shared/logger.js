const fs = require('fs');
const path = require('path');

module.exports = (...text) => {
    const now = new Date();
    const name = now.getFullYear() + '-' + now.getMonth() + '-' + now.getDay() + '.log';
    const toLog = `[${now.toLocaleString()}] ${text.join('')}\n`;
    const filePath = path.resolve(__dirname, '../logs/', name);
    fs.appendFile(filePath, toLog, () => {
        console.log(toLog);
    });
};
