const axios = require("axios");
const fs = require("fs-extra");

async function baseApiUrl() {
  const base = await axios.get(
    "https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json"
  );
  return base.data.api;
}

module.exports.config = {
  name: "alldl",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "Dipto → Converted by Raj",
  description: "Download video from TikTok, Facebook, Instagram, YouTube and more",
  commandCategory: "media",
  usages: "[video_link]",
  cooldowns: 2
};

module.exports.run = async function ({ api, event, args }) {
  const dipto = event.messageReply?.body || args[0];
  if (!dipto) {
    return api.sendMessage("❌ | Please provide a video link", event.threadID, event.messageID);
  }

  try {
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    const { data } = await axios.get(`${await baseApiUrl()}/alldl?url=${encodeURIComponent(dipto)}`);
    const filePath = __dirname + `/cache/vid.mp4`;

    if (!fs.existsSync(__dirname + "/cache")) {
      fs.mkdirSync(__dirname + "/cache");
    }

    const vid = (await axios.get(data.result, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(filePath, Buffer.from(vid, "utf-8"));

    let url;
    try {
      url = global.utils.shortenURL ? await global.utils.shortenURL(data.result) : data.result;
    } catch {
      url = data.result;
    }

    api.setMessageReaction("✅", event.messageID, () => {}, true);

    api.sendMessage(
      {
        body: `${data.cp || ""}\nLink = ${url || ""}`,
        attachment: fs.createReadStream(filePath),
      },
      event.threadID,
      () => fs.unlinkSync(filePath),
      event.messageID
    );

    // 🟢 Special case for Imgur
    if (dipto.startsWith("https://i.imgur.com")) {
      const dipto3 = dipto.substring(dipto.lastIndexOf("."));
      const response = await axios.get(dipto, { responseType: "arraybuffer" });
      const filename = __dirname + `/cache/dipto${dipto3}`;
      fs.writeFileSync(filename, Buffer.from(response.data, "binary"));
      api.sendMessage(
        {
          body: `✅ | Downloaded from link`,
          attachment: fs.createReadStream(filename),
        },
        event.threadID,
        () => fs.unlinkSync(filename),
        event.messageID
      );
    }
  } catch (error) {
    api.setMessageReaction("❎", event.messageID, () => {}, true);
    return api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);
  }
};
