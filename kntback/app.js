const {mainSocket, serverPort, startDb} = require("./source/domain/server/server");

console.log("STARTED SUCCESFULLY")

startDb(serverPort);
