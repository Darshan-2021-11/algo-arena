const { list, users, userToken } = require("../data_models");
const authorize = require("./authorize");

function cancelMatch(roomid) {
    try {
        console.log("canceling",roomid)
        const callauthorize = authorize.bind(this);
       if(!callauthorize){
        return;
       }
        if (!roomid) {
            this.emit("canceled");
            return;
        }

        const room = list.get(roomid);
        console.log(room.mems.length)

        if (room.mems > 1) {
            this.emit("server_report", {status:3,message:"Match already started can not cancel."});
            return;
        }
        const user = users.get(this.id);
        console.log(user.online)
        if(!user.online){
            users.delete(this.id);
            userToken.delete(user.id);
        }
        users.roomid = null;
        users.set(this.id, users);
        clearTimeout(room.timeid);
        this.leave(roomid);
        list.delete(roomid);
        this.emit("canceled");
        console.log('canceled')
    } catch (error) {
        console.log(error)
        this.emit("canceled");
    }
}

module.exports = cancelMatch;