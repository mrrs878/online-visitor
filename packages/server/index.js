/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-19 14:23:44
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-20 17:57:25
 */

const express = require("express");
const ws = require("ws");

const visitors = new Map();

const app = express();

app.get("/", (req, res) => {
  res.json({
    code: 0,
  });
});

const wsServer = new ws.Server({ noServer: true });

function broadcast(server, data) {
  server.clients.forEach((client) => {
    if (client.readyState === ws.WebSocket.OPEN) {
      client.send(data);
    }
  });
}

function online(socket, visitorInfo) {
  const { visitorId, userInfo, pageId } = visitorInfo;

  console.log("[online]", userInfo);

  const tmp = visitors.get(visitorId);
  if (!tmp || tmp.name !== userInfo.name) {
    visitors.set(visitorId, { userInfo, pageId });
  }

  socket.visitorId = visitorId;
  socket.pageId = pageId;

  wsServer.clients.forEach((client) => {
    if (client.readyState === ws.WebSocket.OPEN) {
      broadcast(
        wsServer,
        JSON.stringify({
          type: "visit",
          data: Array.from(visitors).filter(
            ([, { pageId: _pageId } = {}]) => _pageId === pageId
          ),
        })
      );
    }
  });
}

function offline(socket) {
  const { visitorId, pageId } = socket;

  console.log("[offline]", visitors.get(visitorId));

  visitors.delete(visitorId);

  wsServer.clients.forEach((client) => {
    if (client.readyState === ws.WebSocket.OPEN) {
      broadcast(
        wsServer,
        JSON.stringify({
          type: "visit",
          data: Array.from(visitors).filter(
            ([, { pageId: _pageId } = {}]) => _pageId === pageId
          ),
        })
      );
    }
  });
}

wsServer.on("connection", (socket) => {
  socket.on("pong", () => {
    console.log("[pong]", socket.visitorId);
    socket.isAlive = true;
  });

  socket.onmessage = (message, isBinary) => {
    const _message = Buffer.from(message.data).toString();
    const { type, data } = JSON.parse(_message);

    if (type === "online") {
      online(socket, data, isBinary);
    }

    if (type === "offline") {
      offline(data, isBinary);
    }
  };

  socket.onclose = (e) => {
    console.log("[close]", e.reason);
    if (e.code === 1000 || !socket.visitorId) {
      return;
    }
    const { pageId } = visitors.get(socket.visitorId) || {};
    console.log('[close]', pageId);
    broadcast(
      wsServer,
      JSON.stringify({
        type: "visit",
        data: Array.from(visitors).filter(
          ([, { pageId: _pageId } = {}]) => _pageId === pageId
        ),
      })
    );
  };

  socket.onerror = (e) => {
    console.log("[error]", e.message);
  };
});

const interval = setInterval(() => {
  wsServer.clients.forEach((socket) => {
    if (socket.isAlive === false) {
      socket.terminate();
      offline({ visitorId: socket.visitorId }, false);
      return;
    }
    socket.isAlive = false;
    socket.ping();
  });
}, 30000);

wsServer.on("close", function close() {
  clearInterval(interval);
});

const server = app.listen(3000, () => {
  console.log("server is running at port 3000");
});

server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});
