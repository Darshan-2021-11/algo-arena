const { io } = require("..");
const { list, users } = require("../data_models");
const authorize = require("./authorize");

function surrender ({roomid,id}) {
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
        room.mems.map((r)=>{
            const user = users.get(r.id);
            if(!user.online){
                users.delete(r.id);
                userToken.delete(r.socketid);
            }else{
                user.roomid = null;
                users.set(r.id,user);
            }
           
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
       
    } catch (error) {
        this.emit("server_report",{status:3.2,message:"Unable to surrender."});
    }
}

module.exports = surrender;