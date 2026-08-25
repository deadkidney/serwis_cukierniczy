//repository.js
//
// database queries
//
//

import pg from 'pg';
import config from './config.json' with { type: 'json' };
const {Pool} = pg;
const pool = new Pool(config.dbConfig)


// ---------------- user queries ----------------
 
//get the list of all users
const getUsers = async (page, limit) => {
    try {
        const result = await pool.query(
            'SELECT id, username, role FROM users ORDER BY id DESC LIMIT $1 OFFSET $2',
            [limit, page*limit]
        );
        return result.rows;
    } catch (error) {
        throw new Error("can't get users");
    }
}

//get the number of all users
const getUsersAmount = async () => {
    try {
        const result = await pool.query(
            'SELECT COUNT(id) FROM users'
        );
        return result.rows[0].count;
    } catch (error) {
        throw new Error("can't get users amount");
    }
}

//get data of a user
const getUserById = async (id) => {
    try {
        const result = await pool.query(
            'SELECT id, username FROM users WHERE id = $1',
            [id]
        );
        if(result.rowCount == 0)
            throw new Error("can't find user by id");
        return result.rows[0];
    } catch (error) {
        throw new Error("can't get user by id");
    }
}

//change the role of a user
const changeRole = async (id) => {
    try {
        await pool.query(
        'UPDATE users SET role = $1 WHERE id = $2',
        ['ADMIN', id]
        );
        return true;
    } catch (error) {
        throw new Error("can't update user");
  }
}

//delete a user from the database
const deleteUser = async (id) => {
    try {//first delete of the user's activity: favourite recipes, ratings, comments and recipes with all their data. Then delete the user.
        await pool.query(
            'DELETE FROM favourites WHERE user_id = $1',
            [id]
        );
        await pool.query(
            'DELETE FROM ratings WHERE user_id = $1',
            [id]
        );
        await pool.query(
            'DELETE FROM comments WHERE user_id = $1',
            [id]
        );
        await pool.query(
            'DELETE FROM favourites USING recipes WHERE favourites.recipe_id = recipes.id AND recipes.user_id = $1',
            [id]
        );
         await pool.query(
            'DELETE FROM ratings USING recipes WHERE ratings.recipe_id = recipes.id AND recipes.user_id = $1',
            [id]
        );
        await pool.query(
            'DELETE FROM comments USING recipes WHERE comments.recipe_id = recipes.id AND recipes.user_id = $1',
            [id]
        );
        await pool.query(
            'DELETE FROM recipes WHERE recipes.user_id = $1',
            [id]
        );
        await pool.query(
            'DELETE FROM users WHERE id = $1',
            [id]
        );
        return true;
    } catch (error) {
        throw new Error("can't delete user");
    }
}


// ---------------- recipe queries ----------------

//get a list of filtered, accepted recipes from the database. Tags are assumed to be safe
const getFilteredRecipes = async (search, tags, page, limit) => {
    const searchfilter = '%'+search+'%';
    const tagfilter = tags ? tags.map((tag) => `AND '${tag}' = ANY (tags)`).join(' ') : '';
    const query = `SELECT id, title, tags FROM recipes WHERE accepted AND title ILIKE $1 ${tagfilter} ORDER BY id DESC LIMIT $2 OFFSET $3`;
    try {
        const result = await pool.query(
            query,
            [searchfilter, limit, page*limit]
        );
        return result.rows;
    } catch (error) {
        throw new Error("can't get filtered recipes");
    }
}

//get a number of all matching recipes. Tags are assumed to be safe
const getFilteredRecipesAmount = async (search, tags) => {
    const searchfilter = '%'+search+'%';
    const tagfilter = tags ? tags.map((tag) => `AND '${tag}' = ANY (tags)`).join(' ') : '';
    const query = `SELECT COUNT(id) FROM recipes WHERE accepted AND title ILIKE $1 ${tagfilter}`;
    try {
        const result = await pool.query(
            query,
            [searchfilter]
        );
        return result.rows[0].count;
    } catch (error) {
        throw new Error("can't get filtered recipes amount");
    }
}

//get a list of accepted recipes by a given author
const getRecipesByAuthor = async (author, page, limit) => {
    try {
        const result = await pool.query(
            'SELECT id, title, tags FROM recipes WHERE user_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3',
            [author, limit, page*limit]
        );
        return result.rows;
    } catch (error) {
        throw new Error("can't get authored recipes");
    }
}

