import pg from 'pg';
const {Pool} = pg;
const pool = new Pool({
    user: 'server',
    host: 'localhost',
    database: 'serwiscukierniczy',
    password: 'password',
    port: 5432,
})

const getRecipes = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, title FROM recipes');
        res.status(200).json(result.rows);
    } catch (error) {
        throw new Error("can't get recipes");
    }
}

const getRecipesByAuthor = async (req, res) => {
    const author = parseInt(req.query.author);
    try {
        const result = await pool.query('SELECT id, title FROM recipes WHERE user_id = $1', [author]);
        res.status(200).json(result.rows);
    } catch (error) {
        throw new Error("can't get recipes");
    }
}

const getRecipeById = async (req, res) => {
    const id = parseInt(req.query.id);
    try {
        const result = await pool.query('SELECT * FROM recipes WHERE id = $1', [id]);
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
        res.status(201).send(`recipe added with ID: ${results.rows[0].id}`)
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
        await pool.query('DELETE FROM recipes WHERE id = $1', [id]);
        res.status(200).send(`deleted user ${id}`);
    } catch (error) {
        throw new Error("can't delete recipe");
    }
}

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
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if(result.rowCount == 0)
            throw new Error("can't find user by id");
        res.status(200).json(result.rows);
    } catch (error) {
        throw new Error("can't get user by id");
    }
}


export {
    getRecipes,
    getRecipesByAuthor,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getUsers,
    getUserById
}