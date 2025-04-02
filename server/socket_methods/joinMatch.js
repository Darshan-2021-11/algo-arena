const { io } = require("..");
const { list, users, userToken } = require("../data_models");
const authorize = require("./authorize");
const endMatch = require("./endMatch");

async function joinMatch(roomid) {
    try {
        
        const callauthorize = authorize.bind(this);
       if(!callauthorize){
        return;
       }
       const user = users.get(this.id);
       if(user.roomid){
        this.emit("server_report", {status:3,message:"User is already in a room."});
        return;
       }
        if (!roomid) {
            this.emit("server_report", {status:3.2,message:"Unable to join room."});
            return;
        }
        const room = io.sockets.adapter.rooms.get(roomid);
        if (!room) {
            this.emit("server_report", {status:3.2,message:"Unable to join room."});
            this.emit("server_report", {status:3.2,message:"This room does not exists."});
            return;
        }
        if (room.size >= 2) {
            this.emit("server_report", {status:3.2,message:"Room is already full."});
            return;
        }
       
        const Room = list.get(roomid);
        const newuser = users.get(this.id);
        const usertoken = userToken.get(newuser.id);
        if(usertoken === Room.mems[0]){
            this.emit("server_report", {status:3.2,message:"Are you trying to play with your self ?"});
            return;
        }
        newuser.roomid = roomid;
        users.set(this.id,newuser);
        this.join(roomid);
        clearTimeout(Room.timeid);
            const id = setTimeout(() => {
            endMatch(roomid);
            clearTimeout(id);
        }, (30 * 60 * 1000));
        
        Room.mems.push({name:user.name,id: user.id });
        
        list.set(roomid, Room);
        this.to(roomid).emit("server_report",{status:1,message:`${user.name} joined the room.`});
        this.to(roomid).emi("begin",Room.problem)

    } catch (error) {
        console.log(error);
        this.emit("server_report",{status:3.2,message:"Unable to join room."});
    }
}

module.exports = joinMatch;