//get a number of accepted recipes by a given author
const getRecipesByAuthorAmount = async (author) => {
    try {
        const result = await pool.query(
            'SELECT COUNT(id) FROM recipes WHERE user_id = $1',
            [author]
        );
        return result.rows[0].count;
    } catch (error) {
        throw new Error("can't get authored recipes amount");
    }
}

//get a list of recipes in favourites of a given user
const getFavouriteRecipes = async (user, page, limit) => {
    try {
        const result = await pool.query(
            'SELECT recipes.id, recipes.title, recipes.tags FROM recipes JOIN favourites ON recipes.id = favourites.recipe_id WHERE accepted AND favourites.user_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3',
            [user, limit, page*limit]
        );
        return result.rows;
    } catch (error) {
        throw new Error("can't get favourite recipes");
    }
}

//get a number of recipes in favourites of a given user
const getFavouriteRecipesAmount = async (user) => {
    try {
        const result = await pool.query(
            'SELECT COUNT(recipes.id) FROM recipes JOIN favourites ON recipes.id = favourites.recipe_id WHERE accepted AND favourites.user_id = $1',
            [user]
        );
        return result.rows[0].count;
    } catch (error) {
        throw new Error("can't get favourite recipes amount");
    }
}

//get a list of not accepted recipes
const getNotAcceptedRecipes = async (page, limit) => {
    try {
        const result = await pool.query(
            'SELECT id, title, tags FROM recipes WHERE NOT accepted ORDER BY id DESC LIMIT $1 OFFSET $2',
            [limit, page*limit]
        );
        return result.rows;
    } catch (error) {
        throw new Error("can't get not accepted recipes");
    }
}

//get a number of not accepted recipes
const getNotAcceptedRecipesAmount = async (user) => {
    try {
        const result = await pool.query(
            'SELECT COUNT(id) FROM recipes WHERE NOT accepted'
        );
        return result.rows[0].count;
    } catch (error) {
        throw new Error("can't get not accepted recipes amount");
    }
}

//get data of a recipe
const getRecipeById = async (id) => {
    try {
        const result = await pool.query(
            'SELECT recipes.id, recipes.title, recipes.user_id, users.username, recipes.ingredients, recipes.content, recipes.portions, recipes.tags, recipes.accepted FROM recipes JOIN users ON recipes.user_id = users.id WHERE recipes.id = $1', 
            [id]
        );
        if(result.rowCount == 0)
            throw new Error("can't find recipe by id");
        return result.rows[0];
    } catch (error) {
        throw new Error("can't get recipe by id");
    }
}

//create a new recipe
const createRecipe = async (title, user_id, ingredients, content, portions, tags) => {
    try {
        const result = await pool.query(
        'INSERT INTO recipes (title, user_id, ingredients, content, portions, tags, accepted) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [title, user_id, ingredients, content, portions, tags, false]
        );
        return result.rows[0].id;
    } catch (error) {
        throw new Error("can't create recipe");
  }
}

//update an existing recipe
const updateRecipe = async (id, title, ingredients, content, portions, tags, accepted) => {
    try {
        await pool.query(
        'UPDATE recipes SET title = $1, ingredients =$2, content = $3, portions = $4, tags = $5, accepted = $6 WHERE id = $7',
        [title, ingredients, content, portions, tags, accepted, id]
        );
        return true;
    } catch (error) {
        throw new Error("can't update recipe");
  }
}

//delete an existing recipe
const deleteRecipe = async (id) => {
    try {
        await pool.query(
            'DELETE FROM favourites WHERE recipe_id = $1',
            [id]
        );
        await pool.query(
            'DELETE FROM ratings WHERE recipe_id = $1',
            [id]
        );
        await pool.query(
            'DELETE FROM comments WHERE recipe_id = $1',
            [id]
        );
        await pool.query(
            'DELETE FROM recipes WHERE id = $1',
            [id]
        );
        return true;
    } catch (error) {
        throw new Error("can't delete recipe");
    }
}


// ---------------- favourite recipe queries ----------------

//check whether a user favourites a recipe
const getIsFavourite = async (user_id, recipe_id) => {
    try {
        const result = await pool.query(
            'SELECT COUNT(id) FROM favourites WHERE user_id = $1 AND recipe_id = $2',
            [user_id, recipe_id]
        );
        return result.rows[0].count;
    } catch (error) {
        throw new Error("can't get favourites by recipe");
    }
}

