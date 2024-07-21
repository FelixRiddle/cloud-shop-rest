const express = require("express");

/**
 * User router
 */
function userRouter() {
	const router = express.Router();
	
	// Get authenticated user information
	router.get("/", (req, res) => {
		return res
			.status(200)
			.send({
				user: req.session.user
			});
	});
	
	return router;
}

module.exports = userRouter;
