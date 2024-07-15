const mongooseConnection = require("./lib/config/db");
const startServer = require("./server");

const dotenv = require("dotenv");

/**
 * Main
 */
async function main() {
	dotenv.config({
		path: ".env"
	});
	
	const conn = mongooseConnection();
	
	await startServer(conn);
}

main();
