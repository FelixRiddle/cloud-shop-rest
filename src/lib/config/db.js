const mongoose = require("mongoose");
const mongoUri = require("./mongoUri");

/**
 * Mongoose connection
 */
function mongooseConnection() {
	const uri = mongoUri();
	
	mongoose.connect(uri);
	
	mongoose.connection.on('error', (error) => {
		console.error(error);
	});
	
	return mongoose;
}

module.exports = mongooseConnection;
