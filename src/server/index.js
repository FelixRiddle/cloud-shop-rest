const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const path = require("path");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const color = require("ansi-color");

const mainRouter = require("./routes");
const mongoUri = require("../lib/config/mongoUri");
const createClientModel = require("../models/Client");
const createProductModel = require("../models/Product");
const createInvoiceModel = require("../models/Invoice");
const { DEVELOPMENT } = require("../lib/config/env");

/**
 * Main function
 */
async function startServer(conn) {
	const app = express();
	
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true,
	}));
	app.use(cookieParser(process.env.SECRET_KEY));
	
	// Public folder
	app.use(express.static(path.join(process.cwd(), "public")));
	
	// Cheap tricks 😝
	const secretToken = process.env.SECRET_TOKEN || `${uuidv4()}-${uuidv4()}`;
	const secretKeyName = process.env.SECRET_KEY_NAME || uuidv4();
	
	// Session
	app.use(session({
		secret: secretToken,
		key: secretKeyName,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			mongoUrl: mongoUri(),
		})
	}));
	
	// // Passport
	// const passport = passportInstance(sequelizeModels);
	// app.use(passport.initialize());
	// // I've forgot to put this one before
	// app.use(passport.session());
	
	// Use flash
	app.use(flash());
	
	// Whitelist
	let whitelist = [];
	let frontUrl = process.env.FRONTEND_URL;
	if(!frontUrl && DEVELOPMENT) {
		// NextJS frontend
		frontUrl = "http://localhost:3009";
	}
	whitelist.push(frontUrl);
	app.use(cors({
		origin: function(origin, callback) {
			// Postman error, there's no origin, testing only
			if(!origin && DEVELOPMENT){
			  return callback(null, true);
			}
			
			if (whitelist.indexOf(origin) !== -1) {
				callback(null, true)
			} else {
				callback(new Error('Not allowed by CORS'))
			}
		}
	}));
	
	const models = {
		Client: createClientModel(conn),
		Product: createProductModel(conn),
		Invoice: createInvoiceModel(conn),
	};
	
	// Middleware
	app.use((req, res, next) => {
		req.models = models;
		
		switch(req.method) {
			case "POST": {
				const method = color.set(`${req.method}`, "yellow");
				console.log(`${method} ${req.originalUrl}`);
				break;
			}
			case "GET": {
				const method = color.set(`${req.method}`, "green");
				console.log(`${method} ${req.originalUrl}`);
				break;
			}
			case "DELETE": {
				const method = color.set(`${req.method}`, "red");
				console.log(`${method} ${req.originalUrl}`);
				break;
			}
			case "PUT": {
				const method = color.set(`${req.method}`, "blue");
				console.log(`${method} ${req.originalUrl}`);
				break;
			}
			case "PATCH": {
				const method = color.set(`${req.method}`, "magenta");
				console.log(`${method} ${req.originalUrl}`);
				break;
			}
		}
		
		next();
	});
	
	app.use("/public", express.static("public"));
	app.use(mainRouter());
	
	const PORT = process.env.PORT || 3008;
	
	app.listen(PORT, () => {
		console.log(`Server listening at`, PORT);
	});
}

module.exports = startServer;
