- [Setting up NPM packages](#org3d43549)
- [Running the express based websocket server](#orge56b67c)
- [Making sure we will be able to connect to our server over the internet.](#org8af3a4a)

The API is a backend Express application which serves as a message broker for websockets.


<a id="org3d43549"></a>

# Setting up NPM packages

Install yarn globally. This assumes that you already have NPM and NODE installed.

```shell
npm install -g yarn
```

Initialize the app and the `package.json` file

```shell
npm init -y
```

Add the basic packages that we will need. I am including nodemon which will make it easier to make changes during development by live reloading of the app.

```shell
yarn add express socket.io nodemon
```


<a id="orge56b67c"></a>

# Running the express based websocket server

We set up our server here. It will log a message each time a different client/user connects to it.

```js

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const port = 4001;
const io = require("socket.io")(server, { origins: "*:*" });

io.sockets.on("error", (e) => console.log(e));
server.listen(port, () => console.log(`Server is running on port ${port}`));

io.sockets.on("connection", (socket) => {
  console.log("A connection was established to Socket:", socket);
});
```

To start our server, we modify our `package.json` scripts to use our index.js file and with nodemon instead of node, giving us hot reloading. In our terminal we just need to type yarn start in a dedicated terminal each time we want to start the server.

```js
"scripts": {
  "start": "nodemon ./src/index.js"
},
```


<a id="org8af3a4a"></a>

# Making sure we will be able to connect to our server over the internet.

In order to do this we will use Ngrok to setup a public URL, <https://ngrok.com/>. You will be given instructions when you register. Once we have setup an account and have the executable on our system, we can run it. `4001` is the port number we are using for our server. More instructions here: <https://ngrok.com/docs#getting-started-expose>.

```shell
./ngrok http 4001
```

ngrok will print out information like this:

    Session Status                online
    Account                       Alex Scott (Plan: Free)
    Version                       2.3.38
    Region                        United States (us)
    Web Interface                 http://127.0.0.1:4040
    Forwarding                    http://417c4c64df9b.ngrok.io -> http://localhost:4001
    Forwarding                    https://417c4c64df9b.ngrok.io -> http://localhost:4001
    Connections                   ttl     opn     rt1     rt5     p50     p90
                                  0       0       0.00    0.00    0.00    0.00

Also, you can visit the link that Ngrok provides you, under "forwarding" above, and you should see a message about being connected. These are dynamic links and change everytime we connnect/ reconnect.

We can also test the websockets connection by modifying this script to use the public URI that NGROK provides. You just need to modify `wsUri` then open `websockets.html` in your browser.

```html
<!DOCTYPE html>
  <meta charset="utf-8" />
  <title>WebSocket Test</title>
  <script language="javascript" type="text/javascript">

  var wsUri = "ws://localhost:4001"; // CHANGE me to the match the server that you are using.
  var output;

  function init()
  {
    output = document.getElementById("output");
    testWebSocket();
  }

  function testWebSocket()
  {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
  }

  function onOpen(evt)
  {
    writeToScreen("CONNECTED");
    doSend("WebSocket rocks");
  }

  function onClose(evt)
  {
    writeToScreen("DISCONNECTED");
  }

  function onMessage(evt)
  {
    writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>');
    websocket.close();
  }

  function onError(evt)
  {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
  }

  function doSend(message)
  {
    writeToScreen("SENT: " + message);
    websocket.send(message);
  }

  function writeToScreen(message)
  {
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    output.appendChild(pre);
  }

  window.addEventListener("load", init, false);

  </script>

  <h2>WebSocket Test</h2>

  <div id="output"></div>
```
