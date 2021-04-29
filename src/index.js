const express = require("express");
const app = express();
const port = 4001;
const http = require("http");
const server = http.createServer(app);

// Also setup a WEB frontend
// I have added it to the server repo but it's really a frontend client.
const { v4: uuidV4 } = require('uuid');
app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});
app.set('view engine', 'ejs');
app.use(express.static('public'));

// This will be the start of having different rooms for different journeys:
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

// Try to switch off the error. Might be easier to add a favicon!
app.get('/favicon.ico', (req, res) => res.status(204));
// End web frontend.

// Connect Socket IO to our app.
const io = require("socket.io")(server, { origins: "*:*" });
app.use(express.static(__dirname + "/public"));

io.sockets.on("error", (e) => console.log(e));
server.listen(port, () => console.log(`Server is running on port ${port}`));

// Handle websocket communications via socket.io
io.on('connection', socket => {
  console.log("Connection made");
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId);
    });
  });
});
