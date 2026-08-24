//server.js
//
// backend server and routing
//
//

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
app.use(auth.processToken); //process the JWT

//function for testing the behaviour in the case of a slow response
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


// ---------------- user login ----------------

//register a user
app.post('/api/register', async (req, res) => {
	const { username, password } = req.body;
	const rows = await auth.register(username, password);
	res.status(201).json(rows);
});

//login a user
app.post('/api/login', async (req, res) => {
	const { username, password } = req.body;
	const rows = await auth.login(username, password);
	res.status(200).json(rows);
});


// ---------------- user data ----------------

//send the list of users
app.get('/api/users', async (req, res) => {
	if(req.user.role !== 'ADMIN')
		throw new Error('invalid credentials');
	const {page, limit} = req.query;
	const rows = await db.getUsers(page, limit);
	const count = await db.getUsersAmount(); //amount of all users, used for pagination
	res.status(200).json({rows, count});
});

//send data about a given user
app.get('/api/userinfo', async (req, res) => {
	const id = parseInt(req.query.id);
	const rows = await db.getUserById(id);
	res.status(200).json(rows);
});

//change the role of a user (ADMIN <-> USER)
app.put('/api/userinfo', async (req, res) => {
	const id = parseInt(req.query.id);
	if(req.user.role !== 'ADMIN')
		throw new Error('invalid credentials');
	await db.changeRole(id);
	res.status(200).send(`updated user ${id}`);
});

//delete a user
app.delete('/api/userinfo', async (req, res) => {
	const id = parseInt(req.query.id);
	if((req.user.role === 'VIEVER' || req.user.id != id) && req.user.role !== 'ADMIN')
		throw new Error('invalid credentials');
	await db.deleteUser(id);
	res.status(200).send(`deleted user ${id} and corresponding recipes`);
});


// ---------------- listing recipes ----------------

//send the list of recipes filtered by name and tags
app.get("/api/recipes/filtered", async (req, res) => {
	const {search, tags, page, limit} = req.query;
	let acceptedtags = await db.getTags(); //get the list of accepted tags
	acceptedtags = acceptedtags.map((tag) => {return tag.name;});
	const taglist = tags.split(',').filter((tag) => acceptedtags.includes(tag))//filter tags to include only accepted, safe tags
	const rows = await db.getFilteredRecipes(search, taglist, page, limit);
	const count = await db.getFilteredRecipesAmount(search, taglist); //amount of all matching recipes, used for pagination
	res.status(200).json({rows, count});
});

//send the list of recipes by a given author
app.get("/api/recipes/authored", async (req, res) => {
	const author = parseInt(req.query.author);
	const {page, limit} = req.query;
	const rows = await db.getRecipesByAuthor(author, page, limit);
	const count = await db.getRecipesByAuthorAmount(author); //amount of all matching recipes, used for pagination
	res.status(200).json({rows, count});
});

//send the list of recipes added to favourites by a given user
app.get("/api/recipes/favourite", async (req, res) => {
	const user = parseInt(req.query.user);
	const {page, limit} = req.query;
	const rows = await db.getFavouriteRecipes(user, page, limit);
	const count = await db.getFavouriteRecipesAmount(user); //amount of all matching recipes, used for pagination
	res.status(200).json({rows, count});
});

//send the list of recipes which were not yet accepted by an admin
app.get("/api/recipes/notaccepted", async (req, res) => {
	if (req.user.role !== "ADMIN")
		throw new Error("invalid credentials");
	const {page, limit} = req.query;
	const rows = await db.getNotAcceptedRecipes(page, limit);
	const count = await db.getNotAcceptedRecipesAmount(); //amount of all matching recipes, used for pagination
	res.status(200).json({rows, count});
});


// ---------------- recipe ----------------

//send data about a recipe
app.get('/api/recipeinfo', async (req, res) => {
	const id = parseInt(req.query.id);
	const rows = await db.getRecipeById(id);
	res.status(200).json({...rows, ingredients: JSON.parse(rows.ingredients)});
});

//create a new recipe
app.post('/api/recipes', async (req, res) => {
	const { title, user_id, ingredients, content, portions, tags } = req.body;
	if(req.user.role === 'VIEVER' || req.user.id != user_id)
		throw new Error('invalid credentials');
	const id = await db.createRecipe(title, user_id, JSON.stringify(ingredients), content, portions, tags);
	res.status(201).json({id});
});

