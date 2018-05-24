const fs = require("fs");

const {OpenApiValidator} = require("@mochiya98/express-openapi-validate");
const jsYaml = require("js-yaml");
const openApiDocument = jsYaml.safeLoad(
	fs.readFileSync("openapi.yaml", "utf-8")
);
const validator = new OpenApiValidator(openApiDocument, {ajvOptions: {coerceTypes: true}});


const htmlspecialchars = require("htmlspecialchars");

const express = require("express");
const router = express.Router();

const Hw = require("../mongodb/model/hw");

function badRequest(res, msg){
	res.status(400)
		.json({
			error: msg ? msg : "bad_request"
		});
}

function internalServerError(res, msg){
	res.status(500)
		.json({
			error: msg ? msg : "server_error"
		});
}

function addRoute(method, route, action){
	return router[method](
		route,
		validator.validate(
			method,
			route.replace(/:([^\/]+)/g,"{$1}")
		),
		action
	);
}

addRoute("get", "/hws", async function(req, res){
	//get all homeworks
	try{
		const hws = await Hw.find().exec();

		let result = {};
		hws.forEach(_hw=>{
			const hw = {..._hw._doc};
			delete hw._id;
			hw.comments =
				hw.comments.map(_c=>{
					const c = {..._c._doc};
					delete c._id;
					return c;
				});
			result[hw.id] = hw;
		});
		
		res.status(200)
			.json({
				result
			});
	}catch(e){
		console.log(e);
		internalServerError(res);
	}
});
addRoute("put", "/hws/:id", async function(req, res){
	//add,edit homework
	const {id} = req.params;
	const {expire, no, s_code, title} = req.body;
	const hw = {expire, id, no, s_code, title};
	
	const validateError = new Hw(hw).validateSync();
	if(validateError){
		console.log(validateError);
		badRequest(res, validateError.message);
		return;
	}

	try{
		await Hw.update(
			{id},
			{$set: hw},
			{upsert: true}
		);
		res.status(200)
			.json({
				result: {status: "ok"},
			});
	}catch(e){
		console.log(e);
		internalServerError(res);
	}
});
addRoute("get", "/hws/:id", async function(req, res){
	//get homework
	const {id} = req.params;
	try{
		const _hw = await Hw.findOne({id}).exec();

		if(_hw === null){
			badRequest(res);
		}

		const hw = {..._hw._doc};
		delete hw._id;
		hw.comments =
			hw.comments.map(_c=>{
				const c = {..._c._doc};
				delete c._id;
				return c;
			});

		res.status(200)
			.json({
				result: hw,
			});
	}catch(e){
		console.log(e);
		internalServerError(res);
	}
});
addRoute("delete", "/hws/:id", async function(req, res){
	//remove homework
	const {id} = req.params;
	try{
		await Hw.findOneAndRemove({id});
		res.status(200)
			.json({
				result: {status: "ok"},
			});
	}catch(e){
		console.log(e);
		internalServerError(res);
	}
});
addRoute("put", "/hws/:id/comments/:comment_id", async function(req, res){
	//add,edit comment to homework
	const {id, comment_id} = req.params;
	const {comment} = req.body;
	try{
		//update comment
		const updateResult = await Hw.findOneAndUpdate(
			{id, "comments.id": comment_id},
			{$set: {"comments.$.value": htmlspecialchars(comment)}}
		);
		const commentNotFound = updateResult === null;
		if(commentNotFound){
			//insert comment
			await Hw.findOneAndUpdate(
				{id},
				{$addToSet: {
					comments: {
						id: comment_id,
						value: htmlspecialchars(comment)
					}
				}},
			);
		}
		res.json({
			result: {status: "ok"},
		});
	}catch(e){
		console.log(e);
		internalServerError(res);
	}
});
addRoute("delete", "/hws/:id/comments/:comment_id", async function(req, res){
	//add,edit comment to homework
	const {id, comment_id} = req.params; console.log(req.params);
	try{
		//delete comment
		await Hw.findOneAndUpdate(
			{id},
			{$pull: {comments: {id: comment_id}}}
		);
		res.json({
			result: {status: "ok"},
		});
	}catch(e){
		console.log(e);
		internalServerError(res);
	}
});


module.exports = router;
