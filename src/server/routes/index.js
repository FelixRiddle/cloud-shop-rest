const express = require("express");

const clientRouter = require("./client");

/**
 * Main router
 */
function mainRouter() {
	const router = express.Router();
	
	router.use("/client", clientRouter);
	
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
