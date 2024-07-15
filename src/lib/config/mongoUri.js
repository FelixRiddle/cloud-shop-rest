
/**
 * Craft mongo uri
 */
function mongoUri() {
	const MONGODB_HOST = process.env.MONGODB_HOST || "localhost";
	const MONGODB_PORT = process.env.MONGODB_PORT || 27017;
	const MONGODB_DATABASE = process.env.MONGODB_DATABASE_NAME || "dev-jobs";
	// const MONGODB_USER = process.env.MONGODB_USER;
	// const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
	// const MONGODB_URI = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}`;
	const MONGODB_URI = `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`;
	
	return MONGODB_URI;
}

module.exports = mongoUri;
