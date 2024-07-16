const express = require('express');
const expandData = require('../../lib/misc/expandData');

/**
 * Invoices
 */
function invoiceRouter() {
	const router = express.Router();
	
	// Create invoice
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
	
	// Retrieve invoices
	router.get("/", async (req, res) => {
		try {
			const {
				Invoice
			} = req.models;
			
			const invoices = await Invoice.find({})
				.populate("client")
				.populate({
					path: "invoices.product",
					model: "Product"
				});
			
			return res.send({
				invoices
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
