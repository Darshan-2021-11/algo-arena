const events = require('events');
const { requests_list } = require('./data_models');
const eventemmiter = new events.EventEmitter();

eventemmiter.on('unlock', () => {
    let data = requests_list.shift();
    if (data) {
        const startMatch = require('./socket_methods/startMatch');
        startMatch(data);
    }
});

module.exports = eventemmiter;
