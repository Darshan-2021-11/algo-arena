const { io } = require("..");
const { requests_list, waiting_list } = require("../data_models");

function cancelMatch(roomid) {
    try {
        for (let i = 0; i < requests_list.length; i++) {
            if (requests_list[i].socket_id === roomid) {
                requests_list.splice(i, 1);
                return;
            }
        }
        for (let i = 0; i < waiting_list.length; i++) {
            if (waiting_list[i].socket_id === roomid) {
                waiting_list.splice(i, 1);
                break;
            }
        }

    } catch (error) {
        console.log(error)
    }
}

module.exports = cancelMatch;