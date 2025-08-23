#cmd install remini.js const axios = require("axios");

module.exports = {
  config: {
    name: "remini",
    version: "2.0.0",
    author: "Raj",
    countDown: 5,
    role: 0,
    shortDescription: "HD Enhance with options",
    longDescription: "Reply की गई फोटो को Remini API से enhance करके वापस भेजेगा (face, background, color, all)",
    category: "image",
    guide: {
      en: "Reply किसी फोटो पर {pn} [face|background|color|all]"
    }
  },

  onStart: async function ({ message, event, args }) {
    try {
      if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
        return message.reply("⚠️ किसी फोटो को reply करके command दो!");
      }

      let attachment = event.messageReply.attachments[0];
      if (attachment.type !== "photo") {
        return message.reply("⚠️ सिर्फ फोटो को ही enhance किया जा सकता है।");
      }

      // Mode चुनना
      let mode = args[0] ? args[0].toLowerCase() : "all";
      let type = "";
      switch (mode) {
        case "face":
          type = "face";
          break;
        case "background":
          type = "background";
          break;
        case "color":
          type = "color";
          break;
        default:
          type = "all";
      }

      let imageUrl = attachment.url;
      const api = `https://api.princetechn.com/api/tools/remini?apikey=prince&type=${type}&url=${encodeURIComponent(imageUrl)}`;

      message.reply(`⏳ आपकी फोटो "${type}" enhance हो रही है...`);

      const res = await axios.get(api);

      if (res.data && res.data.result && res.data.result.image_url) {
        let finalUrl = res.data.result.image_url;

        await message.reply({
          body: `✨ यहाँ आपकी "${type}" enhanced फोटो है:`,
          attachment: await global.utils.getStreamFromURL(finalUrl)
        });
      } else {
        message.reply("❌ API से फोटो का लिंक नहीं मिला।");
      }
    } catch (e) {
      console.log("Remini API error:", e.response ? e.response.data : e.message);
      message.reply("⚠️ Error: " + (e.response ? JSON.stringify(e.response.data) : e.message));
    }
  }
};
