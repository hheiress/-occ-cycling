const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes.js");
const pool = require("./db.js");
const config = require('config');

const PORT = config.get('server.port') || 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(routes);

app.use(express.urlencoded({extended: false}));

app.use((req, res, next) => {
    const err = new Error("Not found")
    err.status = 404
    next(err)
});

//Error handler

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    });
});

pool
    .connect()
    .then(client => {
        client.release()
        console.info("Connection to database successful. Starting express server.")
        app.listen(PORT, () => console.log(`Server is listening on port ${PORT}. Ready to accept requests!`))
    }).catch(connectError => {
        console.error("Unable to connect to database: " + connectError.message)
        process.exit(1);
    }
)


