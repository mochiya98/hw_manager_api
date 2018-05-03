const http = require("http");
const path = require("path");

const Mongod = require("./util/mongod");
const app = require("./app");

const config = require("./config");

const appServer = http.createServer(app);
appServer.on("error", e=>console.log(e));
appServer.on("listening", ()=>{
	const {port} = appServer.address();
	console.log(`Express Listening on http://127.0.0.1:${port}/`);
});

const mongod = new Mongod({
	conf: path.resolve(__dirname, "./mongodb/mongod.conf"),
	port: config.DB_PORT,
});
mongod.on("ready", (port_mongod)=>{
	console.log(`Mongod listening on mongodb://127.0.0.1:${port_mongod}/`);
	appServer.listen(config.HTTP_PORT);
});
mongod.on("close", ()=>{
	console.log("Mongod killed! stop server.");
	appServer.close(()=>process.exit());
});



console.log("starting...");
