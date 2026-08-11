import express from 'express';
import cors from 'cors'
import * as db from './repository.js';
import * as auth from './authentication.js'

const corsOptions = {
	origin: ["http://localhost:5173"]
}

const app = express();
const port = 8080;
app.use(cors(corsOptions));
app.use(express.json());
app.use(auth.processToken);

app.post('/api/register', async (req, res) => {
	const { username, password } = req.body;
	const rows = await auth.register(username, password);
	res.status(200).json(rows);
});
app.post('/api/login', async (req, res) => {
	const { username, password } = req.body;
	const rows = await auth.login(username, password);
	res.status(200).json(rows);
});


app.get("/api/recipes", async (req, res) => {
	const {page, limit} = req.query;
	const rows = await db.getRecipes(page, limit);
	const count = await db.getRecipesAmount();
	res.status(200).json({rows, count});
});
app.get("/api/recipes/filtered", async (req, res) => {
	const search = '%'+req.query.search+'%';
	const {page, limit} = req.query;
	const rows = await db.getFilteredRecipes(search, page, limit);
	const count = await db.getFilteredRecipesAmount(search);
	res.status(200).json({rows, count});
});
app.get("/api/recipes/authored", async (req, res) => {
	const author = parseInt(req.query.author);
	const {page, limit} = req.query;
	const rows = await db.getRecipesByAuthor(author, page, limit);
	const count = await db.getRecipesByAuthorAmount(author);
	res.status(200).json({rows, count});
});
app.get("/api/recipes/liked", async (req, res) => {
	const user = parseInt(req.query.user);
	const {page, limit} = req.query;
	const rows = await db.getLikedRecipes(user, page, limit);
	const count = await db.getLikedRecipesAmount(user);
	res.status(200).json({rows, count});
});
app.get('/api/recipeinfo', async (req, res) => {
	const id = parseInt(req.query.id);
	const rows = await db.getRecipeById(id);
	res.status(200).json(rows);
});
app.post('/api/recipes', async (req, res) => {
	const { title, user_id, content, portions } = req.body;
	const rows = await db.createRecipe(title, user_id, content, portions);
	res.status(201).json({id: rows[0].id});
});
app.put('/api/recipeinfo', async (req, res) => {
	const id = parseInt(req.query.id);
	const { title, content, portions, accepted } = req.body;
	await db.updateRecipe(id, title, content, portions, accepted);
	res.status(200).send(`updated recipe ${id}`);
});
app.delete('/api/recipeinfo', async (req, res) => {
	const id = parseInt(req.query.id);
	await db.deleteRecipe(id);
	res.status(200).send(`deleted recipe ${id} and corresponding likes and comments`);
});


app.get('/api/users', async (req, res) => {
	const rows = await db.getUsers();
	res.status(200).json(rows);
});
app.get('/api/userinfo', async (req, res) => {
	const id = parseInt(req.query.id);
	const rows = await db.getUserById(id);
	res.status(200).json(rows);
});
app.put('/api/userinfo', async (req, res) => {
	const id = parseInt(req.query.id);
	await db.changeRole(id);
	res.status(200).send(`updated user ${id}`);
});
app.delete('/api/userinfo', async (req, res) => {
	const id = parseInt(req.query.id);
	await db.deleteUser(id);
	res.status(200).send(`deleted user ${id} and corresponding recipes`);
});


app.get('/api/likes', async (req, res) => {
	const recipe = parseInt(req.query.recipe);
	const rows = await db.getLikesByRecipe(recipe);
	res.status(200).json(rows);
});
app.post('/api/likes', async (req, res) => {
	const { user_id, recipe_id } = req.body;
	await db.addLike(user_id, recipe_id);
	res.status(201).send('like added');
});
app.delete('/api/likes', async (req, res) => {
	const { user_id, recipe_id } = req.body;
	await db.deleteLike(user_id, recipe_id);
	res.status(200).send('deleted like');
});


app.get('/api/comments', async (req, res) => {
	const recipe = parseInt(req.query.recipe);
	const rows = await db.getCommentsByRecipe(recipe);
	res.status(200).json(rows);
});
app.post('/api/comments', async (req, res) => {
	const { recipe_id, user_id, content } = req.body;
	await db.addComment(recipe_id, user_id, content);
	res.status(201).send('comment added');
});
app.delete('/api/comments', async (req, res) => {
	const id = parseInt(req.query.id);
	await db.deleteComment(id);
	res.status(200).send('deleted comment');
});


app.listen(port, () => {
	console.log ("funguje")
});