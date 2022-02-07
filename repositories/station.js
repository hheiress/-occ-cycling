const pool = require("../db.js");

const find = () => {
    return pool.query("SELECT * FROM station").then((results) => (results.rows))
}

const create = (req, res) => {
    const station_name = req.body.station_name;

    if (!station_name) {
        return res
            .status(400)
            .send ("Please Insert a Station")
        } return pool
                .query("INSERT INTO station (station_name) VALUES ($1)", [station_name])
                .then(()=> res.send('Station created'))
   
}

function update(req, res) {
    const { station_name } = req.body;
    const { id } = req.params;
    if (!station_name) {
        return res
            .status(400)
            .send("Please update a station_name");
    }
    return pool
        .query("UPDATE station SET station_name = $2 WHERE id = $1", [id, station_name])
        .then(() => res.send('Station Modified'))
}

function remove(req, res) {
    const { id } = req.params;
    if (!id) {
        return res
            .status(400)
            .send("Please insert a id");
    }
    return pool
        .query("DELETE FROM station WHERE id = $1", [id])
        .then(() => res.send('Station Eliminated'))
}

module.exports = {
    find: find,
    create: create,
    update: update,
    remove: remove,
};