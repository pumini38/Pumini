module.exports.config = {
  name: "jos",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "PREM BABU",
  description: "gurop join photos",
  commandCategory: "Random-IMG",
  usages: "join gruop",
  cooldowns: 2,
  dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }

};

module.exports.run = async({api,event,args,Users,Threads,Currencies}) => {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
    var link = [
      "https://m.me/j/AbYh1MaU1FI6WRm0/"
           ];
     var callback = () => api.sendMessage({body:`★━━━━━━━━━━━━━★🍂 Gruop join karo 🍂 ★━━━━━━━━━━━━━★`,attachment: fs.createReadStream(__dirname + "/cache/1.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.jpg"));  
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/1.jpg")).on("close",() => callback());
   };
