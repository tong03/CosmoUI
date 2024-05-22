const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("data/db.json");
const middlewares = jsonServer.default();
const port = process.env.PORT || 3500; // can change port

server.use(middlewares);
server.use(router);
server.listen(port);