const express = require("express");

const clientRouter = require("./client");
const productRouter = require("./product");
const invoiceRouter = require("./invoice");

/**
 * Main router
 */
function mainRouter() {
	const router = express.Router();
	
	router.use("/client", clientRouter());
	router.use("/invoice", invoiceRouter());
	router.use("/product", productRouter());
	
	router.use((req, res) => {
		return res
			.status(404)
			.send({
				messages: [{
					message: "Error 404: Not found",
					type: "error",
				}]
			});
	});
	
	return router;
}

module.exports = mainRouter;
