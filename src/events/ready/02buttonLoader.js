const getAllFiles = require("./../../utils/getAllFiles");
const path = require('path');
const log = require("./../../utils/log");

module.exports = async (client) => {
    const buttonsCatagorys = getAllFiles(path.join(__dirname, '../..', 'buttons'), true);

    let buttons = [];
    buttonsCatagorys.forEach((buttonsCatagory) => {
        buttons.push(...getAllFiles(path.join(buttonsCatagory), false));
    });

    const buttonNames = buttons.map(file => path.parse(file).name).sort();

    buttonNames.forEach((buttonName) => {
        log(`\x1b[38;2;249;199;79m[Button] \x1b[32m${buttonName}\x1b[0m has been loaded.`)
    });
}
