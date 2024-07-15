const express = require('express');

/**
 * Client router
 */
function clientRouter() {
	const router = express.Router();
	
	router.post("/", async (req, res) => {
		try {
			const {
				Client
			} = req.models;
			
			const clientModel = new Client(req.body);
			await clientModel.save();
			
			return res.send({
				messages: [{
					message: "User created",
					type: "success"
				}]
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
	
	router.get("/", async(req, res) => {
		try {
			const {
				Client
			} = req.models;
			
			const clients = await Client.find({});
			
			return res.send({
				clients,
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
	
	router.get("/:clientId", async(req, res) => {
		try {
			const {
				Client
			} = req.models;
			
			const clientId = req.params.clientId;
			
			const client = await Client.findById(clientId);
			
			if(!client) {
				return res.status(404)
					.send({
						messages: [{
							message: "Client doesn't exists",
							type: "error"
						}]
					});
			}
			
			return res.send({
				client
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
	
	// Update the client completely
	router.put("/:clientId", async(req, res) => {
		try {
			const {
				Client
			} = req.models;
			
			// TODO: This requires authentication
			const clientId = req.params.clientId;
			const client = await Client.findOneAndUpdate(
				{
					_id: clientId
				},
				req.body,
				{
					new: true,
				});
			
			return res.send({
				client,
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
	
	router.delete("/:clientId", async(req, res, next) => {
		try {
			const {
				Client
			} = req.models;
			
			const clientId = req.params.clientId;
			
			// TODO: This requires authentication
			const client = await Client.findOneAndDelete({ _id: clientId });
			
			return res.send({
				messages: [{
					message: "Client deleted",
					type: "success"
				}]
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

module.exports = clientRouter;
