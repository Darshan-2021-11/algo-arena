const { io } = require("..");
const { users, list} = require("../data_models");
const authorize = require("./authorize");

function autoCancel(id, roomid){
    const user = users.get(id);
    const socket = io.sockets.sockets.get(user.socketid);
    try {
        const callauthorize = authorize.bind(this);
        if (!callauthorize(id)) {
            return;
        }
        if (!roomid) {
            socket && socket.emit("canceled");
            return;
        }

        const room = list.get(roomid);

        if (room.mems > 1) {
            socket && socket.emit("server_report", { status: 3, message: "Match already started can not cancel." });
            return;
        }
        if (!user.online) {
            users.delete(id);
        }else{
            user.roomid = null;
            users.set(id, user);
        }
        clearTimeout(room.timeid);
        socket &&  socket.leave(roomid);
        list.delete(roomid);
        socket && socket.emit("canceled");
    } catch (error) {
        console.log(error)
        socket && socket.emit("canceled");
    }
}

module.exports = autoCancel