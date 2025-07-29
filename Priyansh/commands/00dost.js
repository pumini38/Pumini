//@Prem-babu3608
////////////////////////////////////////////////////////
/////// WARNING => JO CREDIT NAME CHANGE KREGA USKA ID BAN KAR DIYA JAYEGA + THIS BOT IS MADE BT PREM BABU
const fs = require("fs");
module.exports.config = {
	name: "dost",
    version: "1.1.1",
	hasPermssion: 0,
	credits: "PREM BABU", ////////@prem-babu3608
	description: "THIS BOT IS MR PREM SHARMA",
	commandCategory: "no prefix",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	let react = event.body.toLowerCase();
	if(react.includes("Dost") ||
     react.includes("dost") || react.includes("COLdrink") || react.includes("ColdRINk") ||
react.includes("DOST") ||
react.includes("friend")) {
		var msg = {
				body: `💜|| Love U Dost ||💜`,attachment: fs.createReadStream(__dirname + `/noprefix/dost.mp4`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("💕", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
