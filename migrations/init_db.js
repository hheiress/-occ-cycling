const fs = require("fs");
const pgtools = require('pgtools');
const {Pool} = require("pg");

const dbname = "occycling";
const config = {
    user: process.argv[2],
    host: 'localhost',
    password: typeof process.argv[3] == "undefined" ? '' : process.argv[3],
    port: 5432
}

// Drop database if it does exist
// Create a new clean database
// Execute init_db.sql

pgtools.dropdb(config, dbname, (err, res) => {
    // Ignoring the error here as DB might not exist
    pgtools.createdb(config, dbname, (err, res) => {
        if (err) {
            console.error(`Something went wrong creating DB: ${err.message}`);
            console.error(err.stackTrace);
            process.exit(1);
        }
        // Once database occycling is created we get connected to it to create tables and user
        config.database = dbname;
        const poolMigration = new Pool(config);

        poolMigration
            .query(fs.readFileSync("migrations/initial_db.sql").toString())
            .then(() => {
                console.info("Migration successful!");
                process.exit(0);
            })
            .catch((err) => {
                console.error(`Something went wrong with migration: ${err.message}`);
                console.error(err.stackTrace);
                process.exit(1);
            });
    });
});