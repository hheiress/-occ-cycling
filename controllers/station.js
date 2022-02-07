const {stationsRepo} = require("../repositories");
const ctrl = require("express").Router();


ctrl.get ("/", function (req, res, next) {
    stationsRepo
        .find()
        .then((results) => res.json(results))
        .catch((err) => {
            console.error(err.stack)
            next( new Error ("Internal server error"))
        });
});

ctrl.post("/", function (req, res, next) {
    stationsRepo
    .create(req, res)
    .catch((err) => {
        console.error(err.stack)
        next( new Error ("Internal server error"))
    })
});

ctrl.put("/:id", function(req, res, next) {
    stationsRepo
        .update(req, res)
        .catch((err) => {
            console.error(err.message);
            next( new Error ("Internal server error"))
        })
});

ctrl.delete("/:id", function(req, res, next) {
    stationsRepo
        .remove(req, res)
        .catch((err) => {
            (err.message);
            next( new Error ("Internal server error"))
        })

});

module.exports = ctrl;