const {Pool} = require("pg");
const config = require('config');

let poolConfig = {
    user: config.get('database.user'),
    host: config.get('database.host'),
    database: config.get('database.dbname'),
    password: config.get('database.password'),
    port: config.get('database.port')
}

let enableRejectUnauthorized = config.get('database.enableRejectUnauthorized')

if (enableRejectUnauthorized) {
    poolConfig.ssl = {rejectUnauthorized: false}
}

const pool = new Pool(poolConfig);

module.exports = pool;