const {rentingsRepo} = require("../repositories");
const ctrl = require("express").Router();


ctrl.get ("/", function (req, res, next) {
    rentingsRepo
        .find()
        .then((results) => {
            res.json(results)
        })
        .catch((err) => {
            console.error(err.stack)
            next( new Error ("Internal server error"))
        });
});


ctrl.post("/", function (req, res, next) {
    rentingsRepo
    .create(req, res)
    .catch((err) => {
        console.error(err.stack)
        next( new Error ("Internal server error"))
    });
});

ctrl.put("/:id", function(req, res, next) {
    rentingsRepo
        .update(req, res)
        .catch((err) => {
            console.error(err.stack)
            next( new Error ("Internal server error")) 
        })
});

ctrl.put("/update/:id", function(req, res, next) {
    rentingsRepo
        .updateRentingDate(req, res)
        .catch((err) => {
            console.error(err.stack)
            next( new Error ("Internal server error")) 
        })
});

ctrl.delete("/:id", function(req, res, next) {
    rentingsRepo
        .remove(req, res)
        .catch((err) => {
            console.error(err.stack)
            next( new Error ("Internal server error"))
        })
});

module.exports = ctrl;