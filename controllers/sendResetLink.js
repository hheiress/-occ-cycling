const {resetLinkRepo} = require("../repositories");
const ctrl = require("express").Router();



ctrl.post("/forgot_password", function (req, res) {
    resetLinkRepo
    .sendResetLink (req, res)
    });

ctrl.post("/reset-password/:token", function (req, res) {
    resetLinkRepo
    .resetPassword (req, res)
});


module.exports = ctrl;