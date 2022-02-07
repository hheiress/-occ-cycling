const {usersRepo} = require("../repositories");
const ctrl = require("express").Router();
const {formatDate} = require("../utils/formatUtils");
const multer = require("multer");

ctrl.get("/", function (req, res, next) {
    usersRepo
        .find()
        .then(rows => {
            for (let i = 0; i < rows.length; i++) {
                rows[i].date_birth = formatDate(rows[i].date_birth);
            }
            res.json(rows)
        })
        .catch((err) => {
            console.error(err.stack)
            next(new Error("Error while reading all the users"))
        });
});

ctrl.get("/:id", function (req, res, next) {
    usersRepo
        .findUser(req)
        .then(user => {
            user.date_birth = formatDate(user.date_birth);
            return res.json(user)
        })
        .catch((err) => {
            console.error(err.stack)
            next(new Error(`Error when reading a specific user ${req.params.id}`))
        });
});

ctrl.get("/:id/photo", function (req, res, next) {
    usersRepo
        .getUserPhoto(req)
        .then((results) => {
            res.set('Content-Type', 'image/png')
            res.send(results)
        })
        .catch((err) => {
            console.error(err.stack)
            next(new Error(`Error when reading the photo of a specific user ${req.params.id}`))
        });
})

const upload = multer({
    limits: {
        fileSize: 10000000
    },
})

ctrl.post("/", upload.single("user_photo"), function (req, res, next) {
    usersRepo
        .create(req, res)
        .catch((err) => {
            console.error(err.stack)
            next(new Error(`Error when creating a user`))
        });
});


ctrl.put("/:id", upload.single("user_photo"), function (req, res, next) {
    usersRepo
        .update(req, res)
        .catch((err) => {
            console.error(err.stack);
            next(new Error(`Error when updating the user ${req.params.id}`))
        });
});

ctrl.put("/update/:id", function (req, res, next) {
    usersRepo
        .updateUserStatus(req, res)
        .catch((err) => {
            console.error(err.stack);
            next(new Error(`Error when adding status for user ${req.params.id}`))
        });
});

ctrl.put("/delete/:id", function (req, res, next) {
    usersRepo
        .deleteUserStatus(req, res)
        .catch((err) => {
            console.error(err.stack)
            next(new Error(`Error when deleting status for user ${req.params.id}`))
        })
});

ctrl.delete("/:id", function (req, res, next) {
    usersRepo
        .remove(req, res)
        .catch((err) => {
            (err.stack);
            next(new Error(`Error when removing user ${req.params.id}`))
        });
});

module.exports = ctrl;