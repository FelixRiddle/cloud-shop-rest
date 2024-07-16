const fs = require("fs");
const path = require('path');
const { PRODUCT_FOLDER } = require("./folderPath");

/**
 * Get product folder
 */
function productFolder(id) {
	return path.join(PRODUCT_FOLDER, id);
}

/**
 * Create product folder if it doesn't exists
 * 
 * Returns its path
 */
function createProductFolder(id) {
	const folder = productFolder(id);
	if (!fs.existsSync(folder)) {
		fs.mkdirSync(folder);
	}
	
	return folder;
}

/**
 * Insert new product image
 * 
 * Remove previous
 */
function insertProductImage(file, productModel) {
	// Check if a file was given
	if(file) {
		const id = productModel.id.toString();
		
		// Products could have more things other than images so we create a folder for it
		// Create product folder
		const folder = createProductFolder(id);
		
		// Check if the product has an image
		if(productModel.image) {
			// Check if it exists first just in case
			if (!fs.existsSync(folder)) {
				// Delete it
				const previousImageFile = path.join(folder, productModel.image);
				fs.rmSync(previousImageFile);
			}
		}
		
		// Move image to product folder
		const extension = file.mimetype.split("/")[1];
		const filename = `image.${extension}`;
		const newFilePath = path.join(folder, filename);
		
		fs.rename(file.path, newFilePath, function (err) {
			console.error(err);
		});
		
		// Insert file name
		productModel.image = filename;
	}
}

exports.productFolder = productFolder;
exports.createProductFolder = createProductFolder;
exports.insertProductImage = insertProductImage;
