const {bannRepo} = require("../repositories");
const ctrl = require("express").Router();

ctrl.get("/", function (req, res, next) {
    bannRepo
        .find()
        .then(rows => res.json(rows))
        .catch((err) => {
            console.error(err.stack)
            next( new Error (`Error trying to read all the banns of user ${err.message}`))
        });
});
ctrl.get("/:id", function(req,res,next){
    bannRepo
        .findUserBann(req)
        .then(rows => res.json(rows))
        .catch((err) => {
            console.error(err.stack)
            next( new Error (`Error trying to read all the banns of user ${err.message}`))
        });

})
ctrl.post("/",  function (req, res, next) {
    bannRepo
    .create(req, res)
    .catch((err) => {
        console.error(err.stack)
        next( new Error ("Internal server error"))
    });
});

ctrl.put("/:id", function(req, res, next) {
    bannRepo
        .update(req, res)
        .catch((err) => {
            console.error(err.stack)
            next( new Error ("Internal server error"))
        })
});
module.exports = ctrl;