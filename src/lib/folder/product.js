const fs = require("fs");
const path = require('path');
const { PRODUCT_FOLDER } = require("./folderPath");

/**
 * Get product folder
 */
exports.productFolder = function productFolder(id) {
	return path.join(PRODUCT_FOLDER, id);
}

/**
 * Create product folder
 */
exports.createProductFolder = function createProductFolder(id) {
	const productFolder = path.join(PRODUCT_FOLDER, id);
	if (!fs.existsSync(productFolder)) {
		fs.mkdirSync(productFolder);
	}
}
