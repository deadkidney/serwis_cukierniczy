import pg from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const {Pool} = pg;
const pool = new Pool({
    user: 'server',
    host: 'localhost',
    database: 'serwiscukierniczy',
    password: 'password',
    port: 5432,
})

const JWT_SECRET = "placeholder secret";
const salt = 10;

const register = async (username, password) => {
    try {
        const others = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );
        if(others.rowCount != 0)
            throw new Error("username already taken");

        const passwordhash = await bcrypt.hash(password, salt);
        const result = await pool.query(
            'INSERT INTO users (username, passwordhash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
            [username, passwordhash, 'USER']
        )
        const token = jwt.sign(
            result.rows[0],
            JWT_SECRET,
            { expiresIn: '1h'}
        );
        return {...result.rows[0], token};
    } catch (error) {
        throw new Error("can't register");
    }
}

const login = async (username, password) => {
    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );
        if(result.rowCount == 0)
            throw new Error("invalid credentials");

        const isMatch = await bcrypt.compare(password, result.rows[0].passwordhash);
        if(isMatch) {
            const user = {id: result.rows[0].id, username: result.rows[0].username, role: result.rows[0].role};
            const token = jwt.sign(
                user,
                JWT_SECRET,
                { expiresIn: '1h'}
            );
            return {...user, token};
        } else {
            throw new Error("invalid credentials");
        }      
    } catch (error) {
        throw new Error("can't log in");
    }
}

const processToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if(!token) {
        req.user = {role: 'VIEWER'}
        next();
    } else try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        throw new Error("wrong token");
    }
}


export {
    register,
    login,
    processToken
}