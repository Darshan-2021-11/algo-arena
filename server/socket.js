const { io } = require(".");
const { startMatch, endMatch } = require("./socket_methods");

if(!io){
    return;
}
io.on('connection', async(socket) => {
    try {
        socket.on('startMatch',startMatch.bind({socket},data));
        socket.on('endMatch',endMatch.bind({socket},data));
    } catch (error) {
        console.log(err);
    }
});
/*

*/

