import express from 'express';
import cors from 'cors'
import * as db from './database.js';

const corsOptions = {
	origin: ["http://localhost:5173"]
}

const app = express();
const port = 8080;
app.use(cors(corsOptions));
app.use(express.json());

app.get("/api/recipes", db.getRecipes);
app.get('/api/recipeinfo', db.getRecipeById);
app.get("/api/recipes/authored", db.getRecipesByAuthor);
app.get("/api/recipes/liked", db.getLikedRecipes);
app.post('/api/recipes', db.createRecipe);
app.put('/api/recipeinfo', db.updateRecipe);
app.delete('/api/recipeinfo', db.deleteRecipe);

app.get('/api/users', db.getUsers);
app.get('/api/userinfo', db.getUserById);

app.get('/api/likes', db.getLikesAmount);

app.listen(port, () => {
	console.log ("idk")
});