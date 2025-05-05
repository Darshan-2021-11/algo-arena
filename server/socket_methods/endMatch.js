const { io } = require("..");
const { list, userToken, users } = require("../data_models");
const completeMatch = require("../utils/completeMatch");

async function endMatch(roomid, draw){
    try {
        if(!roomid){
            return;
        }
        const room = list.get(roomid);
        let token ;
        room.mems.map((r)=>{
            const user = users.get(r.id);
            if(!user.online){
                users.delete(r.id);
                userToken.delete(r.socketid);
            }else{
                user.roomid = null;
                users.set(r.id,user);
            }
            token = user.token;
            const socket = io.sockets.sockets.get(user.socketid);
            draw && socket?.emit("draw")
            socket?.leave(roomid);
        })
        list.delete(roomid);
        console.log("fsdoifjoaisdfjoidsa",room.duelid)
        draw && room.duelid && await completeMatch(room.mems[0].id, "draw", room.mems[1].id, room.duelid, null, null, token );
    } catch (error) {
        console.log(error);
    }
}

module.exports = endMatch;