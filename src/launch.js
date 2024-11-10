//////////////////////////
// Imports of Index.js //
/////////////////////////

const eventHandler = require('./handlers/eventHandler');
const oauthHandler = require('./handlers/oauthHandler');
const mongoHandler = require("./handlers/mongoHandler");
const log = require("./utils/log")

////////////
// Launch //
////////////

console.clear();
console.log(`
	██╗      ██████╗ ██╗   ██╗    ███╗   ███╗██████╗ ██████╗
	╚██╗     ██╔══██╗╚██╗ ██╔╝    ████╗ ████║╚════██╗╚════██╗
	 ╚██╗    ██████╔╝ ╚████╔╝     ██╔████╔██║ █████╔╝ █████╔╝
	 ██╔╝    ██╔══██╗  ╚██╔╝      ██║╚██╔╝██║██╔═══╝  ╚═══██╗
	██╔╝     ██████╔╝   ██║       ██║ ╚═╝ ██║███████╗██████╔╝
	╚═╝      ╚═════╝    ╚═╝       ╚═╝     ╚═╝╚══════╝╚═════╝                                                
`);
log(`\x1b[38;2;243;114;44m[Launcher] \x1b[32mStarting Bot ...`);

(async () => {
	try {
		eventHandler();
		mongoHandler();
		oauthHandler();
	} catch (error) {
		log(`\x1b[31m[Error] \x1b[32mAn error occurred in launch.js:\n\x1b[0m${err}`)
	}
})();
