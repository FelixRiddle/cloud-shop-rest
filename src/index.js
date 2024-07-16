const dotenv = require("dotenv");
const fs = require('fs');
const path = require('path');

const mongooseConnection = require("./lib/config/db");
const startServer = require("./server");

/**
 * Create public directories
 */
function createPublicDirectories() {
	// Create public folder
	const publicFolder = path.join(process.cwd(), 'public');
	if (!fs.existsSync(publicFolder)) {
		fs.mkdirSync(publicFolder);
	}
	
	// Product folder
	const productFolder = path.join(publicFolder, "product");
	if(!fs.existsSync(productFolder)) {
		fs.mkdirSync(productFolder);
	}
	
	// Uploads
	const uploadsFolder = path.join(publicFolder, 'uploads');
	if (!fs.existsSync(uploadsFolder)) {
		fs.mkdirSync(uploadsFolder);
	}
	
	// User
	const userFolder = path.join(publicFolder, 'user');
	if (!fs.existsSync(userFolder)) {
		fs.mkdirSync(userFolder);
	}
}

/**
 * Main
 */
async function main() {
	dotenv.config({
		path: ".env"
	});
	
	createPublicDirectories();
	
	const conn = mongooseConnection();
	
	await startServer(conn);
}

main();
