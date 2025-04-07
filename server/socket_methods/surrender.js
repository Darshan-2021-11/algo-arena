const { io } = require("..");
const { list, users } = require("../data_models");
const completeMatch = require("../utils/completeMatch");
const authorize = require("./authorize");

async function surrender ({roomid,id}) {
    try {
        const callauthorize = authorize.bind(this);
       if(!callauthorize(id)){
        return;
       }
        if(!roomid){
            this.emit("server_report",{status:3.2,message:"Invalid request."});
            return;
        }
        const room = list.get(roomid);
        list.delete(roomid);
        if(!room){
            this.emit("server_report",{status:3.2,message:"Room does not exists anymore."});
            return;
        }
        let token;
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
            if(id === r.id){

                this.emit("lose");
                this.leave(roomid);
                
            }else{
                // this.emit("win");
               
                if(user.online){
                    const socket = io.sockets.sockets.get(user.socketid);
                    if(socket){
                        socket.leave(roomid);
                        socket.emit("win");
                    }
                }
            }
            
        })
        
        clearTimeout(room.timeid)
        try {
            
            room.duelid && await completeMatch(
                id, 
                "lose", 
                room.mems[1].id === id ? room.mems[0].id : room.mems[1].id, 
                room.duelid, 
                null, 
                null, 
                token 
            );
        } catch (error) {
            console.log(error)
        }
       
    } catch (error) {
        this.emit("server_report",{status:3.2,message:"Unable to surrender."});
    }
}

module.exports = surrender;