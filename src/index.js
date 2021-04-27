const express = require("express");
const app = express();
const port = 4001;
const http = require("http");
const server = http.createServer(app);

// Also setup WEB frontend for testing:
const { v4: uuidV4 } = require('uuid');
app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

app.get('/favicon.ico', (req, res) => res.status(204));
// End web frontend.

// TODO What does the origins do when there is no port?
const io = require("socket.io")(server, { origins: "*:*" });
app.use(express.static(__dirname + "/public"));

io.sockets.on("error", (e) => console.log(e));
server.listen(port, () => console.log(`Server is running on port ${port}`));

let broadcaster;

 // TODO, why io.sockets not just io?
io.sockets.on("connection", (socket) => {
  console.log("A client connected to Socket");

socket.on("frontendConnected", () => {
  console.log("The server says that the frontend connected");
});

  socket.on("frontendMobileConnected", () => {
  console.log("The server says that the frontend mobile connected");
  });

  socket.on("broadcaster", () => {
    broadcaster = socket.id;
    socket.broadcast.emit("broadcaster");
  });
  socket.on("watcher", () => {
    socket.to(broadcaster).emit("watcher", socket.id);
  });
  socket.on("disconnect", () => {
    socket.to(broadcaster).emit("disconnectPeer", socket.id);
  });
  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });
  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });
  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });
  socket.on('comment', (id, message) => {
    socket.to(id).emit("comment", socket.id, message);
  });
});
