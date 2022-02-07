const pool = require("../db.js");

// Select renting that are still going on
const selectActiveRentings =
    `SELECT r.id,
            r.bike_id,
            b.bike_number,
            b.model_name,
            r.user_id,
            u.name,
            u.last_name,
            r.status,
            renting_date,
            r.station_id_start,
            r.station_id_end,
            s_start.station_name as location_start_name,
            s_end.station_name as location_end_name,
            starting_time,
            b.conditions,
            r.finished_date
     FROM rentings r
              JOIN bikes b ON b.id = r.bike_id
              JOIN users u ON u.id = r.user_id
              JOIN station s_start ON s_start.id = r.station_id_start
              LEFT JOIN station s_end   ON s_end.id  = r.station_id_end
              `

const find = () => {
    return pool.query(selectActiveRentings).then((results) => (results.rows))
}

function create(req, res) {
    const {bike_id, user_id, last_name, status, renting_date, station_id_start,  starting_time} = req.body;
    (req.body)
    if (!bike_id || !user_id || !last_name || !status || !renting_date || !station_id_start || !starting_time) {
        return res
            .status(400)
            .send("Please insert a bike id, user id, status, renting date, station id, starting time");
    }
    return pool
        .query('INSERT INTO rentings (bike_id, user_id, last_name, status, renting_date, station_id_start, starting_time) VALUES ($1, $2, $3, $4, $5, $6, $7)', [bike_id, user_id, last_name, status, renting_date, station_id_start, starting_time])
        .then(() => res.send('Renting created'))
}


function update(req, res) {
    const {
        bike_id,
        user_id,
        last_name,
        status,
        renting_date,
        station_id_start,
        station_id_end,
        starting_time,
        conditions_id,
        finished_date
    } = req.body;
    const {id} = req.params;
    if (!bike_id
        || !user_id
        || !last_name
        || !status
        || !renting_date
        || !station_id_start
        || !station_id_end
        || !starting_time
        || !conditions_id
        || !finished_date) {
        return res
            .status(400)
            .send("Please insert a bike id, user id, last_name, status, renting date, station id-start, station id-end, time left, conditions");
    }
    return pool
        .query("UPDATE rentings SET bike_id = $2, user_id = $3, last_name=$4, status = $5, renting_date =$6, station_id_start = $7, station_id_end = $8, starting_time = $9, conditions_id = $10, finished_date = $11 WHERE id = $1", [id, bike_id, user_id, last_name, status, renting_date, station_id_start, station_id_end, starting_time, conditions_id, finished_date])
        .then(() => res.send('Renting Modified'))
}

async function updateRentingDate(req, res) {
    const {status, station_id_end, finished_date} = req.body;
    const {id} = req.params;
    if (!status || !station_id_end || !finished_date) {
        return res
            .status(400)
            .send("Please insert a status, station id_end, finished_date");
    }
    let renting = await pool.query("SELECT * FROM rentings WHERE id = $1", [id])
    if (renting.rows.length > 0) {
        (renting)
        renting = await pool.query("UPDATE rentings SET status=$2, station_id_end = $3, finished_date = $4 WHERE id = $1", [renting.rows[0].id, status, station_id_end, finished_date])
    }
    return res.send({message: 'Renting Modified', renting})

}

function remove(req, res) {
    const {id} = req.params;
    if (!id) {
        return res
            .status(400)
            .send("Please insert a id");
    }
    return pool
        .query("DELETE FROM rentings WHERE id = $1", [id])
        .then(() => res.send('Renting Eliminated'))

}

module.exports = {
    find: find,
    create: create,
    update: update,
    updateRentingDate: updateRentingDate,
    remove: remove,
};