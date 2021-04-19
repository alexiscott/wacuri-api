- [Setting up NPM packages](#org06043ea)

The API is a backend Express application which serves as a message broker for websockets.


<a id="org06043ea"></a>

# Setting up NPM packages

Install yarn globally. This presupposes that you already have NPM and NODE installed.

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
