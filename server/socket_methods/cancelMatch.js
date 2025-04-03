const { list, users } = require("../data_models");
const authorize = require("./authorize");

function cancelMatch({roomid,id}) {
    try {
        const callauthorize = authorize.bind(this);
       if(!callauthorize(id)){
        return;
       }
        if (!roomid) {
            this.emit("canceled");
            return;
        }

        const room = list.get(roomid);

        if (room.mems > 1) {
            this.emit("server_report", {status:3,message:"Match already started can not cancel."});
            return;
        }
        const user = users.get(id);
        if(!user.online){
            users.delete(id);
        }else{
            user.roomid = null;
            users.set(this.id, user);
        }
       
        clearTimeout(room.timeid);
        this.leave(roomid);
        list.delete(roomid);
        this.emit("canceled");
    } catch (error) {
        console.log(error)
        this.emit("canceled");
    }
}

module.exports = cancelMatch;