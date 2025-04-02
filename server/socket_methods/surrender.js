const { io } = require("..");
const { list } = require("../data_models");

const surrender =(roomid)=>{
    try {
        const callauthorize = authorize.bind(this);
       if(!callauthorize){
        return;
       }
        if(!roomid){
            this.emit("server_report",{status:3,message:"Invalid request."});
            return;
        }
        const room = list.get(roomid);
        list.delete(roomid);
        if(!room){
            this.emit("server_report",{status:3.1,message:"Room does not exists anymore."});
            return;
        }
        room.map(({id})=>{
            if(id === roomid){
                this.emit("lose");
                this.leave(roomid);
            }else{
                this.emit("win");
                const socket = io.sockets.sockets.get(roomid);
                if(socket){
                    socket.leave(roomid);
                }
            }
            
        })
       
    } catch (error) {
        console.log(error)
        this.emit("server_report",{status:3.1,message:"Unable to surrender."});
    }
}

module.exports = surrender;