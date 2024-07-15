const express = require('express');

const clientRouter = express.Router();

clientRouter.post("/", async (req, res) => {
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

module.exports = clientRouter;
