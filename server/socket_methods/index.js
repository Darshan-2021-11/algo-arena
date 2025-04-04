const cancelMatch = require("./cancelMatch");
const startMatch = require("./startMatch");
const submit = require("./submit");
const surrender = require("./surrender");
const listMatch = require("./listMatch");
const joinMatch = require("./joinMatch");
const authorize = require("./authorize");

module.exports = {
    startMatch,
    submit,
    cancelMatch,
    surrender,
    listMatch,
    joinMatch,
    authorize
}