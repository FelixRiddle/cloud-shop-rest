const expandData = require("../misc/expandData");

/**
 * Return unauthorized if the user is not logged in
 */
async function userVanguard(req, res, next) {
	if(!req.session.user) {
		req.flash("messages", [{
			message: "Error 401: Unauthorized",
			type: "error"
		}]);
		
		const extra = await expandData(req);
		return res.status(401)
			.send({
				...extra,
			});
	}
	
	return next();
}

module.exports = userVanguard;
