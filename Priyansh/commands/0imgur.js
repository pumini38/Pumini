const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const FormData = require("form-data");

module.exports.config = {
  name: "upload",
  version: "1.0",
  credits: "Raj",
  description: "Upload image/video or all attachments to Catbox.moe (permanent link)",
  usage: "[all] (reply to image/video)",
  cooldown: 5
};

module.exports.run = async function ({ api, event, args }) {
  const isAll = args[0] === "all";
  const reply = event.messageReply;

  if (!reply || !reply.attachments || reply.attachments.length === 0) {
    return api.sendMessage("❌ Please reply to one or more images/videos.", event.threadID, event.messageID);
  }

  const attachments = isAll ? reply.attachments : [reply.attachments[0]];
  const validTypes = ["photo", "video", "animated_image"];
  const results = [];

  api.sendMessage(`📤 Uploading ${attachments.length} file(s), please wait...`, event.threadID);

  for (let i = 0; i < attachments.length; i++) {
    const file = attachments[i];

    if (!validTypes.includes(file.type)) {
      results.push(`❌ File ${i + 1}: Unsupported type (${file.type})`);
      continue;
    }

    let ext = ".jpg";
    if (file.type === "video") ext = ".mp4";
    else if (file.type === "animated_image") ext = ".gif";
    else if (file.url.includes(".png")) ext = ".png";

    const tempPath = path.join(__dirname, "cache", `upload_${Date.now()}_${i}${ext}`);

    try {
      const res = await axios.get(file.url, { responseType: "arraybuffer" });
      fs.writeFileSync(tempPath, res.data);

      const form = new FormData();
      form.append("reqtype", "fileupload");
      form.append("fileToUpload", fs.createReadStream(tempPath));

      const uploadRes = await axios.post("https://catbox.moe/user/api.php", form, {
        headers: form.getHeaders()
      });

      fs.unlinkSync(tempPath);

      if (uploadRes.data.includes("https://")) {
        results.push(`✅ File ${i + 1}: ${uploadRes.data}`);
      } else {
        results.push(`❌ File ${i + 1}: Upload failed.`);
      }

    } catch (err) {
      console.error(err);
      results.push(`❌ File ${i + 1}: Error uploading.`);
    }
  }

  return api.sendMessage(results.join("\n"), event.threadID, event.messageID);
};
