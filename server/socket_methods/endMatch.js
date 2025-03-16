const { io } = require("..");
const { ongoing_matches_list } = require("../data_models");

function endMatch (roomid){
    try {
        const room = ongoing_matches_list.get(roomid);
        io.to(roomid).emit('matchEnd',{winner:room.winner});
        const mem1 = io.sockets.sockets.get(room.users[0].socket_id);
        mem1.leave(roomid);
        const mem2 = io.sockets.sockets.get(room.users[1].socket_id);
        mem2.leave(roomid);
        ongoing_matches_list.delete(roomid);
    } catch (error) {
        console.log(error)
    }
}

module.exports = endMatch;