 const fs = require("fs");
module.exports.config = {
	name: "owner",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "Arun", 
	description: "no prefix",
	commandCategory: "No command marks needed",
	usages: "...",
    cooldowns: 100, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	let react = event.body.toLowerCase();
	if(react.includes("boss") ||
     react.includes("virat") || 
react.includes("owner")) {
		var msg = {
				body: "★𝗢𝘄𝗻𝗲𝗿 + ❤️...𝐕𝐢𝐫𝐚𝐭 𝐬𝐚𝐢𝐧𝐢...❤️ ● ──────────────── ●𝐕𝐢𝐫𝐚𝐭 𝐬𝐚𝐢𝐧𝐢 ● ──────────────── ●𝐎𝐰𝐧𝐞𝐫 ➻❤️....𝐕𝐢𝐫𝐚𝐭 𝐬𝐚𝐢𝐧𝐢....❤️fb link - https://www.facebook.com/virat56889",attachment: fs.createReadStream(__dirname + `/noprefix/owner.jpeg`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("📷", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

	}
