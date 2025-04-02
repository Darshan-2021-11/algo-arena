const { list } = require("../data_models");
const authorize = require("./authorize");

function listMatch({ page = 0, limit = 10 }) {
    try {
        const callauthorize = authorize.bind(this);
        if (!callauthorize) {
            return;
        }
        const l = Array.from(list);
        let roomlist = l.slice(page * limit, limit);
        roomlist = roomlist.map((r) => {
            if (r[1].mems.length == 1) {
                return { roomid: r[1].roomid, creator: r[1].mems[0].name }
            }
        })
        this.emit("roomlist", roomlist);
    } catch (error) {
        console.log(error);
        this.emit("server_report", { status: 3, message: "unable to get rooms." })
    }
}

module.exports = listMatch;