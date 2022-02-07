const {locationsRepo} = require("../repositories");
const ctrl = require("express").Router();

ctrl.get("/", function (req, res, next) {
    locationsRepo
        .find()
        .then(rows => {
            return res.json(rows)
        })
        .catch((err) => {
            console.error(err.stack)
            next(new Error("Server error when reading all the locations"))
        });
});

module.exports = ctrl;