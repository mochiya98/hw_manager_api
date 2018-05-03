const {spawn} = require("child_process");
const {EventEmitter} = require("events");
const {Socket} = require("net");

function testIsListenning(host, port, timeout = 3000){
	return new Promise((resolve, reject)=>{
		const client = new Socket();
		client.setTimeout(timeout);
		client.connect(port, host, function(){
			client.destroy();
			resolve(true);
		});
		function onFailed(){
			client.destroy();
			resolve(false);
		}
		client.on("timeout", onFailed);
		client.on("error", onFailed);
	});
}

class Mongod extends EventEmitter{
	constructor(options = {}){
		super();
		const args = [];
		
		if(options.conf){
			args.push("--config", options.conf);
		}
		if(options.port === void 0){
			options.port = 27017;
		}
		args.push("--port", options.port);
		
		const proc = spawn("mongod", args);
		
		proc.stdout.pipe(options.stdout ? options.stdout : process.stdout);
		proc.stderr.pipe(options.stderr ? options.stderr : process.stderr);
		proc.on("close", code=>this.emit("close", code));
	
		(async()=>{
			while(!await testIsListenning("127.0.0.1", options.port));
			this.emit("ready", options.port);
		})();
	}
}

module.exports = Mongod;
