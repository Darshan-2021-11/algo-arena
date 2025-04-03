const { list, users } = require("../data_models");
const { v4 } = require("uuid");
const authorize = require("./authorize");
const autoCancel = require("./autocancelMatch");



async function startMatch(id) {
    try {
        const callauthorize = authorize.bind(this);
       if(!callauthorize(id)){
        return;
       }
       const user = users.get(id);
       if(user.roomid){
        this.emit("server_report", {status:3.1,message:"User is already in a match."});
        return;
       }
        const roomid = v4();
       
        user.roomid = roomid;
        users.set(id,user);
        
        const tid = setTimeout(() => {
            autoCancel(id,roomid);
            clearTimeout(tid);
        }, ( 5 * 60 * 1000));


        const Room = {
            mems: [{ name:user.name, id }],
            problem: null,
            timeid: tid
        }

        this.join(roomid);
        list.set(roomid, Room)
        this.emit("created", { roomid, message: "Room created successfully." });
       
    } catch (error) {
        console.log(error);
        this.emit("server_report", { status: 3.1, message: "Unable to create room." });
    }
}

module.exports = startMatch
