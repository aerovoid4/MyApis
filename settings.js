const fs = require("fs");

global.ownerName = "Khalid";
global.webName = "Human-API";
global.versionNumber = "2.24.24.77";

global.listkey = ["16", "32", "64"];
global.XznKey = "Human-API";
global.ZenzKey = "???";
global.ZeeoneKey = "???";

let file = require.resolve(__filename);
fs.watchFile(file, () => {
	fs.unwatchFile(file);
	console.log(`Update"${__filename}"`);
	delete require.cache[file];
	require(file);
});
