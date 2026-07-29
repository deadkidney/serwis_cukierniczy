import pg from 'pg';
const {Pool} = pg;
const pool = new Pool({
    user: 'server',
    host: 'localhost',
    database: 'serwiscukierniczy',
    password: 'password',
    port: 5432,
})

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );
        if(result.rowCount == 0)
            throw new Error("invalid credentials");
        if(result.rows[0].passwordhash != password)
            return res.status(401).json({error: 'invalid credentials'});

        const token = "placeholder token";
        const data = {...result.rows[0], token}
        res.json(data);
    } catch (error) {
        throw new Error("can't log in");
  }
}

export {
    login
}