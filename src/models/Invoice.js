/**
 * Invoice model
 */
function createInvoiceModel(mongoose) {
	const Schema = mongoose.Schema;
	
	const invoiceSchema = new Schema({
		client: {
			type: Schema.ObjectId,
			ref: "Client"
		},
		invoices: [{
			product: {
				type: Schema.ObjectId,
				ref: "Product"
			},
			quantity: {
				type: Number,
			}
		}],
		total: {
			type: Number,
		}
	});
	
	const Invoice = mongoose.model("Invoice", invoiceSchema);
	
	return Invoice;
}

module.exports = createInvoiceModel;
