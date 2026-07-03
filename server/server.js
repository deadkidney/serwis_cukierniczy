import express from 'express';
import cors from 'cors'
import * as db from './database.js';

const corsOptions = {
	origin: ["http://localhost:5173"]
}

const app = express();
const port = 8080;
app.use(cors(corsOptions));

app.get("/api/recipes", db.getRecipes);
app.get('/api/recipeinfo', db.getRecipeById);
app.post('api/recipes', db.createRecipe);
app.delete('/api/recipeinfo', db.deleteRecipe);

app.get('/api/userinfo', db.getUserById);


app.listen(port, () => {
	console.log ("idk")
});