const { io } = require("..");
const { waiting_list, ongoing_matches_list } = require("../data_models");
const eventemmiter = require("../event");
const getquestion = require("../getquestion");
const {PROBLEMS} = require('../problems'); 
const endMatch = require("./endMatch");

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
        const socket2 = io.sockets.sockets.get(userdata.socket_id);
        const roomid = `${data.socket_id} +${userdata.socket_id}` ;
        socket.join(roomid);
        socket2.join(roomid);
        // const question = getquestion();
        const question = PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)];
        const timeid = setTimeout(() => {
            endMatch(roomid)
            clearTimeout(timeid);
        }, 1800);
        const room = {
            users:[data,userdata],
            question:1,
            expireat:Date.now() + 1800,
            winner:data,
            processing:false,
            timeid
        }
        console.log(roomid)
        io.to(roomid).emit('matchstart',{problemid:question.id,roomid, users:[data.name,userdata.name], time: room.expireat });
        ongoing_matches_list.set(roomid,room);
    }
    
}

module.exports = connect;