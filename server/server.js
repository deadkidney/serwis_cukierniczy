const express = require("express");
const cors = require("cors");
const corsOptions = {
	origin: ["http://localhost:5173"]
}

const app = express();
app.use(cors(corsOptions));

app.get("/api", (req, res) => {
	res.json({ message: "Hello from server!" });
});
// try catch

app.get('/userinfo', (req, res) => { 
    var username = req.query.id;
	if (username==1)
		res.json({message: "yay"});
});

app.listen(8080, () => {
	console.log ("idk")
});