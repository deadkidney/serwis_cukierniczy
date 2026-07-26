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
const getRecipes = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, title FROM recipes'
        );
        res.status(200).json(result.rows);
    } catch (error) {
        throw new Error("can't get recipes");
    }
}

const getRecipesByAuthor = async (req, res) => {
    const author = parseInt(req.query.author);
    try {
        const result = await pool.query(
            'SELECT id, title FROM recipes WHERE user_id = $1',
            [author]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        throw new Error("can't get authored recipes");
    }
}

const getLikedRecipes = async (req, res) => {
    const user = parseInt(req.query.user);
    try {
        const result = await pool.query(
            'SELECT recipes.id, recipes.title FROM recipes JOIN likes ON recipes.id = likes.recipe_id WHERE likes.user_id = $1',
            [user]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        throw new Error("can't get liked recipes");
    }
}

const getFilteredRecipes = async (req, res) => {
    const search = '%'+req.query.search+'%';
    try {
        const result = await pool.query(
            'SELECT id, title FROM recipes WHERE title LIKE $1',
            [search]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        throw new Error("can't get filtered recipes");
    }
}

const getRecipeById = async (req, res) => {
    const id = parseInt(req.query.id);
    try {
        const result = await pool.query(
            'SELECT recipes.id, recipes.title, recipes.content, recipes.user_id, users.username FROM recipes JOIN users ON recipes.user_id = users.id WHERE recipes.id = $1', 
            [id]
        );
        if(result.rowCount == 0)
            throw new Error("can't find recipe by id");
        res.status(200).json(result.rows);
    } catch (error) {
        throw new Error("can't get recipe by id");
    }
}

const createRecipe = async (req, res) => {
    const { title, user_id } = req.body;
    try {
        const results = await pool.query(
        'INSERT INTO recipes (title, user_id) VALUES ($1, $2) RETURNING *',
        [title, user_id]
        );
        res.status(201).json({id: results.rows[0].id});
    } catch (error) {
        throw new Error("can't create recipe");
  }
}

const updateRecipe = async (req, res) => {
    const id = parseInt(req.query.id);
    const { title, content } = req.body;
    try {
        await pool.query(
        'UPDATE recipes SET title = $1, content = $2 WHERE id = $3',
        [title, content, id]
        );
        res.status(200).send('recipe updated')
    } catch (error) {
        throw new Error("can't update recipe");
  }
}

const deleteRecipe = async (req, res) => {
    const id = parseInt(req.query.id);
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
        res.status(200).send(`deleted user ${id} and corresponding likes and comments`);
    } catch (error) {
        throw new Error("can't delete recipe");
    }
}

// USER QUERIES
const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        throw new Error("can't get users");
    }
}

const getUserById = async (req, res) => {
    const id = parseInt(req.query.id);
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );
        if(result.rowCount == 0)
            throw new Error("can't find user by id");
        res.status(200).json(result.rows);
    } catch (error) {
        throw new Error("can't get user by id");
    }
}

//LIKE QUERIES
const getLikesAmount = async (req, res) => {
    const recipe = parseInt(req.query.recipe);
    try {
        const result = await pool.query(
            'SELECT COUNT(*) FROM likes WHERE likes.recipe_id = $1',
            [recipe]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        throw new Error("can't get amount of likes by recipe");
    }
}

const addLike = async (req, res) => {
    const { user_id, recipe_id } = req.body;
    try {
        await pool.query(
        'INSERT INTO likes (user_id, recipe_id) VALUES ($1, $2)',
        [user_id, recipe_id]
        );
        res.status(201).send('like added');
    } catch (error) {
        throw new Error("can't add like");
  }
}

//COMMENT QUERIES
const getCommentsByRecipe = async (req, res) => {
    const recipe = parseInt(req.query.recipe);
    try {
        const result = await pool.query(
            'SELECT comments.id, comments.content, comments.user_id, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE comments.recipe_id = $1',
            [recipe]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        throw new Error("can't get comments by recipe");
    }
}

const addComment = async (req, res) => {
    const { recipe_id, user_id, content } = req.body;
    try {
        await pool.query(
        'INSERT INTO comments (recipe_id, user_id, content) VALUES ($1, $2, $3)',
        [recipe_id, user_id, content]
        );
        res.status(201).send('comment added');
    } catch (error) {
        throw new Error("can't add comment");
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
    getLikesAmount,
    addLike,
    getCommentsByRecipe,
    addComment
}