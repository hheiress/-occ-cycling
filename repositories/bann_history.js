const pool = require("../db.js");

function find() {
    const showBanns = 
    `SELECT b.id,
            b.user_id,
            b.start_date, 
            b.finish_date
    FROM bann_history b
            JOIN users u ON b.user_id = u.id`
    return pool.query(showBanns).then(results => results.rows)
}
function findUserBann(req) {
    const showUserBanns = 
    "SELECT * FROM bann_history WHERE user_id = $1"
    return pool
            .query(showUserBanns, [req.params.id])
            .then(results => results.rows.filter(
                    item => item.finish_date === null
                ));
}
function create(req, res) {
    const {user_id,
           start_date
        } = req.body;
    if(!user_id || !start_date){
        return res
            .status(400)
            .send("Please insert a user_id, start_date");
    }
    return pool
        .query("INSERT INTO bann_history (user_id, start_date) VALUES ($1, $2) RETURNING id",
        [user_id, start_date])
        .then(() => res.send("Bann created"))
}

function update(req, res) {
    const {finish_date} = req.body;
    const {id} = req.params;
    if(!finish_date){
        return res
            .status(400)
            .send("Please insert a finish_date");
    }
    pool.query("SELECT * FROM bann_history WHERE id = $1", [id])
    return pool
        .query("UPDATE bann_history SET finish_date=$2 WHERE id=$1",
        [id, finish_date])
        .then(() => res.send("Bann History updated"))
}

module.exports = {
    find: find,
    findUserBann:findUserBann,
    create: create,
    update: update,
};