const { requests_list, waiting_lock } = require("../data_models");
const connect = require("./connect");

function startMatch(userdata){
    try {
        const data = {...userdata, socket_id:this.socket.id};
        if(waiting_lock){
            requests_list.push(data);
        }else{
            connect(data);
        }
        // eventemmiter.emit('unlock');
    } catch (error) {
        
    }
}
/*
check in waiting list if match found connect them create a room store in match list if not found add to the waiting list
*/

/*
when 2 people check for waiting player in an empty list 1st one will check for place and 2nd one will chceck for empty  and then both will get nothing

*/

module.exports = startMatch
