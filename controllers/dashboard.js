const {dashboardRepo} = require("../repositories");
const ctrl = require("express").Router();
const authorization = require("../middleware/authorization");

ctrl.get("/", authorization, function (req, res, next)  {
    dashboardRepo
    .dashboard(req, res)
    .catch((err) => {
        console.error(err.stack);
        next( new Error ("Internal server error"))
    })
})

module.exports = ctrl;