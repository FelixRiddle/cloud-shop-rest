const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const path = require("path");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");

const mainRouter = require("./routes");
const mongoUri = require("../lib/config/mongoUri");
const createClientModel = require("../models/Client");
const createProductModel = require("../models/Product");
const createInvoiceModel = require("../models/Invoice");

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
	
	app.use(cors({
		origin: function(origin, callback) {
			let frontUrl = process.env.FRONTEND_URL;
			if(!frontUrl && process.env.NODE_ENV === 'development') {
				// NextJS frontend
				frontUrl = "http://localhost:3009";
			}
			
			return callback(null, [
				frontUrl,
			]);
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
		
		next();
	});
	
	app.use(mainRouter());
	
	const PORT = process.env.PORT || 3008;
	
	app.listen(PORT, () => {
		console.log(`Server listening at`, PORT);
	});
}

module.exports = startServer;
