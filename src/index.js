const express = require("express");
  const app = express();
  const http = require("http");
  const server = http.createServer(app);
  const port = 4001;
  const io = require("socket.io")(server, { origins: "*:*" });

  io.sockets.on("error", (e) => console.log(e));
  server.listen(port, () => console.log(`Server is running on port ${port}`));

app.get('/', (req, res) => res.send('Hello Wacuri!'))

  io.sockets.on("connection", (socket) => {
    console.log("A connection was established to Socket:", socket);
  });
