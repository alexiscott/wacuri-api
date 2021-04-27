const socket = io('/');


console.log("I am a script, and I have a socket", socket);
socket.on("connect", () => {
  console.log("Frontend Web client connected");
  socket.emit("frontendConnected");
});
