const { io } = require('.');
const { startMatch, endMatch, submit, cancelMatch, surrender } = require("./socket_methods");


io.on('connection', async(socket) => {
    try {
        socket.on('startMatch',(data)=>{
            startMatch(socket,data)
        });
        // socket.on('endMatch',endMatch.bind({socket},data));
        socket.on('submit',(data)=>{submit(socket,data)});
        socket.on("cancelMatch",(data)=>{cancelMatch(data)})
        socket.on('disconnect',()=>{
            console.log('user disconnected');
        })
        socket.on('surrenderMatch',(data)=>{surrender(socket,data)});
    } catch (error) {
        console.log(error);
    }
});
/*

*/