//add a recipe to user's favourites
const addFavourite = async (user_id, recipe_id) => {
    try {
        await pool.query(
        'INSERT INTO favourites (user_id, recipe_id) VALUES ($1, $2)',
        [user_id, recipe_id]
        );
        return true;
    } catch (error) {
        throw new Error("can't add favourite");
  }
}

//delete a recipe from user's favourites
const deleteFavourite = async (user_id, recipe_id) => {
    try {
        await pool.query(
            'DELETE FROM favourites WHERE user_id = $1 AND recipe_id = $2',
            [user_id, recipe_id]
        );
        return true;
    } catch (error) {
        throw new Error("can't delete favourite");
    }
}


// ---------------- rating queries ----------------

//get an average rating of a recipe
const getRatingAverage = async (recipe_id) => {
    try {
        const result = await pool.query(
            'SELECT ROUND(AVG(value), 2) FROM ratings WHERE recipe_id = $1',
            [recipe_id]
        );
        return result.rows[0].round;
    } catch (error) {
        throw new Error("can't get rating average");
    }
}

//get a user's rating of a recipe
const getRating = async (user_id, recipe_id) => {
    try {
        const result = await pool.query(
            'SELECT value FROM ratings WHERE user_id = $1 AND recipe_id = $2',
            [user_id, recipe_id]
        );
        if(result.rowCount == 0)
            return 0;
        else return result.rows[0].value;
    } catch (error) {
        throw new Error("can't get rating");
    }
}

//add a user's rating to a recipe
const addRating = async (user_id, recipe_id, value) => {
    try {
        await pool.query(
        'INSERT INTO ratings (user_id, recipe_id, value) VALUES ($1, $2, $3)',
        [user_id, recipe_id, value]
        );
        return true;
    } catch (error) {
        throw new Error("can't add rating");
  }
}

//delete a user's rating from a recipe
const deleteRating = async (user_id, recipe_id) => {
    try {
        await pool.query(
            'DELETE FROM ratings WHERE user_id = $1 AND recipe_id = $2',
            [user_id, recipe_id]
        );
        return true;
    } catch (error) {
        throw new Error("can't delete rating");
    }
}


// ---------------- comment queries ----------------

//get the list of all comments of a recipe
const getCommentsByRecipe = async (recipe_id) => {
    try {
        const result = await pool.query(
            'SELECT comments.id, comments.content, comments.user_id, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE comments.recipe_id = $1 ORDER BY id DESC',
            [recipe_id]
        );
        return result.rows;
    } catch (error) {
        throw new Error("can't get comments by recipe");
    }
}

//get a comment's author
const getCommentAuthor = async (id) => {
    try {
        const result = await pool.query(
            'SELECT user_id FROM comments WHERE id = $1',
            [id]
        );
        if(result.rowCount == 0)
            throw new Error("can't find comment by id");
        return result.rows[0].user_id;
    } catch (error) {
        throw new Error("can't get comment author");
    }
}

//add a comment to a recipe
const addComment = async (user_id, recipe_id, content) => {
    try {
        const result = await pool.query(
        'INSERT INTO comments (recipe_id, user_id, content) VALUES ($1, $2, $3) RETURNING id',
        [recipe_id, user_id, content]
        );
        return result.rows[0].id;
    } catch (error) {
        throw new Error("can't add comment");
  }
}

//delete a comment
const deleteComment = async (id) => {
    try {
        await pool.query(
            'DELETE FROM comments WHERE id = $1',
            [id]
        );
        return true;
    } catch (error) {
        throw new Error("can't delete comment");
    }
}


// ---------------- tag queries ----------------

//get the list of all tags
const getTags = async () => {
    try {
        const result = await pool.query(
            'SELECT * FROM tags ORDER BY id ASC'
        );
        return result.rows;
    } catch (error) {
        throw new Error("can't get tags");
    }
}

export {
    getUsers,
    getUsersAmount,
    getUserById,
    changeRole,
    deleteUser,
    getFilteredRecipes,
    getFilteredRecipesAmount,
    getRecipesByAuthor,
    getRecipesByAuthorAmount,
    getFavouriteRecipes,
    getFavouriteRecipesAmount,
    getNotAcceptedRecipes,
    getNotAcceptedRecipesAmount,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getIsFavourite,
    addFavourite,
    deleteFavourite,
    getRatingAverage,
    getRating,
    addRating,
    deleteRating,
    getCommentsByRecipe,
    getCommentAuthor,
    addComment,
    deleteComment,
    getTags
}