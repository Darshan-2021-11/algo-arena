const { list } = require("../data_models");
const authorize = require("./authorize");

function listMatch({ limit = 10, id }) {
    try {
        const callauthorize = authorize.bind(this);
        if (!callauthorize(id)) {
            return;
        }
        const l = Array.from(list);
        const res = [];
        for(let i=0;i<l.length;i++){
            if (l[i][1].mems.length == 1) {
                res.push({roomid: l[i][0], creator: l[i][1].mems[0].name })
            }
        }
      
        this.emit("roomlist", res);
    } catch (error) {
        console.log(error);
        this.emit("server_report", { status: 3, message: "unable to get rooms." })
    }
}

module.exports = listMatch;