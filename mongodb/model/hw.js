const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const uuid4_validator = require("../../util/uuid4_validator");

const HwCommentSchema = new Schema({
	id: {
		type    : String,
		required: true,
		sparse  : true,
		unique  : true,
		validate: {
			validator: uuid4_validator,
			message: 'ID "{VALUE}" is not a valid uuid4.',
		},
	},
	value: {
		type    : String,
		required: true,
	},
});


const HwSchema = new Schema(
	{
		id: {
			type    : String,
			required: true,
			unique  : true,
			validate: {
				validator: uuid4_validator,
				message: 'ID "{VALUE}" is not a valid uuid4.',
			},
		},
		no: {
			type    : Number,
			required: true,
			min     : 1,
			max     : 99,
		},
		s_code: {
			type    : String,
			required: true,
		},
		title: {
			type    : String,
			required: true,
		},
		expire: {
			type    : Number,
			required: true,
		},
		comments: {
			type    : [HwCommentSchema],
			required: true,
			default : [],
		},
	},
	{
		versionKey: false,
	}
);

module.exports = mongoose.model("hw", HwSchema);
