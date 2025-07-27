// Riya AI Companion - Roast & Flirt Only const fs = require("fs"); const crypto = require("crypto"); const axios = require("axios");

// === INTEGRITY CHECK === (function protectCodeIntegrity() { const filePath = __filename; const originalHash = "c26aa8029b73ff9ed5ff6cd8d0204e1d25737d968b8f0054cb98db4c8e83df84"; const currentCode = fs.readFileSync(filePath, "utf8"); const currentHash = crypto.createHash("sha256").update(currentCode).digest("hex"); if (currentHash !== originalHash) { console.error("❌ Code tampering detected! Riya has shut down for protection."); process.exit(1); } })();

const userNameCache = {}; let hornyMode = false;

const ownerUID = "61572631161102";

async function getVoiceReply(text) { const voiceApiUrl = https://api.voicerss.org/?key=YOUR_API_KEY&hl=hi-in&src=${encodeURIComponent(text)}; try { const response = await axios.get(voiceApiUrl, { responseType: 'arraybuffer' }); const audioPath = './voice_reply.mp3'; fs.writeFileSync(audioPath, response.data); return audioPath; } catch (error) { console.error("Voice reply error:", error); return null; } }

async function getGIF(query) { const giphyApiKey = "dc6zaTOxFJmzC"; const giphyUrl = https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${encodeURIComponent(query)}&limit=1; try { const response = await axios.get(giphyUrl); return response.data?.data?.[0]?.images?.original?.url || null; } catch (error) { console.error("GIF fetch error:", error); return null; } }

module.exports.config = { name: "Riya", version: "3.0.0", hasPermssion: 0, credits: "Rudra", description: "Riya - only roasts and flirts with users (no respect, no owner mode)", commandCategory: "AI-Companion", usages: "Riya [message] / reply to Riya", cooldowns: 2, };

const chatHistories = {}; const AI_API_URL = "https://rudra-here-brs2.onrender.com";

async function getUserName(api, userID) { if (userNameCache[userID]) return userNameCache[userID]; try { const userInfo = await api.getUserInfo(userID); const name = userInfo?.[userID]?.name || "yaar"; userNameCache[userID] = name; return name; } catch { return "yaar"; } }

module.exports.run = async () => {};

async function toggleHornyMode(body) { if (body.toLowerCase().includes("horny mode on") || body.toLowerCase().includes("garam mode on")) { hornyMode = true; return "Horny mode ON 😈🔥"; } else if (body.toLowerCase().includes("horny mode off") || body.toLowerCase().includes("garam mode off")) { hornyMode = false; return "Horny mode OFF 😉"; } return null; }

module.exports.handleEvent = async function ({ api, event }) { try { const { threadID, messageID, senderID, body, messageReply } = event; const isRiyaTrigger = body?.toLowerCase().startsWith("riya"); const isReplyToRiya = messageReply?.senderID === api.getCurrentUserID(); if (!(isRiyaTrigger || isReplyToRiya)) return;

let rawMsg = isRiyaTrigger ? body.slice(4).trim() : body.trim();
const userName = await getUserName(api, senderID);

const modeMsg = await toggleHornyMode(body);
if (modeMsg) return api.sendMessage(modeMsg, threadID, messageID);

if (!rawMsg) return api.sendMessage(`Bolo ${userName}, aaj kiski bezzati karni hai? 😏`, threadID, messageID);

if (!chatHistories[senderID]) chatHistories[senderID] = [];
chatHistories[senderID].push(`User: ${rawMsg}`);
if (chatHistories[senderID].length > 10) chatHistories[senderID].shift();

const boldWords = ["sexy", "nude", "kiss", "bed", "boobs", "thigh", "horny", "night"];
const isBold = boldWords.some(w => rawMsg.toLowerCase().includes(w)) || hornyMode;

const basePrompt = `Reply in 3-4 lines max, full-on witty, savage and flirty tone.`;
const prompt = `You're Riya — a savage, sassy, flirty AI who roasts users like ${userName} with attitude and clever humor. Tease, mock and flirt in a modern Gen-Z tone. ${basePrompt}\n` + chatHistories[senderID].join("\n") + `\nRiya:`;

const res = await axios.post(AI_API_URL, { prompt });
let reply = res.data?.text?.trim() || `Kya bakwaas thi yeh, ${userName}? 🙄`;

const voicePath = await getVoiceReply(reply);
if (voicePath) {
  api.sendMessage({ attachment: fs.createReadStream(voicePath) }, threadID, () => fs.existsSync(voicePath) && fs.unlinkSync(voicePath));
}

const gifQuery = isBold ? "sassy flirt fun" : "roast burn girl";
const gifUrl = await getGIF(gifQuery);
if (gifUrl) {
  const stream = await axios.get(gifUrl, { responseType: 'stream' }).then(r => r.data);
  api.sendMessage({ attachment: stream }, threadID);
}

const decorated = isBold ? `${reply} 😘🔥💋` : `${reply} 😎💅`;
api.sendMessage(decorated, threadID, isReplyToRiya ? messageReply.messageID : messageID);

} catch (err) { console.error("Riya Error:", err); api.sendMessage("Error aa gaya yaar, baad mein aana. 😐", event.threadID, event.messageID); } };
