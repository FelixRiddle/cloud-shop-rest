/**
 * Product model
 */
function createProductModel(mongoose) {
	const Schema = mongoose.Schema;
	
	const productSchema = new Schema({
		name: {
			type: String,
			trim: true,
		},
		price: {
			type: Number,
		},
		image: {
			type: String,
		},
		stock: {
			type: Number,
		}
	}, {
		timestamps: true,
	});
	
	const Product = mongoose.model("Product", productSchema);
	
	return Product;
}

module.exports = createProductModel;
