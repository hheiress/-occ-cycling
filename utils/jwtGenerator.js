const jwt = require("jsonwebtoken");
require('dotenv').config();

function jwtGenerator (user_id) {
    const payload = {
        user: user_id
    }
    if (!user_id) {
        throw new Error("jwtGenerator need a user_id");
    }
    ("generator",payload)

   return jwt.sign(payload, process.env.jwtSecret, {expiresIn: "1hr"} )
}

module.exports = jwtGenerator;