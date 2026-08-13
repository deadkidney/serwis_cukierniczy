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


app.get("/api/recipes/filtered", async (req, res) => {
	const {search, tags, page, limit} = req.query;
	const searchfilter = '%'+search+'%';
	const tagfilter = tags ? tags.split(',').map((tag) => `AND '${tag}' = ANY (tags)`).join(' ') : '';
	const rows = await db.getFilteredRecipes(searchfilter, tagfilter, page, limit);
	const count = await db.getFilteredRecipesAmount(searchfilter, tagfilter);
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
	const { title, user_id, content, portions, tags } = req.body;
	if(req.user.role === 'VIEVER' || req.user.id != user_id)
		throw new Error('invalid credentials');
	const id = await db.createRecipe(title, user_id, content, portions, tags);
	res.status(201).json({id});
});
app.put('/api/recipeinfo', async (req, res) => {
	const id = parseInt(req.query.id);
	const { title, content, portions, tags, accepted } = req.body;
	const recipe = await db.getRecipeById(id);
	if((req.user.role === 'VIEVER' || req.user.id != recipe.user_id) && req.user.role !== 'ADMIN')
		throw new Error('invalid credentials');
	await db.updateRecipe(id, title, content, portions, tags, accepted);
	res.status(200).send(`updated recipe ${id}`);
});
app.delete('/api/recipeinfo', async (req, res) => {
	const id = parseInt(req.query.id);
	const recipe = await db.getRecipeById(id);
	if((req.user.role === 'VIEVER' || req.user.id != recipe.user_id) && req.user.role !== 'ADMIN')
		throw new Error('invalid credentials');
	await db.deleteRecipe(id);
	res.status(200).send(`deleted recipe ${id} and corresponding likes and comments`);
});


app.get('/api/users', async (req, res) => {
	if(req.user.role !== 'ADMIN')
		throw new Error('invalid credentials');
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
	if(req.user.role !== 'ADMIN')
		throw new Error('invalid credentials');
	await db.changeRole(id);
	res.status(200).send(`updated user ${id}`);
});
app.delete('/api/userinfo', async (req, res) => {
	const id = parseInt(req.query.id);
	if((req.user.role === 'VIEVER' || req.user.id != id) && req.user.role !== 'ADMIN')
		throw new Error('invalid credentials');
	await db.deleteUser(id);
	res.status(200).send(`deleted user ${id} and corresponding recipes`);
});

app.get('/api/likes', async (req, res) => {
	const { recipe, user } = req.query;
	if(req.user.role === 'VIEVER' || req.user.id != user)
		throw new Error('invalid credentials');
	const rows = await db.getIsLiked(recipe, user);
	res.status(200).json(rows);
});
app.post('/api/likes', async (req, res) => {
	const { user_id, recipe_id } = req.body;
	if(req.user.role === 'VIEVER' || req.user.id != user_id)
		throw new Error('invalid credentials');
	await db.addLike(user_id, recipe_id);
	res.status(201).send('like added');
});
app.delete('/api/likes', async (req, res) => {
	const { user_id, recipe_id } = req.body;
	if(req.user.role === 'VIEVER' || req.user.id != user_id)
		throw new Error('invalid credentials');
	await db.deleteLike(user_id, recipe_id);
	res.status(200).send('deleted like');
});

app.get('/api/ratings/my', async (req, res) => {
	const { user, recipe } = req.query;
	if(req.user.role === 'VIEVER' || req.user.id != user)
		throw new Error('invalid credentials');
	const value = await db.getRating(user, recipe);
	res.status(200).json(value);
});
app.get('/api/ratings/avg', async (req, res) => {
	const recipe = parseInt(req.query.recipe);
	const avg = await db.getRatingAverage(recipe);
	res.status(200).json(avg);
});
app.post('/api/ratings', async (req, res) => {
	const { user_id, recipe_id, value } = req.body;
	if(req.user.role === 'VIEVER' || req.user.id != user_id)
		throw new Error('invalid credentials');
	await db.addRating(user_id, recipe_id, value);
	res.status(201).send('rating added');
});
app.delete('/api/ratings', async (req, res) => {
	const { user_id, recipe_id } = req.body;
	if(req.user.role === 'VIEVER' || req.user.id != user_id)
		throw new Error('invalid credentials');
	await db.deleteRating(user_id, recipe_id);
	res.status(200).send('deleted rating');
});

app.get('/api/comments', async (req, res) => {
	const recipe = parseInt(req.query.recipe);
	const rows = await db.getCommentsByRecipe(recipe);
	res.status(200).json(rows);
});
app.post('/api/comments', async (req, res) => {
	const { recipe_id, user_id, content } = req.body;
	if(req.user.role === 'VIEVER' || req.user.id != user_id)
		throw new Error('invalid credentials');
	await db.addComment(recipe_id, user_id, content);
	res.status(201).send('comment added');
});
app.delete('/api/comments', async (req, res) => {
	const id = parseInt(req.query.id);
	if((req.user.role === 'VIEVER' || req.user.id != recipe[0].user_id) && req.user.role !== 'ADMIN')
		throw new Error('invalid credentials');
	await db.deleteComment(id);
	res.status(200).send('deleted comment');
});

app.get('/api/tags', async (req, res) => {
	const rows = await db.getTags();
	res.status(200).json(rows);
});


app.listen(port, () => {
	console.log ("funguje")
});