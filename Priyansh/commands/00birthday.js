//@Prem-babu3608
////////////////////////////////////////////////////////
/////// WARNING => JO CREDIT NAME CHANGE KREGA USKA ID BAN KAR DIYA JAYEGA + THIS BOT IS MADE BT PREM BABU
const fs = require("fs");
module.exports.config = {
	name: "birthday",
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
	if(react.includes("BIrthday") ||
     react.includes("Birthday") || react.includes("BirthDAy") || react.includes("BirTHday") ||
react.includes("Birthday") ||
react.includes("birthday")) {
		var msg = {
				body: `★━━━━━━━━━━━━━★🎈𝐇𝐚𝐩𝐩𝐲 𝐛𝐢𝐫𝐭𝐡𝐝𝐚𝐲 𝐦𝐞𝐫𝐢 𝐣𝐚𝐚𝐧🎈★━━━━━━━━━━━━━★`,attachment: fs.createReadStream(__dirname + `/noprefix/happy.jpg`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("💋", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
