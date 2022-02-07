const pool = require("../db.js");
const sharp = require('sharp');


function find() {
    const selectBike = `SELECT b.id, b.bike_number, b.model_name, b.brand_name, b.status, b.entry_date, b.conditions, b.station_id, s.station_name
                        FROM bikes b
                                 JOIN station s ON b.station_id = s.id
                        ORDER BY b.bike_number`
    return pool.query(selectBike).then(results => results.rows)
}

async function findBike(req) {
    return await pool.query("SELECT * FROM bikes WHERE id = $1", [req.params.id]).then((results) => (results.rows[0]))
}

async function getBikePhoto(req) {
    return await pool.query("SELECT * FROM bike_photos WHERE bike_id = $1", [req.params.id]).then((results) => (results.rows[0].filedata))
}

async function create(req, res) {
    // TODO Move all this validations to controller
    const {
        model_name,
        brand_name, 
        status, 
        entry_date, 
        conditions, 
        station_id, 
        bike_number} = req.body;
    if (!model_name || !brand_name || !status || !entry_date || !conditions || !station_id || !bike_number) {
        return res.status(400).send("Please insert a model name, brand name, status, entry date, conditions, station, bike_number");
    }
    if (isNaN(bike_number) || bike_number <= 0) {
        return res.status(400).send("Bike number must be a number greather than 0");
    }
    pool
        .query("select * from bikes where bike_number = $1", [bike_number])
        .then(result => {
            if (result.rowCount === 1) {
                return res.status(401).send(`Bike number ${bike_number} already exist in database`)
            }
            return pool
                .query('INSERT INTO bikes (model_name, brand_name, status, entry_date, conditions, station_id, bike_number) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', [model_name, brand_name, status, entry_date, conditions, station_id, bike_number])
                .then(async (data) => {
                if (req.file){
                    console.log("inside")
                    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
                pool.query('INSERT INTO bike_photos (bike_id, filename, mimetype, filedata) VALUES ($1, $2, $3, $4)', [data.rows[0].id, req.file.originalname, req.file.mimetype, buffer])
                .then(() => res.send('Bike created'))
                } else {
                    res.send('Bike created without an image')
                }
        
            })
        })
}

async function update(req, res) {
    const {model_name, brand_name, status, entry_date, conditions, station_id, bike_number} = req.body;
    const {id} = req.params;
    console.log(`Updating bike ${bike_number} ${model_name} ${conditions}`)
    if (!model_name || !brand_name || !status || !entry_date || !conditions || !station_id || !bike_number) {
        return res
            .status(400)
            .send("Please insert a model name, brand name, entry date, conditions, station and bike number");
    }
    try {
        await pool
            .query("UPDATE bikes SET model_name =$2, brand_name =$3, status=$4, entry_date = $5, conditions = $6, station_id = $7, bike_number = $8 WHERE id = $1", [id, model_name, brand_name, status, entry_date, conditions, station_id, bike_number])
        if (req.file.buffer) {
            const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
            await pool.query("UPDATE bike_photos SET filename = $2, mimetype = $3, filedata = $4 WHERE bike_id = $1", [id, req.file.originalname, req.file.mimetype, buffer])
        }
        return res.send('Bike Modified')
    } catch (error) {
        return res.send(error.message)
    }
}

async function updateBikeStatus(req, res) {
    console.log(req.body)
    const {status, station_id} = req.body;
    const {id} = req.params;
    if (!status || !station_id) {
        return res
            .status(400)
            .send("Please insert a status, station_id");
    }
    let bike = await pool.query("SELECT * FROM bikes WHERE id = $1", [id])
    if (bike.rows.length > 0) {
        (bike)
        bike = await pool.query("UPDATE bikes SET status=$2, station_id = $3 WHERE id = $1", [bike.rows[0].id, status, station_id])
    }
    return res.send({message: 'Bike Modified', bike})
}

async function updateNewStatus(req, res) {
    const {status} = req.body;
    console.log(req.body)
    const {id} = req.params;
    if (!status) {
        return res
            .status(400)
            .send("Please insert a status");
    }
    let bike = await pool.query("SELECT * FROM bikes WHERE id = $1", [id])
    if (bike.rows.length > 0) {
        (bike)
        bike = await pool.query("UPDATE bikes SET status=$2 WHERE id = $1", [bike.rows[0].id, status])
    }
    return res.send({message: 'Bike Status Modified', bike})

}

async function deleteBikeStatus(req, res) {
    const {status} = req.body;
    const {id} = req.params;
    if (!status) {
        return res
            .status(400)
            .send("Please insert a new status");
    }
    let bike = await pool.query("SELECT * FROM bikes WHERE id = $1", [id])
    if (bike.rows.length > 0) {
        (bike)
        bike = await pool.query("UPDATE bikes SET status=$2 WHERE id = $1", [bike.rows[0].id, status])
    }
    return res.send({message: 'Bike Modified', bike})
}

function remove(req, res) {
    const {id} = req.params;
    if (!id) {
        return res
            .status(400)
            .send("Please insert a id");
    }
    return pool
        .query("DELETE FROM bikes WHERE id = $1", [id])
        .then(() => res.send('Bike Eliminated'))
}

module.exports = {
    find: find,
    findBike: findBike,
    getBikePhoto: getBikePhoto,
    create: create,
    update: update,
    updateBikeStatus: updateBikeStatus,
    updateNewStatus: updateNewStatus,
    deleteBikeStatus: deleteBikeStatus,
    remove: remove,
};