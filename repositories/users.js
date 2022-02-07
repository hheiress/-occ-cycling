const pool = require("../db.js");
const sharp = require('sharp');

function find() {
    return pool.query("SELECT * FROM users").then((results) => (results.rows))
}

async function findUser(req) {
    return await pool.query("SELECT * FROM users WHERE id = $1", [req.params.id]).then((results) => (results.rows[0]))
}

async function getUserPhoto(req) {
    return await pool.query("SELECT * FROM user_photos WHERE user_id = $1", [req.params.id]).then((results) => (results.rows[0].filedata))
}

async function create(req, res) {
    const {
        name,
        last_name,
        passport,
        location_id,
        address,
        gender,
        date_birth,
        nationality,
        email,
        phone_number,
        status
    } = req.body;
    if (!name || !last_name || !passport || !location_id || !address || !gender || !date_birth || !nationality || !email || !phone_number || !status) {
        return res
            .status(400)
            .send("Please insert a name, last name, passport, location, address, gender, date birth, nationality, email, phone number, status");
    }
    return pool
        .query('INSERT INTO users (name, last_name, passport, location_id, address, gender, date_birth, nationality, email, phone_number, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id',
            [name, last_name, passport, location_id, address, gender, date_birth, nationality, email, phone_number, status])
        .then(async (data) =>{ 
            if (req.file){
                console.log("inside")
             const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
             pool.query('INSERT INTO user_photos (user_id, filename, mimetype, filedata) VALUES ($1, $2, $3, $4)',
            [data.rows[0].id, req.file.originalname, req.file.mimetype, buffer])
            .then(() => res.send(`User created`))
            } else {
                res.send('User created without an image')
            }
        })
        
}


async function update(req, res) {
    const {name, last_name, passport, location_id, address, gender, date_birth, nationality, email, phone_number, status} = req.body;
    const {id} = req.params;

    if (!name || !last_name || !passport || !location_id || !address || !gender || !date_birth || !nationality || !email || !phone_number || !status) {
        return res
            .status(400)
            .send("Please insert a name, last name, passport, location, address, gender, date birth, nationality, email, phone number, status");
    }
    try {
        await pool.query("UPDATE users SET name = $2, last_name = $3, passport = $4, address = $5, gender = $6, date_birth = $7, nationality = $8, email = $9, phone_number = $10, status=$11, location_id=$12 WHERE id = $1",
            [id, name, last_name, passport, address, gender, date_birth, nationality, email, phone_number, status, location_id])
        if (req.file.buffer) {
            const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
            await pool.query("UPDATE user_photos SET filename = $2, mimetype = $3, filedata = $4 WHERE user_id = $1", [id, req.file.originalname, req.file.mimetype, buffer])
        }
        return res.send(`User updated`)
    } catch (error) {
        return res.send(error.message)
    }
}

async function updateUserStatus(req, res) {
    const {status} = req.body;
    console.log(req.body)
    const {id} = req.params;
    if (!status) {
        return res
            .status(400)
            .send("Please insert a status");
    }
    let user = await pool.query("SELECT * FROM users WHERE id = $1", [id])
    if (user.rows.length > 0) {
        (user)
        user = await pool.query("UPDATE users SET status=$2 WHERE id = $1", [user.rows[0].id, status])
    }
    return res.send({message: 'User Status Modified', user})

}

async function deleteUserStatus(req, res) {
    const {status} = req.body;
    const {id} = req.params;
    if (!status) {
        return res
            .status(400)
            .send("Please insert a new status");
    }
    let user = await pool.query("SELECT * FROM users WHERE id = $1", [id])
    if (user.rows.length > 0) {
        user = await pool.query("UPDATE users SET status=$2 WHERE id = $1", [user.rows[0].id, status])
    }
    return res.send({message: 'User Modified', user})
}

function remove(req, res) {
    const {id} = req.params;
    if (!id) {
        return res
            .status(400)
            .send("Please insert a id");
    }
    // TODO fix this as a user with rentings can not be removed this way
    return pool
        .query("DELETE FROM users WHERE id = $1", [id])
        .then(() => res.send('User Eliminated'))

}

module.exports = {
    find: find,
    findUser: findUser,
    getUserPhoto: getUserPhoto,
    create: create,
    update: update,
    updateUserStatus: updateUserStatus,
    deleteUserStatus: deleteUserStatus,
    remove: remove,
};