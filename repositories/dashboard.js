const pool = require("../db.js");

async function dashboard (req, res) {

const user = await pool
        .query("SELECT user_name FROM ngo_users WHERE id = $1", [req.user]);
        if (!req.user) {
            throw new Error("req user wrong");
        }
        res.json(user.rows[0]);

}

module.exports = {
    
    dashboard: dashboard,
    
};