const { io } = require("..");
const { waiting_lock, waiting_list } = require("../data_models");
const eventemmiter = require("../event");

function connect(userdata){
    waiting_lock = true;
    let data = waiting_list.shift();
    if(!data){
        waiting_list.push(userdata);
    }
    waiting_lock = false;
    eventemmiter.emit('unlock');
    if(data){
        const socket = io.sockets.sockets.get(data.socket_id);
        socket.join();
    }
    
}

module.exports = connect;