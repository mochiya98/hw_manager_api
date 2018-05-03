const uuid4_regex =
	/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

function validator(v){
	uuid4_regex.test(v);
}

module.exports = validator;