//update an existing recipe
app.put('/api/recipeinfo', async (req, res) => {
	const id = parseInt(req.query.id);
	const { title, content, ingredients, portions, tags, accepted } = req.body;
	const recipe = await db.getRecipeById(id); //fetch the original recipe to confirm credentials
	if((req.user.role === 'VIEVER' || req.user.id != recipe.user_id) && req.user.role !== 'ADMIN')
		throw new Error('invalid credentials');
	if(accepted && req.user.role !== 'ADMIN')
		throw new Error('invalid credentials');
	await db.updateRecipe(id, title, JSON.stringify(ingredients), content, portions, tags, accepted);
	res.status(200).send(`updated recipe ${id}`);
});

//delete a recipe
app.delete('/api/recipeinfo', async (req, res) => {
	const id = parseInt(req.query.id);
	const recipe = await db.getRecipeById(id);
	if((req.user.role === 'VIEVER' || req.user.id != recipe.user_id) && req.user.role !== 'ADMIN')
		throw new Error('invalid credentials');
	await db.deleteRecipe(id);
	res.status(200).send(`deleted recipe ${id} and corresponding favourites and comments`);
});


// ---------------- favourite recipes ----------------

//check if the user has a recipe in their favourites
app.get('/api/favourites', async (req, res) => {
	const { recipe, user } = req.query;
	if(req.user.role === 'VIEVER' || req.user.id != user)
		throw new Error('invalid credentials');
	const rows = await db.getIsFavourite(user,recipe);
	res.status(200).json(rows);
});

//add a recipe to the user's favourites
app.post('/api/favourites', async (req, res) => {
	const { user_id, recipe_id } = req.body;
	if(req.user.role === 'VIEVER' || req.user.id != user_id)
		throw new Error('invalid credentials');
	await db.addFavourite(user_id, recipe_id);
	res.status(201).send('favourite added');
});

//delete a recipe from the user's favourites
app.delete('/api/favourites', async (req, res) => {
	const { user_id, recipe_id } = req.body;
	if(req.user.role === 'VIEVER' || req.user.id != user_id)
		throw new Error('invalid credentials');
	await db.deleteFavourite(user_id, recipe_id);
	res.status(200).send('deleted favourite');
});


// ---------------- recipe rating ----------------

//send the user's rating of a recipe
app.get('/api/ratings/my', async (req, res) => {
	const { user, recipe } = req.query;
	if(req.user.role === 'VIEVER' || req.user.id != user)
		throw new Error('invalid credentials');
	const value = await db.getRating(user, recipe);
	res.status(200).json(value);
});

//send average rating of a recipe
app.get('/api/ratings/avg', async (req, res) => {
	const recipe = parseInt(req.query.recipe);
	const avg = await db.getRatingAverage(recipe);
	res.status(200).json(avg);
});

//add a user's rating to a recipe
app.post('/api/ratings', async (req, res) => {
	const { user_id, recipe_id, value } = req.body;
	if(req.user.role === 'VIEVER' || req.user.id != user_id)
		throw new Error('invalid credentials');
	await db.addRating(user_id, recipe_id, value);
	res.status(201).send('rating added');
});

//delete a user's rating from a recipe
app.delete('/api/ratings', async (req, res) => {
	const { user_id, recipe_id } = req.body;
	if(req.user.role === 'VIEVER' || req.user.id != user_id)
		throw new Error('invalid credentials');
	await db.deleteRating(user_id, recipe_id);
	res.status(200).send('deleted rating');
});


// ---------------- comments under recipes ----------------

//send a list of comments of a recipe
app.get('/api/comments', async (req, res) => {
	const recipe = parseInt(req.query.recipe);
	const rows = await db.getCommentsByRecipe(recipe);
	res.status(200).json(rows);
});

//add a user's comment to a recipe
app.post('/api/comments', async (req, res) => {
	const { recipe_id, user_id, content } = req.body;
	if(req.user.role === 'VIEVER' || req.user.id != user_id)
		throw new Error('invalid credentials');
	await db.addComment(user_id, recipe_id, content);
	res.status(201).send('comment added');
});

//delete a user's comment from a recipe
app.delete('/api/comments', async (req, res) => {
	const id = parseInt(req.query.id);
	const user_id = await db.getCommentAuthor(id);
	if((req.user.role === 'VIEVER' || req.user.id != user_id) && req.user.role !== 'ADMIN')
		throw new Error('invalid credentials');
	await db.deleteComment(id);
	res.status(200).send('deleted comment');
});


//  ---------------- recipe tags ----------------

//send the list of allowed tags
app.get('/api/tags', async (req, res) => {
	const rows = await db.getTags();
	res.status(200).json(rows);
});


//  ---------------- start the server ----------------
app.listen(port, () => {
	console.log (`Server listening at port ${port}`);
});