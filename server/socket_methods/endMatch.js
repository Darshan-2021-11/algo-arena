const { io } = require("..");
const { list, userToken, users } = require("../data_models");

function endMatch(roomid, draw){
    try {
        if(!roomid){
            return;
        }
        const room = list.get(roomid);
        room.mems.map((r)=>{
            const user = users.get(r.id);
            if(!user.online){
                users.delete(r.id);
                userToken.delete(r.socketid);
            }else{
                user.roomid = null;
                users.set(r.id,user);
            }
            const socket = io.sockets.sockets.get(user.socketid);
            draw && socket?.emit("draw")
            socket?.leave(roomid);
        })
        list.delete(roomid);
    } catch (error) {
        console.log(error);
    }
}

module.exports = endMatch;