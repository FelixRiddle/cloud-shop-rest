const express = require("express");
const path = require("path");
const fs = require("fs");

const { createProductFolder, productFolder } = require("../../lib/folder/product");
const productImage = require("../../lib/upload/productImage");

/**
 * Products router
 */
function productRouter() {
	const router = express.Router();
	
	router.post("/", productImage, async (req, res) => {
		try {
			const {
				Product
			} = req.models;
			
			const product = new Product(req.body);
			
			console.log(`File: `, req.file);
			const file = req.file
			if(file) {
				const id = product.id.toString();
				
				// Products could have more things other than images so we create a folder for it
				// Create product folder
				createProductFolder(id);
				
				// Move image to product folder
				const extension = file.mimetype.split("/")[1];
				const filename = `image.${extension}`;
				const folder = productFolder(id);
				const newFilePath = path.join(folder, filename);
				
				fs.rename(file.path, newFilePath, function (err) {
					console.error(err);
				});
				
				// Insert file name
				product.image = filename;
			}
			
			await product.save();
			
			return res.send({
				messages: [{
					message: "Product inserted",
					type: "success"
				}]
			});
		} catch(err) {
			console.error(err);
			return res
				.status(500)
				.send({
					messages: [{
						message: "Error 500: Internal error",
						type: "error"
					}]
				});
		}
	});
	
	return router;
}

module.exports = productRouter;
