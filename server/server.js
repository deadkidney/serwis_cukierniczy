import express from 'express';
import cors from 'cors'
import * as db from './database.js';
import * as auth from './authentication.js'

const corsOptions = {
	origin: ["http://localhost:5173"]
}

const app = express();
const port = 8080;
app.use(cors(corsOptions));
app.use(express.json());

app.post('/api/login', auth.login)

app.get("/api/recipes", db.getRecipes);
app.get('/api/recipeinfo', db.getRecipeById);
app.get("/api/recipes/authored", db.getRecipesByAuthor);
app.get("/api/recipes/liked", db.getLikedRecipes);
app.get("/api/recipes/filtered", db.getFilteredRecipes);
app.post('/api/recipes', db.createRecipe);
app.put('/api/recipeinfo', db.updateRecipe);
app.delete('/api/recipeinfo', db.deleteRecipe);

app.get('/api/users', db.getUsers);
app.get('/api/userinfo', db.getUserById);

app.get('/api/likes', db.getLikesAmount);
app.post('/api/likes', db.addLike);

app.get('/api/comments', db.getCommentsByRecipe);
app.post('/api/comments', db.addComment);

app.listen(port, () => {
	console.log ("funguje")
});