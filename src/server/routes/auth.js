const express = require("express");
const bcrypt = require("bcrypt");

const expandData = require("../../lib/misc/expandData");

/**
 * Auth router
 */
function authRouter() {
	const router = express.Router();
	
	router.post("/register", async (req, res) => {
		try {
			const {
				User
			} = req.models;
			
			const user = new User(req.body);
			
			await user.save();
			
			req.flash("messages", [{
				message: "Account created",
				type: "success"
			}]);
			
			const extra = await expandData(req);
			return res.send({
				...extra,
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
	
	router.post("/login", async(req, res) => {
		try {
			
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
	
	return router;
}

module.exports = authRouter;
