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
const getRecipes = async () => {
    try {
        const result = await pool.query(
            'SELECT id, title FROM recipes'
        );
        return result.rows;
    } catch (error) {
        throw new Error("can't get recipes");
    }
}

const getRecipesByAuthor = async (author) => {
    try {
        const result = await pool.query(
            'SELECT id, title FROM recipes WHERE user_id = $1',
            [author]
        );
        return result.rows;
    } catch (error) {
        throw new Error("can't get authored recipes");
    }
}

const getLikedRecipes = async (user) => {
    try {
        const result = await pool.query(
            'SELECT recipes.id, recipes.title FROM recipes JOIN likes ON recipes.id = likes.recipe_id WHERE likes.user_id = $1',
            [user]
        );
        return result.rows;
    } catch (error) {
        throw new Error("can't get liked recipes");
    }
}

const getFilteredRecipes = async (search) => {
    try {
        const result = await pool.query(
            'SELECT id, title FROM recipes WHERE title LIKE $1',
            [search]
        );
        return result.rows;
    } catch (error) {
        throw new Error("can't get filtered recipes");
    }
}

const getRecipeById = async (id) => {
    try {
        const result = await pool.query(
            'SELECT recipes.id, recipes.title, recipes.content, recipes.user_id, users.username FROM recipes JOIN users ON recipes.user_id = users.id WHERE recipes.id = $1', 
            [id]
        );
        if(result.rowCount == 0)
            throw new Error("can't find recipe by id");
        return result.rows;
    } catch (error) {
        throw new Error("can't get recipe by id");
    }
}

const createRecipe = async (title, user_id, content) => {
    try {
        const result = await pool.query(
        'INSERT INTO recipes (title, user_id, content) VALUES ($1, $2, $3) RETURNING *',
        [title, user_id, content]
        );
        return result.rows;
    } catch (error) {
        throw new Error("can't create recipe");
  }
}

const updateRecipe = async (id, title, content) => {
    try {
        await pool.query(
        'UPDATE recipes SET title = $1, content = $2 WHERE id = $3',
        [title, content, id]
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
            'SELECT * FROM users'
        );
        return result.rows;
    } catch (error) {
        throw new Error("can't get users");
    }
}

const getUserById = async (id) => {
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1',
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
            'DELETE FROM comments WHERE user_id = $1',
            [id]
        );
        await pool.query(
            'DELETE FROM likes USING recipes WHERE likes.recipe_id = recipes.id AND recipes.user_id = $1',
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
const getLikesByRecipe = async (recipe) => {
    try {
        const result = await pool.query(
            'SELECT user_id FROM likes WHERE recipe_id = $1',
            [recipe]
        );
        return result.rows;
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

//COMMENT QUERIES
const getCommentsByRecipe = async (recipe) => {
    try {
        const result = await pool.query(
            'SELECT comments.id, comments.content, comments.user_id, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE comments.recipe_id = $1',
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
    getRecipesByAuthor,
    getLikedRecipes,
    getFilteredRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getUsers,
    getUserById,
    changeRole,
    deleteUser,
    getLikesByRecipe,
    addLike,
    deleteLike,
    getCommentsByRecipe,
    addComment,
    deleteComment
}