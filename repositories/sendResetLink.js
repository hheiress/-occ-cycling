const pool = require("../db.js");
const sendEmail = require ("../utils/sendEmail.js");
const jwtGenerator = require ("../utils/jwtGenerator.js");
const jwt = require("jsonwebtoken");
const bcrypt= require("bcrypt");


async function sendResetLink ( req, res) {
    try {
     const { email } = req.body;
     
     if (!email) {
         return res.status(400).send( { error: "Email is required" } );
     }

     const user = await
        pool
        .query("SELECT * FROM ngo_users WHERE user_email = $1", [email]);
        
        if (!user) {
            return res.status(404).send( { error: "User not found"} );
        };
        
        const token = jwtGenerator(user.rows[0].id);
        
        //query parameter ? value= 
       
        const link = `${req.protocol}://localhost:3000/resetlink/reset-password/${token}`;
        
        await sendEmail(
            email,
            'info@openculturalcenter.org',
            'Occycling password reset',
            `
            <div>Click the link to reset your password</div><br/>
            <div>${link}</div>
            `
        );
       
        return res.status(200).json({token})//send//({ message: 'Password reset link has been successfully sent to your inbox'})
    } catch (err) {
        console.log(err.stack)
        if (err.response) {
            const {message, code, response} = err;
            const {headers, body } = response;
            console.error(body);
        }

        res.status(500).send("Internal server error")
    }
};

async function resetPassword (req, res) {
    try {
        const { password } = req.body;
        
        const { token } = req. params;
        
        const decoded = jwt.verify(token, process.env.jwtSecret)
        
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);
        
        const user = await
        pool
        .query("UPDATE ngo_users SET user_password = $2 WHERE id = $1 RETURNING * ", [ decoded.user, bcryptPassword ]);
        //("user", user.rows[0])
        const {  id, user_name, user_email } = user.rows[0];
        return res.status(200).send( { token, user: { id, user_name, user_email } } );

    } catch (err) {
        (err.stack)
        res.status(500).send("Internal server error")
    }
};

module.exports = {

sendResetLink: sendResetLink,
resetPassword: resetPassword,

};