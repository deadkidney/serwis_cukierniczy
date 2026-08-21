//authentication.js
//
// user authorisation and authentication
//
//

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

//register a user
const register = async (username, password) => {
    try {
        //check if a user with such username exists
        const others = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );
        if(others.rowCount != 0)
            throw new Error("username already taken");

        //save user's data
        const passwordhash = await bcrypt.hash(password, salt);
        const result = await pool.query(
            'INSERT INTO users (username, passwordhash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
            [username, passwordhash, 'USER']
        )
        //generate a json web token
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

//login a user
const login = async (username, password) => {
    try {
        //find a user with given username
        const result = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );
        if(result.rowCount == 0)
            throw new Error("invalid credentials");

        //check the credentials and return a json web token
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

//express middleware for processing json web tokens
const processToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if(!token) {//if no token is provided, assume the role of VIEWER
        req.user = {role: 'VIEWER'}
        next();
    } else try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        throw new Error("invalid token");
    }
}


export {
    register,
    login,
    processToken
}