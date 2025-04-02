const { io } = require("..");
const { list, userToken, users } = require("../data_models");

function endMatch(roomid){
    try {
        
        if(!roomid){
            return;
        }
        const room = list.get(roomid);
        const socketroom =  io.sockets.adapter.rooms.get(roomid);
        socketroom.emit("draw");
        room.mems.map((r)=>{
            const usertoken = userToken.get(r.id);
            const user = users.get(usertoken);
            if(!user.online){
                users.delete(usertoken);
                userToken.delete(r.id);
            }else{
                user.roomid = null;
                users.set(usertoken,user);
            }
            io.sockets.sockets.get(r.id).leave(roomid);
        })
        list.delete(roomid);
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = endMatch;