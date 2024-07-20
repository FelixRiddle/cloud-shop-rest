
/**
 * Create client model
 */
function createClientModel(mongoose) {
	const Schema = mongoose.Schema;
	
	const clientSchema = new Schema({
		name: {
			type: String,
			trim: true,
		},
		surname: {
			type: String,
			trim: true,
		},
		company: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			unique: true,
			trim: true,
			// Lowercase the email or else we will have problems when trying to find users
			lowercase: true,
		},
		phoneNumber: {
			type: String,
			trim: true,
		}
	}, {
		timestamps: true,
	});
	
	const Client = mongoose.model("Client", clientSchema);
	
	return Client;
}

module.exports = createClientModel;
