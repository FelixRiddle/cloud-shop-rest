const express = require("express");
const path = require("path");
const fs = require("fs");

const { createProductFolder, productFolder } = require("../../lib/folder/product");
const productImage = require("../../lib/upload/productImage");
const expandData = require("../../lib/misc/expandData");

/**
 * Products router
 */
function productRouter() {
	const router = express.Router();
	
	// Create product
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
	
	// Show all products
	// TODO: Pagination
	router.get("/", async(req, res) => {
		try {
			const {
				Product
			} = req.models;
			
			const products = await Product.find({});
			
			return res.send({
				products
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
	
	// Show a product by id
	router.get("/:productId", async (req, res) => {
		try {
			const {
				Product
			} = req.models;
			const productId = req.params.productId;
			const product = await Product.findById(productId);
			
			if(!product) {
				req.flash("messages", [{
					message: "Product doesn't exists",
					type: "error"
				}]);
				
				const extra = await expandData(req);
				return res
					.status(404)
					.send({
						...extra,
					});
			}
			
			return res
				.send({
					product,
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
