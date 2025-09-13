const axios = require("axios");
const fs = require("fs-extra");
const { loadImage, createCanvas } = require("canvas");

module.exports.config = {
    name: "trump",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Priyansh Rajput",
    description: "Trump ke board par apna text likho",
    commandCategory: "edit-img",
    usages: "trump [text]",
    cooldowns: 10
};

module.exports.wrapText = (ctx, text, maxWidth) => {
    return new Promise(resolve => {
        if (ctx.measureText(text).width < maxWidth) return resolve([text]);
        if (ctx.measureText('W').width > maxWidth) return resolve(null);
        const words = text.split(' ');
        const lines = [];
        let line = '';
        while (words.length > 0) {
            let split = false;
            while (ctx.measureText(words[0]).width >= maxWidth) {
                const temp = words[0];
                words[0] = temp.slice(0, -1);
                if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
                else {
                    split = true;
                    words.splice(1, 0, temp.slice(-1));
                }
            }
            if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
            else {
                lines.push(line.trim());
                line = '';
            }
            if (words.length === 0) lines.push(line.trim());
        }
        return resolve(lines);
    });
};

module.exports.run = async function ({ api, event, args }) {
    const pathImg = __dirname + "/cache/trump.png";
    const text = args.join(" ");

    if (!text) return api.sendMessage("👉 Board par likhne ke liye text daalo!", event.threadID, event.messageID);

    try {
        // Trump board base image
        let baseImgData = (await axios.get("https://i.imgur.com/ZtWfHHx.png", { responseType: "arraybuffer" })).data;
        fs.writeFileSync(pathImg, Buffer.from(baseImgData, "utf-8"));

        let baseImage = await loadImage(pathImg);
        let canvas = createCanvas(baseImage.width, baseImage.height);
        let ctx = canvas.getContext("2d");

        // Draw base image
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        // Font settings
        ctx.font = "bold 45px Arial";
        ctx.fillStyle = "#000";
        ctx.textAlign = "start";

        // Word wrapping
        const lines = await this.wrapText(ctx, text, 1100);
        if (!lines) return api.sendMessage("❌ Text bahut lamba hai, thoda chhota likho.", event.threadID, event.messageID);

        // Draw text line by line
        let lineHeight = 55;
        let startY = 165;
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], 60, startY + (i * lineHeight));
        }

        // Save final image
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);

        return api.sendMessage(
            { attachment: fs.createReadStream(pathImg) },
            event.threadID,
            () => fs.unlinkSync(pathImg),
            event.messageID
        );
    } catch (e) {
        return api.sendMessage("⚠️ Error: " + e.message, event.threadID, event.messageID);
    }
};
