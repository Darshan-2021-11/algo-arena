const waiting_list = [];
/*
player will be stored here when starting the match
*/

const requests_list = [];

const ongoing_matches_list = [];
/*
current matches
*/

let waiting_lock = false;

const ongoing_matches_lock = false;

module.exports = {
    waiting_list,
    ongoing_matches_list,
    requests_list,
    waiting_lock,
    ongoing_matches_lock
}