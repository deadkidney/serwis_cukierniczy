import pg from 'pg';
const {Pool} = pg;
const pool = new Pool({
    user: 'server',
    host: 'localhost',
    database: 'serwiscukierniczy',
    password: 'password',
    port: 5432,
})

console.log('funguje');

const getRecipes = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, title FROM recipes');
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
    }
}

const getRecipeById = async (req, res) => {
    const id = parseInt(req.query.id);
    try {
        const result = await pool.query('SELECT * FROM recipes WHERE id = $1', [id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
    }
}

const createRecipe = async (req, res) => {
    const { title, author } = req.body;
    try {
        const results = await pool.query(
        'INSERT INTO recipes (title, user_id) VALUES ($1, $2) RETURNING *',
        [title, author]
        );
        res.status(201).send(`recipe added with ID: ${results.rows[0].id}`)
    } catch (error) {
        console.log(error);
  }
}

const deleteRecipe = async (req, res) => {
    const id = parseInt(req.query.id);
    try {
        await pool.query('DELETE FROM recipes WHERE id = $1', [id]);
        res.status(200).send(`deleted user ${id}`);
    } catch (error) {
        console.log(error);
    }
}

const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
    }
}

const getUserById = async (req, res) => {
    const id = parseInt(req.query.id);
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
    }
}


export {
    getRecipes,
    getRecipeById,
    createRecipe,
    deleteRecipe,
    getUsers,
    getUserById
}