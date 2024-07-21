const express = require("express");

const expandData = require("../../lib/misc/expandData");

/**
 * Auth router
 */
function authRouter() {
	const router = express.Router();
	
	router.post("/register", async (req, res) => {
		try {
			// Check if the user is logged in
			if(req.session.user) {
				req.flash("messages", [{
					message: "You're already logged in bruh",
					type: "error"
				}]);
				
				const extra = await expandData(req);
				return res
					.status(403)
					.send({
						...extra
					});
			}
			
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
			// Check if the user is logged in
			if(req.session.user) {
				req.flash("messages", [{
					message: "You're already logged in bruh",
					type: "error"
				}]);
				
				const extra = await expandData(req);
				return res
					.status(403)
					.send({
						...extra
					});
			}
			
			// Fetch user
			const {
				User
			} = req.models;
			
			const {
				password,
				email
			} = req.body;
			
			const user = await User.findOne({
				email,
			});
			
			// Validate that the user exists
			const message = "Error 400: User or password is wrong";
			if(!user) {
				req.flash("messages", [{
					message,
					type: "error"
				}]);
				
				const extra = await expandData(req);
				return res
					.status(400)
					.send({
						...extra
					});
			}
			
			// Validate password
			const result = await user.validatePassword(password);
			if(!result) {
				req.flash("messages", [{
					message,
					type: "error"
				}]);
				
				const extra = await expandData(req);
				return res
					.status(400)
					.send({
						...extra
					});
			}
			
			// Delete password
			delete user.password;
			
			// I've come to the conclusion that jwt is no longer needed
			// Store user in the session object
			req.session.user = user;
			
			// Semantic OP
			const minute = 60 * 1000;
			const hour = minute * 60;
			const day = hour * 24;
			req.session.cookie.maxAge = day;
			
			// Have to manually save for some reason
			req.session.save();
			
			// Send back
			req.flash("messages", [{
				message: "Logged in",
				type: "success"
			}]);
			
			const extra = await expandData(req);
			return res
				.status(200)
				.send({
					...extra
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
	
	return router;
}

module.exports = authRouter;
