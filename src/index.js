const express = require("express");

const mainRouter = require("./routes");

const app = express();

app.use(mainRouter());

const PORT = process.env.PORT || 3008;

app.listen(PORT, () => {
	console.log(`Server listening at`, PORT);
});

