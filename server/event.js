const events = require('events');
const { requests_list } = require('./data_models');
const startMatch = require('./socket_methods/startMatch');
const eventemmiter = events.EventEmitter();

eventemmiter.on('unlock',()=>{
    let data = requests_list.shift();
    if(data){
        startMatch(data);
    }
});


module.exports = eventemmiter;