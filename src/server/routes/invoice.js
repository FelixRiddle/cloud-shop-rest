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
	
	// Single invoice
	router.get("/:invoiceId", async (req, res) => {
		try {
			const {
				Invoice
			} = req.models;
			
			const invoiceId = req.params.invoiceId;
			const invoice = await Invoice.findById(invoiceId)
				.populate("client")
				.populate({
					path: "invoices.product",
					model: "Product"
				});
			
			if(!invoice) {
				req.flash("messages", [{
					message: "Error 404: Not found",
					type: "error"
				}]);
				
				const extra = await expandData(req);
				return res
					.status(404)
					.send({
						...extra
					});
			}
			
			return res.send({
				invoice
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
	
	// Put
	router.put("/:invoiceId", async(req, res) => {
		try {
			const {
				Invoice
			} = req.models;
			
			const invoiceId = req.params.invoiceId;
			const invoice = await Invoice.findOneAndUpdate(
				{
					_id: invoiceId,
				},
				req.body,
				{
					new: true
				}
			);
			
			req.flash("messages", [{
				message: "Invoice updated",
				type: "success"
			}]);
			
			const extra = await expandData(req);
			return res.send({
				invoice,
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
	
	return router;
}

module.exports = invoiceRouter;
