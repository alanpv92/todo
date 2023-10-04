const express = require("express");
const authenticationRouter = require("./authentication/index");
const router = express.Router();

router.use("/authentication", authenticationRouter);

module.exports = router;
