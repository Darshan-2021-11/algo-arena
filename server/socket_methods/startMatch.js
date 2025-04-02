const { default: mongoose } = require("mongoose");
const { list, users, userToken } = require("../data_models");
const { v4 } = require("uuid");
const authorize = require("./authorize");
const { io } = require("..");

function autoCancel(tokenid, roomid){
    const userid = userToken.get(tokenid);
    const socket = io.sockets.sockets.get(userid);

    try {
        const callauthorize = authorize.bind(this);
        if (!callauthorize) {
            return;
        }
        if (!roomid) {
            socket.emit("canceled");
            return;
        }

        const room = list.get(roomid);

        if (room.mems > 1) {
            socket.emit("server_report", { status: 3, message: "Match already started can not cancel." });
            return;
        }
        const user = users.get(userid);
        console.log(users,userid,user,"yo")
        if (!user.online) {
            users.delete(userid);
            userToken.delete(this.userid);
        }
        users.roomid = null;
        users.set(userid, users);
        clearTimeout(room.timeid);
        socket.leave(roomid);
        list.delete(roomid);
        socket.emit("canceled");
    } catch (error) {
        console.log(error)
        socket.emit("canceled");
    }
}

async function startMatch() {
    try {
        const callauthorize = authorize.bind(this);
       if(!callauthorize){
        return;
       }
       const user = users.get(this.id);
       if(user.roomid){
        this.emit("server_report", {status:3.1,message:"User is already in a match."});
        return;
       }
        const roomid = v4();
        const problemschema = mongoose.connection.collection("problems");
        const problem = await problemschema.aggregate([
            { $sample: { size: 1 } },
            { $project: {  
                title:1,
                description:1,
                difficulty:1,
                tags:1,
                constraints:1,
                testcases:{$slice:["$testcases",3]}, 
            } }
        ]).toArray();

        if (!problem.length) {
            this.emit("server_report", {status:3.1,message:"unable to create room."});
            return;
        }
        user.roomid = roomid;
        users.set(this.id,user);
        
        const id = setTimeout(() => {
            autoCancel(user.id,roomid);
            clearTimeout(id);
        }, (10 * 1000));


        const Room = {
            mems: [{ name:user.name, id: user.id }],
            problem: problem[0],
            timeid: id
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
