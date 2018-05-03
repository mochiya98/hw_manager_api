module.exports = {
	"DB_PORT"  : 3013,
	"DB_HOST"  : "mongodb://127.0.0.1:3013/hw_manager",
	"HTTP_PORT": parseInt(process.env.PORT || "3014", 10),
};
