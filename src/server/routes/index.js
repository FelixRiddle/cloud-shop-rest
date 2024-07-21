const express = require("express");

const clientRouter = require("./client");
const productRouter = require("./product");
const invoiceRouter = require("./invoice");
const authRouter = require("./auth");
const userRouter = require("./user");
const userVanguard = require("../../lib/middleware/userVanguard");

/**
 * Main router
 */
function mainRouter() {
	const router = express.Router();
	
	router.use("/auth", authRouter());
	router.use("/client", userVanguard, clientRouter());
	router.use("/invoice", userVanguard, invoiceRouter());
	router.use("/product", userVanguard, productRouter());
	router.use("/user", userVanguard, userRouter());
	
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
