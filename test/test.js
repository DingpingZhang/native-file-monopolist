const addon = require("../build/Release/filemonopolist");
const filePath = "C:\\Users\\Dingp\\Desktop\\suffix\\suffix.txt";

const monopolist = new addon.FileMonopolist(filePath);
monopolist.monopolize();

setTimeout(() => {
  const success = monopolist.dispose();
  console.log(success ? "This file has been released." : "Unlock failed.");
}, 5000);
