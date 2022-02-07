const {jwtAuthRepo} = require("../repositories");
const ctrl = require("express").Router();
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

ctrl.post("/register", validInfo, function (req, res, next)  {
    jwtAuthRepo
    .register(req, res)
    .catch((err) => {
        console.error(err.stack);
        next( new Error ("Internal server error"))
    })
})

ctrl.post("/login", validInfo, function (req, res, next)  {
    jwtAuthRepo
    .login(req, res)
    .catch((err) => {
        console.error(err.stack);
        next( new Error ("Internal server error"))
    })
})

ctrl.get("/verify", authorization, function (req, res)  {
    jwtAuthRepo
    .loginAuth(req, res)
})

module.exports = ctrl;