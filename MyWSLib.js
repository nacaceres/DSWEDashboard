const WebSocket = require("ws");

const MyWSLib = function() {
  const MyWSLib = this || {};
  const clients = [];

  MyWSLib.setupWS = server => {
    const wss = new WebSocket.Server({ server });
    console.log("Setting up Socket");
    wss.on("connection", ws => {
      console.log("Accepting connection");
      clients.push(ws);
    });
  };

  MyWSLib.notifyAll = data => {
    for (let ws of clients) {
      ws.send(data);
    }
  };
  return MyWSLib;
};

module.exports = MyWSLib;
