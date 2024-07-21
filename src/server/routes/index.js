const express = require("express");

const clientRouter = require("./client");
const productRouter = require("./product");
const invoiceRouter = require("./invoice");
const authRouter = require("./auth");
const userRouter = require("./user");

/**
 * Main router
 */
function mainRouter() {
	const router = express.Router();
	
	router.use("/auth", authRouter());
	router.use("/client", clientRouter());
	router.use("/invoice", invoiceRouter());
	router.use("/product", productRouter());
	router.use("/user", userRouter());
	
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
