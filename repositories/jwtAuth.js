const pool = require("../db.js");
const bcrypt= require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator.js");
require('dotenv').config();

// ==== Registrer user / encryp password ====

async function register (req, res) {
    const {name, email, password} = req.body;

    const user = await 
        pool
        .query("SELECT * FROM ngo_users WHERE user_email = $1", [email])
    
            if (user.rows.length !== 0) {
             return res.status(401).json("User already exist");
         }
    // Bcrypt the user password

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);

    const bcryptPassword = await bcrypt.hash(password, salt);

    const newUser = await 
         pool
         .query("INSERT INTO ngo_users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING * ", [name, email, bcryptPassword])
         

    // generatin jwt token

    const token = jwtGenerator(newUser.rows[0].id);
    
    res.json({token});
};

async function login (req, res) {

    const {email, password} = req.body;

    const user = await
        pool
        .query("SELECT * FROM ngo_users WHERE user_email = $1", [email]);

        if (user.rows.lenght === 0) {
            return res.status(401).json("Password or Email is incorrect")
        }
    //Check if incoming password is the same in DB

        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

        if (!validPassword) {
            return res.status(401).json("Password or Email is incorrect")
        }

    // Give them JWT token

    const token = jwtGenerator(user.rows[0].id);
    res.json({token})
} 

 function loginAuth (req, res) {
    try {
        res.json(true);
} catch (err) {
    (err.message)
    res.status(500).send("Internal Server Error")
}
 }
module.exports = {
    
    register: register,
    login: login,
    loginAuth: loginAuth,
    
};

