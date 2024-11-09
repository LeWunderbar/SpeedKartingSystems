const logToFile = require('log-to-file');

module.exports = (logMessage) => {
    try {
        logToFile(`OUTPUT: ${logMessage}`, "output.log")
    } catch (error) {
        console.log(`Error While trying to log to file: \n \n ${error}`)
    }
    console.log(`OUTPUT: ${logMessage}`)
}

