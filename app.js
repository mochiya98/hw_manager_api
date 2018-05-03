const config = require("./config");

const morgan = require("morgan");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(config.DB_HOST, {});

const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();

const HwManager = require("./router/hw_manager");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride(function({body = {}}, res){
	if (body._method !== void 0){
		const method = body._method;
		delete body._method;
		return method;
	}
}));
app.use(function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	next();
});

app.use(morgan("dev"));

app.use("/api/v1/hw_manager/", HwManager);

app.use(function(req, res, next){
	res.status(404)
		.json({error: "unknown route", result: null});
});
app.use(function(err, req, res, next){
	let errMessage = "unhandled_error";
	if(err.name.toString()==="ValidationError"){
		errMessage = err.message;
	}else{
		console.log(err);
	}
	res.status(err.statusCode?err.statusCode:500)
		.json({error: errMessage, result: null});
});

module.exports = app;
