const express = require('express');
const expandData = require('../../lib/misc/expandData');

/**
 * Invoices
 */
function invoiceRouter() {
	const router = express.Router();
	
	router.post("/", async(req, res) => {
		try {
			const {
				Invoice
			} = req.models;
			
			const invoice = new Invoice(req.body);
			
			await invoice.save();
			
			req.flash("messages", [{
				message: "Invoice created",
				type: "success"
			}]);
			
			const extra = await expandData(req);
			return res.send({
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

module.exports = invoiceRouter;
