import pg from 'pg';
const {Pool} = pg;
const pool = new Pool({
    user: 'server',
    host: 'localhost',
    database: 'serwiscukierniczy',
    password: 'password',
    port: 5432,
})

//RECIPE QUERIES
const getRecipes = async (page, limit) => {
    try {
        const result = await pool.query(
            'SELECT id, title FROM recipes ORDER BY id DESC LIMIT $1 OFFSET $2',
            [limit, page*limit]
        );
        return result.rows;
    } catch (error) {
        throw new Error("can't get recipes");
    }
}

const getRecipesAmount = async () => {
    try {
        const result = await pool.query(
            'SELECT COUNT(id) FROM recipes',
        );
        return result.rows[0].count;
    } catch (error) {
        throw new Error("can't get recipes amount");
    }
}

const getFilteredRecipes = async (search, page, limit) => {
    try {
        const result = await pool.query(
            'SELECT id, title FROM recipes WHERE title LIKE $1 ORDER BY id DESC LIMIT $2 OFFSET $3',
            [search, limit, page*limit]
        );
        return result.rows;
    } catch (error) {
        throw new Error("can't get filtered recipes");
    }
}

const getFilteredRecipesAmount = async (search) => {
    try {
        const result = await pool.query(
            'SELECT COUNT(id) FROM recipes WHERE title LIKE $1',
            [search]
        );
        return result.rows[0].count;
    } catch (error) {
        throw new Error("can't get filtered recipes amount");
    }
}

const getRecipesByAuthor = async (author, page, limit) => {
    try {
        const result = await pool.query(
            'SELECT id, title FROM recipes WHERE user_id = $1  ORDER BY id DESC LIMIT $2 OFFSET $3',
            [author, limit, page*limit]
        );
        return result.rows;
    } catch (error) {
        throw new Error("can't get authored recipes");
    }
}

const getRecipesByAuthorAmount = async (author) => {
    try {
        const result = await pool.query(
            'SELECT COUNT(id) FROM recipes WHERE user_id = $1',
            [author]
        );
        return result.rows[0].count;
    } catch (error) {
        throw new Error("can't get authored recipes");
    }
}

const getLikedRecipes = async (user, page, limit) => {
    try {
        const result = await pool.query(
            'SELECT recipes.id, recipes.title FROM recipes JOIN likes ON recipes.id = likes.recipe_id WHERE likes.user_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3',
            [user, limit, page*limit]
        );
        return result.rows;
    } catch (error) {
        throw new Error("can't get liked recipes");
    }
}

const getLikedRecipesAmount = async (user) => {
    try {
        const result = await pool.query(
            'SELECT COUNT(recipes.id) FROM recipes JOIN likes ON recipes.id = likes.recipe_id WHERE likes.user_id = $1',
            [user]
        );
        return result.rows[0].count;
    } catch (error) {
        throw new Error("can't get liked recipes");
    }
}

const getRecipeById = async (id) => {
    try {
        const result = await pool.query(
            'SELECT recipes.id, recipes.title, recipes.content, recipes.user_id, users.username, recipes.portions, recipes.accepted FROM recipes JOIN users ON recipes.user_id = users.id WHERE recipes.id = $1', 
            [id]
        );
        if(result.rowCount == 0)
            throw new Error("can't find recipe by id");
        return result.rows[0];
    } catch (error) {
        throw new Error("can't get recipe by id");
    }
}

const createRecipe = async (title, user_id, content, portions) => {
    try {
        const result = await pool.query(
        'INSERT INTO recipes (title, user_id, content, portions, accepted) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [title, user_id, content, portions, false]
        );
        return result.rows[0].id;
    } catch (error) {
        throw new Error("can't create recipe");
  }
}

const updateRecipe = async (id, title, content, portions, accepted) => {
    try {
        await pool.query(
        'UPDATE recipes SET title = $1, content = $2, portions = $3, accepted = $4 WHERE id = $5',
        [title, content, portions, accepted, id]
        );
        return true;
    } catch (error) {
        throw new Error("can't update recipe");
  }
}

const deleteRecipe = async (id) => {
    try {
        await pool.query(
            'DELETE FROM likes WHERE recipe_id = $1',
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

// USER QUERIES
const getUsers = async () => {
    try {
        const result = await pool.query(
            'SELECT id, username, role FROM users ORDER BY id DESC'
        );
        return result.rows;
    } catch (error) {
        throw new Error("can't get users");
    }
}

const getUserById = async (id) => {
    try {
        const result = await pool.query(
            'SELECT id, username FROM users WHERE id = $1',
            [id]
        );
        if(result.rowCount == 0)
            throw new Error("can't find user by id");
        return result.rows;
    } catch (error) {
        throw new Error("can't get user by id");
    }
}

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

const deleteUser = async (id) => {
    try {
        await pool.query(
            'DELETE FROM likes WHERE user_id = $1',
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
            'DELETE FROM likes USING recipes WHERE likes.recipe_id = recipes.id AND recipes.user_id = $1',
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

//LIKE QUERIES
const getIsLiked = async (recipe, user) => {
    try {
        const result = await pool.query(
            'SELECT COUNT(id) FROM likes WHERE recipe_id = $1 AND user_id = $2',
            [recipe, user]
        );
        return result.rows[0].count;
    } catch (error) {
        throw new Error("can't get likes by recipe");
    }
}

const addLike = async (user_id, recipe_id) => {
    try {
        await pool.query(
        'INSERT INTO likes (user_id, recipe_id) VALUES ($1, $2)',
        [user_id, recipe_id]
        );
        return true;
    } catch (error) {
        throw new Error("can't add like");
  }
}

const deleteLike = async (user_id, recipe_id) => {
    try {
        await pool.query(
            'DELETE FROM likes WHERE user_id = $1 AND recipe_id = $2',
            [user_id, recipe_id]
        );
        return true;
    } catch (error) {
        throw new Error("can't delete like");
    }
}

//RATING QUERIES
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

//COMMENT QUERIES
const getCommentsByRecipe = async (recipe) => {
    try {
        const result = await pool.query(
            'SELECT comments.id, comments.content, comments.user_id, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE comments.recipe_id = $1 ORDER BY id DESC',
            [recipe]
        );
        return result.rows;
    } catch (error) {
        throw new Error("can't get comments by recipe");
    }
}

const addComment = async (recipe_id, user_id, content) => {
    try {
        await pool.query(
        'INSERT INTO comments (recipe_id, user_id, content) VALUES ($1, $2, $3)',
        [recipe_id, user_id, content]
        );
        return true;
    } catch (error) {
        throw new Error("can't add comment");
  }
}

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

export {
    getRecipes,
    getRecipesAmount,
    getFilteredRecipes,
    getFilteredRecipesAmount,
    getRecipesByAuthor,
    getRecipesByAuthorAmount,
    getLikedRecipes,
    getLikedRecipesAmount,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getUsers,
    getUserById,
    changeRole,
    deleteUser,
    getIsLiked,
    addLike,
    deleteLike,
    getRatingAverage,
    getRating,
    addRating,
    deleteRating,
    getCommentsByRecipe,
    addComment,
    deleteComment
}