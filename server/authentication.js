import pg from 'pg';
import jwt from 'jsonwebtoken';

const {Pool} = pg;
const pool = new Pool({
    user: 'server',
    host: 'localhost',
    database: 'serwiscukierniczy',
    password: 'password',
    port: 5432,
})
const JWT_SECRET = "placeholder secret"

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
            throw new Error("invalid credentials");

        const token = jwt.sign(result.rows[0], JWT_SECRET, {
            expiresIn: '1h'
        });
        const data = {...result.rows[0], token}
        res.json(data);
    } catch (error) {
        throw new Error("can't log in");
  }
}

const processToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if(!token) {
        req.user = {role: 'VIEWER'}
        next();
    }

    else try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        throw new Error("unauthorized");
    }

}



export {
    login,
    processToken
}