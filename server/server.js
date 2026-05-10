const express = require("express");
const cors = require("cors");
const corsOptions = {
	origin: ["http://localhost:5173"]
}

const app = express();
app.use(cors(corsOptions));

let shortRecipes = [{
    id: 1,
    title: "przepis",
}, {
    id: 2,
    title: "przepis 2",
}, {
    id: 3,
    title: "przepis 3",
}, {
    id: 4,
    title: "przepis 4",
}];

let recipes = [{
    id: 1,
    title: "przepis",
    ingredients: [{
        id: 0, name: "jajko", amount: 3, unit: "sztuka"
    }, {
        id: 1, name: "cukier", amount: 15, unit: "g"
    }]
}, {
    id: 2,
    title: "przepis 2",
    ingredients: [{
        id: 0, name: "mąka", amount: 340, unit: "g"
    }, {
        id: 1, name: "mleko", amount: 100, unit: "ml"
    }]
}];

app.get("/recipes", (req, res) => {
	res.json({ recipes: recipes });
});
// try catch


app.get('/recipeinfo', (req, res) => { 
    var id = req.query.id;
	if (id <= recipes.length)
		res.json({recipe: recipes[id-1]});
});

app.listen(8080, () => {
	console.log ("idk")
});