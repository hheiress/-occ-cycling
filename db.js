const {Pool} = require("pg");
const config = require('config');

const pool = new Pool({
    user: config.get('database.user'),
    host: config.get('database.host'),
    database: config.get('database.dbname'),
    password: config.get('database.password'),
    port: config.get('database.port')
});

module.exports = pool;