const multer = require("multer");
const color = require("ansi-color");
const { v4: uuidv4 } = require("uuid");
const expandData = require("../misc/expandData");

const upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			const filePath = `${process.cwd()}/public/product`;
			return cb(null, filePath);
		},
		filename: async (req, file, cb) => {
			const extension = file.mimetype.split("/")[1];
			const filename = `${uuidv4()}.${extension}`;
			
			// TODO: There's a tiny leak where images of different extensions will be preserved
			// const {
			// 	User
			// } = req.models;
			
			// // User information
			// const user = await User.findByPk(req.user.id);
			
			// // If pfp exists
			// if(user.pfp) {
			// 	// Guard that there's only one pfp
			// 	const sameFile = filename === user.pfp;
			// 	if(!sameFile) {
			// 		// Just in case check for its existence
			// 		const pfpPath = userFolder.getPfp();
			// 		if(fs.existsSync(pfpPath)) {
			// 			// Delete previous pfp
			// 			fs.rmSync();
			// 		}
			// 	}
			// }
			
			// No need
			return cb(null, filename);
		},
	}),
	fileFilter: (req, file, cb) => {
		// // Check size
		// if(file.size > MAX_IMAGE_SIZE) {
		// 	return cb(null, false);
		// }
		
		// Check if it's an image
		const mimetype = file.mimetype;
		const isImage = mimetype.startsWith("image/");
		if(!isImage) {
			const message = "Only images are allowed.";
			console.log(color.set(message, "red"));
			return cb(new multer.MulterError({
				code: "LIMIT_FILE_TYPE",
				message,
			}));
		}
		
		return cb(null, true);
	}
}).single("image");

/**
 * Upload image middleware
 */
function productImage(req, res, next) {
	return upload(req, res, async function (err) {
		if(err) {
			console.error(err);
			if(err instanceof multer.MulterError) {
				if(err.code === "LIMIT_FILE_SIZE") {
					const message = "File size is too big";
					console.log(color.set(message, "red"));
					req.flash("messages", [{
						message,
						type: "error"
					}]);
				} else {
					const message = err.message;
					console.log(color.set(message, "red"));
					req.flash("messages", [{
						message,
						type: "error"
					}]);
				}
			} else if(err.hasOwnProperty("message")) {
				const message = err.message;
				console.log(color.set(message, "red"));
				req.flash("messages", [{
					message,
					type: "error"
				}]);
			}
			
			const messages = await expandData(req);
			return res.send({
				messages,
			});
		} else {
			return next();
		}
	});
}

module.exports = productImage;
