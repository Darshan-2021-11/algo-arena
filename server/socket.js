const { io } = require('.');
const { startMatch, endMatch, submit } = require("./socket_methods");


io.on('connection', async(socket) => {
    try {
        console.log('user connected')
        socket.on('startMatch',(data)=>{
            startMatch(socket,data)
        });
        // socket.on('endMatch',endMatch.bind({socket},data));
        socket.on('submit',(data)=>{submit(socket,data)});
        socket.on('disconnect',()=>{
            console.log('user disconnected');
        })
    } catch (error) {
        console.log(error);
    }
});
/*

*/

