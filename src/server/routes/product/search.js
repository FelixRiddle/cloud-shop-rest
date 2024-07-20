const express = require('express');

/**
 * Search router
 */
function searchRouter() {
	const router = express.Router();
	
	router.get("/:query", async (req, res) => {
		try {
			const query = req.params.query;
			const {
				Product
			} = req.models;
			
			const products = await Product.find({
				name: {
					$regex: query,
					$options: "i"
				},
			});
			
			if(!products) {
				return res
					.status(404)
					.send({
						messages: [{
							message: "Product doesn't exists",
							type: "error"
						}]
					});
			}
			
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
	
	return router;
}

module.exports = searchRouter;
