const path = require("path");

const PUBLIC_FOLDER = path.join(process.cwd(), 'public');
const PRODUCT_FOLDER = path.join(PUBLIC_FOLDER, "product");

exports.PUBLIC_FOLDER = PUBLIC_FOLDER;
exports.PRODUCT_FOLDER = PRODUCT_FOLDER;
