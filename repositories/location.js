const pool = require("../db.js");

const find = () => {
    return pool.query("SELECT * FROM locations").then(results => (results.rows))
}

module.exports = {
    find: find
};