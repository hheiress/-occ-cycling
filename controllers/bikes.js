const {bikesRepo} = require("../repositories");
const ctrl = require("express").Router();
const multer = require("multer")

ctrl.get ("/", function (req, res, next) {
    bikesRepo
        .find()
        .then(rows => res.json(rows))
        .catch((err) => {
            console.error(err.stack)
            next( new Error (`Error trying to read all the bikes ${err.message}`))
        });
});

ctrl.get ("/:id", function (req, res, next) {
    bikesRepo
        .findBike(req)
        .then((results) => res.json(results))
        .catch((err) => {
            console.error(err.stack)
            next( new Error ("Internal server error"))
        });
});

ctrl.get("/:id/photo", function (req, res, next) {
    bikesRepo
        .getBikePhoto(req)
        .then((results) => {
            res.set('Content-Type', 'image/png')
            res.send(results)
        })
        .catch((err) => {
            console.error(err.stack)
            next( new Error ("Internal server error"))
        });
})

const upload = multer({
    limits:{fileSize:10000000
    },
})

ctrl.post("/",  upload.single("user_photo"), function (req, res, next) {
    bikesRepo
    .create(req, res)
    .catch((err) => {
        console.error(err.stack)
        next( new Error ("Internal server error"))
    });
});

ctrl.put("/:id", upload.single("bike_photo"), function(req, res, next) {
    bikesRepo
        .update(req, res)
        .catch((err) => {
            console.error(err.stack)
            next( new Error ("Internal server error"))
        })
});

ctrl.put("/update/:id", function(req, res, next) {
    bikesRepo
        .updateBikeStatus(req, res)
        .catch((err) => {
            console.error(err.stack)
            next( new Error ("Internal server error"))
        })
});

ctrl.put("/update/status/:id", function(req, res, next) {
    bikesRepo
        .updateNewStatus(req, res)
        .catch((err) => {
            console.error(err.stack)
            next( new Error ("Internal server error"))
        })
});

ctrl.put("/delete/:id", function(req, res, next) {
    (req.body)
    bikesRepo
        .deleteBikeStatus(req, res)
        .catch((err) => {
            console.error(err.stack)
            next( new Error ("Internal server error"))
        })
});

ctrl.delete("/:id", function(req, res, next) {
    bikesRepo
        .remove(req, res)
        .catch((err) => {
            console.error(err.stack)
            next( new Error ("Internal server error"))
        })
});

module.exports = ctrl;