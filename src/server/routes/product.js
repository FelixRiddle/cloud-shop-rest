const express = require("express");
const path = require("path");
const fs = require("fs");

const { createProductFolder, productFolder, insertProductImage } = require("../../lib/folder/product");
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
			
			insertProductImage(req.file, product);
			
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
			req.flash("messages", [{
				message: "Error 500: Internal error",
				type: "error"
			}]);
			
			const extra = await expandData(req);
			return res
				.status(500)
				.send({
					...extra
				});
		}
	});
	
	// FIXME: When using postman the body is not read by express or postman doesn't sends it
	router.put("/:productId", productImage, async (req, res) => {
		try {
			const {
				Product
			} = req.models;
			const productId = req.params.productId;
			
			// Get product
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
			
			insertProductImage(req.file, product);
			
			// This is a put request every field has to change even image
			const newProductData = {
				...req.body,
				image: product.image,
			};
			
			const newProduct = await Product.findOneAndUpdate(
				{
					_id: productId
				},
				newProductData,
				{
					new: true,
				}
			);
			
			return res.send({
				product: newProduct
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
