- [Setting up NPM packages](#org8232d75)
- [Running the express based websocket server](#org49b53b7)

The API is a backend Express application which serves as a message broker for websockets.


<a id="org8232d75"></a>

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


<a id="org49b53b7"></a>

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

To start our server, we modify our package.json scripts to use our index.js file and with nodemon instead of node, giving us hot reloading. In our terminal we just need to type yarn start in a dedicated terminal each time we want to start the server.

```js
"scripts": {
  "start": "nodemon ./src/index.js"
},
```
