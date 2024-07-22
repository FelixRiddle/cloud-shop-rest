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
	
	router.get("/logout", async (req, res) => {
		try {
			req.session.destroy();
			
			// Flash doesn't work without the sessions
			return res.send({
				messages: [{
					message: "Logged out",
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

module.exports = userRouter;
