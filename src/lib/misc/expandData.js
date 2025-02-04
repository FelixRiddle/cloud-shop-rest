const color = require('ansi-color');

/**
 * Expand data
 * 
 * Options:
 * [Option name]: [Default value]
 * 
 * - useSession: true
 * Uses the current session of passport, this is sometimes not recommended because the information
 * is outdated, and I don't know how to revalidate a session.
 */
async function expandData(req, options = {
	useSession: true
}) {
	if(!req) {
		throw Error("You must pass 'req' for expand data to work");
	}
	
	// const {
	// 	User
	// } = req.models;
	
	// User
	let user = undefined;
	// if(req.user) {
	// 	// Update session if required
	// 	if(!options.useSession) {
	// 		user = await User.findByPk(req.user.id, {
	// 			raw: true,
	// 		});
	// 	} else {
	// 		user = JSON.parse(JSON.stringify(req.user));
	// 	}
	// }
	
	// Messages
	let messages = [];
	const flashMessages = req.flash().messages;
	if(flashMessages) {
		messages = messages.concat(flashMessages);
		
		for(const message of messages) {
			if(message.type === "error" || message.error) {
				console.log(color.set(message.message, "red"));	
			} else {
				console.log(color.set(message.message, "green"));	
			}
		}
	}
	
	return {
		user,
		messages
	};
}

module.exports = expandData;
